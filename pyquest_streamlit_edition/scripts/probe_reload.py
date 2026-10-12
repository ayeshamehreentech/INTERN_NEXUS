"""Regression probe: rebuild cached resources after Streamlit-style module reload."""
import importlib
import json
import sys
import tempfile
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))

def main():
    runtime=importlib.import_module('edition.runtime')
    with tempfile.TemporaryDirectory(prefix='pyquest-reload-') as directory:
        first=runtime.local_service(directory,True,id(runtime.LearningService),'mock')
        first.call('a'*64,'complete',{'topic':'W01_INPUT'})
        question=first.call('a'*64,'start',{'topic':'W01_INPUT'})
        first.call('a'*64,'draft',dict(session_id=question['session_id'],question_id=question['question']['question_id'],code='# survives reload'))
        # The source watcher removes backend modules but leaves cache resources.
        for name in list(sys.modules):
            if name=='app' or name.startswith(('app.','edition.')):sys.modules.pop(name,None)
        new_runtime=importlib.import_module('edition.runtime')
        second=new_runtime.local_service(directory,True,id(new_runtime.LearningService),'mock')
        if first is second:raise AssertionError('Stale implementation was cached')
        saved=second.call('a'*64,'session',{'session_id':question['session_id']})
        if saved['draft']!='# survives reload':raise AssertionError('Persistent draft lost')
        second.call('b'*64,'complete',{'topic':'W01_INPUT'})
        fresh=second.call('b'*64,'start',{'topic':'W01_INPUT'})
        if fresh['question']['generation_source']!='generated':raise AssertionError('Reloaded worker failed')
        print(json.dumps({'service_rebuilt':True,'draft_retained':True,'generation_after_reload':True}))

if __name__=='__main__':main()
