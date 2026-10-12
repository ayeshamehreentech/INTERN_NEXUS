"""Optional, documented fal queue REST adapter. Server-side credentials only."""
import json
import re
import ssl
from urllib.parse import urlsplit
import httpx

MODEL='fal-ai/kling-video/v3/standard/text-to-video'

class VideoProviderError(RuntimeError):
    def __init__(self,message,*,uncertain=False):super().__init__(message);self.uncertain=uncertain

def media_location(value):
    url=urlsplit(value or '')
    if url.scheme!='https' or url.username or url.password or url.port not in (None,443):raise VideoProviderError('Provider returned an invalid video location.')
    if not (url.hostname=='storage.googleapis.com' or url.hostname=='fal.media' or (url.hostname or '').endswith('.fal.media')):raise VideoProviderError('Provider video host is not approved.')
    return value

class FalVideoProvider:
    name='fal';model=MODEL
    def __init__(self,key,client=None):
        if not key:raise ValueError('Video provider is not configured.')
        self.key=key;self.client=client or httpx.Client(timeout=20,verify=ssl.create_default_context(),follow_redirects=False)
    def _call(self,method,url,**kwargs):
        try:
            response=self.client.request(method,url,headers={'Authorization':'Key '+self.key},**kwargs)
            response.raise_for_status();return response.json()
        except httpx.HTTPStatusError as exc:
            status=exc.response.status_code
            raise VideoProviderError(f'Video provider request failed (HTTP {status}). Retry status checks later.',uncertain=method=='POST' and status>=500) from None
        except (httpx.HTTPError,ValueError):
            raise VideoProviderError('Video provider could not confirm the request. Check the provider dashboard before submitting again.',uncertain=method=='POST') from None
    def _queue_url(self,value,job_id):
        parsed=urlsplit(value or '')
        if parsed.scheme!='https' or parsed.netloc!='queue.fal.run' or '/requests/'+job_id not in parsed.path:raise VideoProviderError('Provider returned an invalid job URL.',uncertain=True)
        return value
    def submit(self,prompt):
        result=self._call('POST','https://queue.fal.run/'+self.model,json={'prompt':prompt,'duration':'15','aspect_ratio':'16:9','generate_audio':False})
        job=result.get('request_id','')
        if not isinstance(job,str) or not re.fullmatch(r'[A-Za-z0-9_-]{1,160}',job):raise VideoProviderError('Provider did not confirm a valid job ID.',uncertain=True)
        return {'job_id':job,'status_url':self._queue_url(result.get('status_url'),job),'response_url':self._queue_url(result.get('response_url'),job)}
    def poll(self,row):
        data=json.loads(row['provider_data']);job=row['job_id']
        response=self._call('GET',self._queue_url(data.get('status_url'),job))
        status=response.get('status')
        if status in ('IN_QUEUE','IN_PROGRESS'):return {'status':'pending'}
        if status!='COMPLETED':raise VideoProviderError('Provider status is not recognized. Keep the job and retry its status.')
        if response.get('error'):return {'status':'failed','error_state':'Provider reported a failed job. Inspect its dashboard; this job will not be resubmitted.'}
        result=self._call('GET',self._queue_url(data.get('response_url'),job))
        return {'status':'completed','video_location':media_location((result.get('video') or {}).get('url'))}
