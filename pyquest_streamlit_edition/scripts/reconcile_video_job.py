"""Operator recovery: attach a confirmed fal submit response; NEVER create a job."""
import argparse
import json
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from edition.video_cache import VideoCache
from edition.video_provider import FalVideoProvider,MODEL
from edition.video_workflow import normalize_concept,PROMPT_VERSION

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--database',type=Path,required=True)
    parser.add_argument('--concept',required=True)
    recovery=parser.add_mutually_exclusive_group(required=True)
    recovery.add_argument('--response-file',type=Path,help='Confirmed fal submit JSON containing request_id, status_url and response_url')
    recovery.add_argument('--confirmed-not-submitted',action='store_true',help='Operator has stopped in-flight requests and independently confirmed that no job was accepted. Allows explicit retry; never submits automatically.')
    args=parser.parse_args();cache=VideoCache(args.database)
    row=cache.get(normalize_concept(args.concept),PROMPT_VERSION,'fal',MODEL)
    if not row or row['status'] not in ('submitting','submission_unknown'):raise ValueError('Only an uncertain existing reservation can be reconciled.')
    if args.confirmed_not_submitted:
        cache.update(row,status='submission_error',error_state='Operator confirmed no accepted job. Explicit retry is now available.')
        print('Reservation reconciled as rejected. No generation call was made.');return
    data=json.loads(args.response_file.read_text())
    import re
    job=data.get('request_id','')
    if not isinstance(job,str) or not re.fullmatch(r'[A-Za-z0-9_-]{1,160}',job):raise ValueError('Invalid confirmed job ID.')
    validator=object.__new__(FalVideoProvider)
    metadata={'job_id':job,'status_url':validator._queue_url(data.get('status_url'),job),'response_url':validator._queue_url(data.get('response_url'),job)}
    cache.update(row,status='pending',job_id=job,provider_data=metadata,error_state=None)
    print('Confirmed existing job attached. Resume using Check saved job; no generation call was made.')

if __name__=='__main__':main()
