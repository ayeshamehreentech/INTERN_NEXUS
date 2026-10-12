"""Cloud frontend never executes learner source. Calls a trusted remote backend."""
import hashlib
import hmac
import json
import re
import time
from urllib.parse import urlsplit
import httpx


class BackendUnavailable(ValueError):
    pass


def subject_identity(issuer, subject, secret):
    if not issuer or not subject or len(secret)<32:
        raise ValueError('An issuer, subject, and identity secret of at least 32 characters are required.')
    return hmac.new(secret.encode(),json.dumps([issuer,subject],separators=(',',':')).encode(),hashlib.sha256).hexdigest()


def access_token(identity, secret, expires=None):
    if not re.fullmatch(r'[a-f0-9]{64}',identity) or len(secret)<32: raise ValueError('Invalid API credentials.')
    expiry = int(expires if expires is not None else time.time()+120)
    message = identity+'.'+str(expiry)
    signature = hmac.new(secret.encode(),message.encode(),hashlib.sha256).hexdigest()
    return message+'.'+signature


def verify_token(token, secret):
    try:
        identity,expiry,signature = token.split('.')
        if not re.fullmatch(r'[a-f0-9]{64}',identity) or not re.fullmatch(r'[a-f0-9]{64}',signature): raise ValueError()
        if not time.time()<int(expiry)<=time.time()+300: raise ValueError()
        expected = access_token(identity,secret,int(expiry)).rsplit('.',1)[1]
        if not hmac.compare_digest(signature,expected): raise ValueError()
        return identity
    except (ValueError,TypeError): raise BackendUnavailable('Authentication failed.') from None


class RemoteClient:
    def __init__(self,url,secret,allow_local_http=False):
        parsed=urlsplit(url)
        local=parsed.hostname in {'127.0.0.1','localhost'} and allow_local_http
        if parsed.scheme!='https' and not (parsed.scheme=='http' and local): raise ValueError('Remote backend requires HTTPS.')
        if not parsed.hostname or parsed.username or parsed.password or parsed.query or parsed.fragment: raise ValueError('Invalid backend URL.')
        if len(secret)<32: raise ValueError('Remote backend secret must contain at least 32 characters.')
        self.url,self.secret=url.rstrip('/'),secret

    def call(self,identity,action,payload=None):
        try:
            response=httpx.post(self.url+'/v1/action',json={'action':action,'payload':payload or {}},
                                headers={'Authorization':'Bearer '+access_token(identity,self.secret)},timeout=65,follow_redirects=False)
            value=response.json()
            if response.status_code!=200: raise BackendUnavailable(value.get('error','Backend request failed. Retry later.'))
            if not isinstance(value,dict) or 'result' not in value: raise BackendUnavailable('Invalid backend response.')
            return value['result']
        except (httpx.HTTPError,json.JSONDecodeError) as exc:
            raise BackendUnavailable('The learning service is unavailable. Your code remains in the editor; retry later.') from None
