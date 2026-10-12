"""Reproduce live Next failures without changing an existing learner."""
import sys, os, json, logging, tempfile
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from dotenv import load_dotenv

def main():
    load_dotenv(Path(__file__).resolve().parents[1]/'.env')
    from edition.service import LearningService
    logging.basicConfig(level=logging.INFO)
    with tempfile.TemporaryDirectory() as directory:
        service=LearningService(directory).initialize();identity='f'*64
        service.call(identity,'complete',{'topic':'W01_INPUT'})
        value=service.call(identity,'start',{'topic':'W01_INPUT'})
        for number in range(3):
            q=value['question']
            print(json.dumps({'step':number,'title':q['title'],'id':q['question_id']}),flush=True)
            value=service.call(identity,'next',{'session_id':value['session_id'],'question_id':q['question_id']})
        print('THREE_NEXT_SUCCESS',flush=True)

if __name__=='__main__':main()
