"""Operator-only live backend check; configuration is read, never copied or printed."""
import json
import logging
import os
import sys
import tempfile
from pathlib import Path
from dotenv import dotenv_values
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))

def main():
    import argparse
    parser=argparse.ArgumentParser()
    parser.add_argument('--config',type=Path,help='Optional private dotenv configuration file')
    args=parser.parse_args()
    if args.config:
        for key,value in dotenv_values(args.config).items():
            if key in ('GROQ_API_KEY','GROQ_MODEL') and value:os.environ[key]=value
    from edition.service import LearningService
    from app.question_generation_service import QuestionGenerationUnavailable
    from app.provider import LLMService
    logging.basicConfig(level=logging.INFO)
    provider=LLMService()
    print('Provider configured:',provider.model is not None,flush=True)
    with tempfile.TemporaryDirectory(prefix='pyquest-live-') as directory:
        service=LearningService(directory,provider).initialize()
        identity='e'*64
        service.call(identity,'complete',{'topic':'W01_INPUT'})
        try:
            value=service.call(identity,'start',{'topic':'W01_INPUT'})
            q=value['question']
            # Submit a deliberately incomplete answer to check real grading safely.
            payload=dict(session_id=value['session_id'],question_id=q['question_id'],code='pass',operation_id='live-incomplete',inputs=q['example']['inputs'])
            result=service.call(identity,'check',payload)
            print(json.dumps({'generated':q['generation_source'],'correct':result.get('correct'),'xp':result.get('xp_awarded'),'coins':result.get('coins_awarded')}),flush=True)
        except QuestionGenerationUnavailable as exc:
            print(json.dumps({'generated':False,'reason':exc.reason,'message':str(exc)}),flush=True)
            raise SystemExit(1)

if __name__=='__main__':main()
