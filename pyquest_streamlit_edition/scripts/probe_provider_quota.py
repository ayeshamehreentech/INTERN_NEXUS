"""Small operator request; print only status and sanitized quota metadata."""
import json
import re
import sys
from pathlib import Path
from dotenv import load_dotenv
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))

def main():
    load_dotenv(Path(__file__).resolve().parents[1]/'.env')
    from app.provider import LLMService
    provider=LLMService()
    try:
        provider.model.invoke('Reply OK.',max_tokens=16)
        print(json.dumps({'small_request':'accepted'}))
    except Exception as exc:
        message=''
        response=getattr(exc,'response',None)
        if response is not None:
            try:message=response.json().get('error',{}).get('message','')
            except Exception:pass
        matches=re.findall(r'(?:tokens per (?:minute|day)|requests per (?:minute|day)|TPM|TPD|RPM|RPD|Limit\s+\d+|Used\s+\d+|Requested\s+\d+|Please try again in [0-9a-z. ]+)',message,re.I)
        print(json.dumps({'status':getattr(exc,'status_code',None),'category':type(exc).__name__,'quota_metadata':matches}))

if __name__=='__main__':main()
