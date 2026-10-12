import contextlib
import io
import tempfile
import unittest
import json
import threading
import urllib.request
import urllib.error
import http.cookiejar
from pathlib import Path
from app.catalog import TOPICS
from app.concepts import LESSONS
from app.storage import Store


class ConceptTests(unittest.TestCase):
    def test_http_concept_start_resume_and_draft(self):
        from main import create_server
        from tests.test_learning import Model
        with tempfile.TemporaryDirectory() as folder:
            server=create_server(0,folder,Model())
            thread=threading.Thread(target=server.serve_forever);thread.start()
            client=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
            def call(path,data=None):
                request=urllib.request.Request(f'http://127.0.0.1:{server.server_port}/api/'+path,
                    data=json.dumps(data).encode() if data is not None else None,headers={'Content-Type':'application/json'})
                return json.load(client.open(request,timeout=30))
            try:
                before=call('progress')
                self.assertFalse(call('concept/W01_INPUT')['completed'])
                with self.assertRaises(urllib.error.HTTPError) as error:call('concept-start',{'topic':'W01_INPUT'})
                self.assertEqual(error.exception.code,400)
                call('concept-complete',{'topic':'W01_INPUT'})
                self.assertEqual(call('progress'),before)
                first=call('concept-start',{'topic':'W01_INPUT'})
                body=dict(session_id=first['session_id'],question_id=first['question']['question_id'],code='# retained draft\nname=input()\nprint("Welcome",name)')
                call('draft',body)
                self.assertEqual(call('concept/W01_INPUT')['session_id'],first['session_id'])
                again=call('concept-start',{'topic':'W01_INPUT'})
                self.assertEqual(again['question']['question_id'],first['question']['question_id'])
                self.assertEqual(again['draft'],body['code'])
                self.assertTrue(call('check',dict(body,operation_id='concept-flow'))['correct'])
                with self.assertRaises(urllib.error.HTTPError):call('leaderboard')
            finally:server.shutdown();thread.join();server.server_close()

    def test_complete_schema_and_executable_examples(self):
        self.assertEqual(set(LESSONS), set(TOPICS))
        for key, lesson in LESSONS.items():
            with self.subTest(topic=key):
                for field in ('title','learning_objective','simple_explanation','syntax','worked_examples','visualization_type','common_mistakes','remember'):
                    self.assertTrue(lesson[field])
                self.assertEqual(lesson['world_id'], TOPICS[key]['world_id'])
                for example in lesson['worked_examples']:
                    output = io.StringIO()
                    with contextlib.redirect_stdout(output):
                        exec(example['code'], {})
                    self.assertEqual(output.getvalue().rstrip('\n'), example['output'])

    def test_completion_persists_without_rewards_or_mastery(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder)/'test.db'
            store = Store(path)
            store.learner('learner')
            before = store.progress('learner')
            self.assertFalse(store.concept('learner','W01_PRINT')['completed'])
            store.concept('learner','W01_PRINT',True)
            store.concept('learner','W01_PRINT',True)
            self.assertTrue(Store(path).concept('learner','W01_PRINT')['completed'])
            self.assertEqual(before, store.progress('learner'))
            self.assertFalse(store.concept('learner','W01_PRINT')['session_id'])
            with self.assertRaises(ValueError):store.concept('learner','bad',True)
