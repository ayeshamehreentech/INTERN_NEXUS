import httpx
import json
import tempfile
import threading
import time
import unittest
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from unittest.mock import patch
from edition.service import LearningService, ExecutionUnavailable
from edition.client import RemoteClient, BackendUnavailable, access_token, verify_token, subject_identity
from edition.remote_server import create_remote_server
from tests.test_learning import Model

A='a'*64
B='b'*64
SECRET='test-service-secret-'+'x'*40


class EditionTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.provider=Model()
        self.service=LearningService(self.temp.name,self.provider).initialize()
    def tearDown(self):self.temp.cleanup()
    def start(self):
        self.service.call(A,'complete',{'topic':'W01_INPUT'})
        return self.service.call(A,'start',{'topic':'W01_INPUT'})
    def test_completion_no_rewards_and_resume_avoids_generation(self):
        before=self.service.call(A,'progress')
        self.service.call(A,'complete',{'topic':'W01_INPUT'})
        self.assertEqual(before,self.service.call(A,'progress'))
        first=self.start();again=self.start()
        self.assertEqual(first['question']['question_id'],again['question']['question_id'])
        self.assertEqual(self.provider.n,1)

    def test_simultaneous_start_has_one_question_and_one_model_call(self):
        self.service.call(A,'complete',{'topic':'W01_INPUT'})
        with ThreadPoolExecutor(max_workers=2) as pool:
            values=list(pool.map(lambda _:self.service.call(A,'start',{'topic':'W01_INPUT'}),range(2)))
        self.assertEqual(values[0]['question']['question_id'],values[1]['question']['question_id'])
        self.assertEqual(self.provider.n,1)
    def test_empty_drafts_persist_and_learner_isolation(self):
        first=self.start();sid=first['session_id'];qid=first['question']['question_id']
        self.service.call(A,'draft',dict(session_id=sid,question_id=qid,code=''))
        reopened=LearningService(self.temp.name,Model()).initialize()
        row=reopened.call(A,'session',{'session_id':sid})
        self.assertEqual(row['draft'],'');self.assertTrue(row['draft_saved'])
        self.assertTrue(reopened.call(A,'concept',{'topic':'W01_INPUT'})['completed'])
        with self.assertRaises(ValueError):reopened.call(B,'session',{'session_id':sid})
    def test_rewards_retries_purchase_and_run_are_authoritative(self):
        first=self.start();q=first['question']
        body=dict(session_id=first['session_id'],question_id=q['question_id'],code='name=input()\nprint("Welcome",name)',operation_id='receipt',inputs=['Nova'])
        self.service.call(A,'run',body)
        self.assertEqual(self.service.call(A,'progress')['xp'],0)
        first_result=self.service.call(A,'check',body)
        replay=self.service.call(A,'check',body)
        self.assertEqual(first_result,replay)
        body['operation_id']='new-click'
        self.assertEqual(self.service.call(A,'check',body)['xp_awarded'],0)
        before=self.service.call(A,'progress')
        self.assertEqual(before['xp'],100);self.assertEqual(before['coins'],2)
        purchase=dict(session_id=first['session_id'],question_id=q['question_id'],confirmed=True)
        self.service.call(A,'reveal',purchase);self.service.call(A,'reveal',purchase)
        self.assertEqual(self.service.call(A,'progress')['coins'],before['coins']-q['solution_cost'])
    def test_stale_next_does_not_clear_current_draft(self):
        first=self.start()
        next_payload=dict(session_id=first['session_id'],question_id=first['question']['question_id'])
        second=self.service.call(A,'next',next_payload)
        self.service.call(A,'draft',dict(session_id=second['session_id'],question_id=second['question']['question_id'],code='# retained'))
        repeated=self.service.call(A,'next',next_payload)
        self.assertEqual(repeated['question']['question_id'],second['question']['question_id'])
        self.assertEqual(repeated['draft'],'# retained');self.assertTrue(repeated['draft_saved'])
    def test_disabled_cloud_execution_never_invokes_graph(self):
        service=LearningService(self.temp.name,self.provider,execution_enabled=False).initialize()
        service.call(A,'complete',{'topic':'W01_INPUT'})
        with patch.object(service.engine,'start',side_effect=AssertionError('Graph must not run')):
            with self.assertRaises(ExecutionUnavailable):service.call(A,'start',{'topic':'W01_INPUT'})
        self.assertEqual(service.call(A,'progress')['xp'],0)
    def test_sandbox_failure_no_attempt_or_reward(self):
        first=self.start();body=dict(session_id=first['session_id'],question_id=first['question']['question_id'],code='pass',operation_id='down')
        before=self.service.call(A,'progress')
        with patch('app.check_answer_service.ExecutionRouter.execute',return_value={'status':'sandbox_unavailable','outputs':[],'infrastructure_failure':True}):
            self.assertEqual(self.service.call(A,'check',body)['status'],'sandbox_unavailable')
        self.assertEqual(before,self.service.call(A,'progress'))

    def test_advanced_generation_offline_no_provider_call_or_reward(self):
        before=self.service.call(A,'progress')
        self.service.call(A,'complete',{'topic':'W12_FUNCTIONS'})
        with patch('edition.service.sandbox_available',return_value=False),patch.object(self.provider,'generate_question',side_effect=AssertionError('Do not call Groq without the required runtime')):
            with self.assertRaisesRegex(ExecutionUnavailable,'secure execution service is offline'):
                self.service.call(A,'start',{'topic':'W12_FUNCTIONS'})
        self.assertEqual(before,self.service.call(A,'progress'))


class RemoteTests(unittest.TestCase):
    def test_scoped_tokens_tampering_expiry_and_tls(self):
        token=access_token(A,SECRET)
        self.assertEqual(verify_token(token,SECRET),A)
        for bad in (token.replace('a'*64,'b'*64),access_token(A,SECRET,int(time.time()-1)),token+'extra'):
            with self.assertRaises(BackendUnavailable):verify_token(bad,SECRET)
        with self.assertRaises(ValueError):RemoteClient('http://example.com',SECRET)
        self.assertEqual(subject_identity('issuer','subject',SECRET),subject_identity('issuer','subject',SECRET))
        self.assertNotEqual(subject_identity('issuer','subject',SECRET),subject_identity('other','subject',SECRET))
    def test_external_storage_and_checkpoint_survive_service_restart(self):
        with tempfile.TemporaryDirectory() as directory:
            service=LearningService(directory,Model()).initialize()
            server=create_remote_server(service,SECRET,0)
            thread=threading.Thread(target=server.serve_forever);thread.start()
            client=RemoteClient(f'http://127.0.0.1:{server.server_port}',SECRET,allow_local_http=True)
            try:
                client.call(A,'complete',{'topic':'W01_INPUT'})
                session=client.call(A,'start',{'topic':'W01_INPUT'})
                sid=session['session_id'];qid=session['question']['question_id']
                client.call(A,'draft',dict(session_id=sid,question_id=qid,code='# remote draft'))
                with self.assertRaises(BackendUnavailable):client.call(B,'session',{'session_id':sid})
                url=f'http://127.0.0.1:{server.server_port}/v1/action'
                self.assertEqual(httpx.post(url,json={'action':'progress','payload':{}}).status_code,401)
                self.assertEqual(httpx.post(url,json={'action':'progress','payload':{'learner_id':B}},headers={'Authorization':'Bearer '+access_token(A,SECRET)}).status_code,400)
            finally:server.shutdown();thread.join();server.server_close()
            reopened=LearningService(directory,Model()).initialize()
            self.assertEqual(reopened.call(A,'session',{'session_id':sid})['draft'],'# remote draft')
            state=reopened.engine.graph.get_state({'configurable':{'thread_id':A+':'+sid}})
            self.assertEqual(state.values['learner_id'],A)
            self.assertEqual(state.values['current_question']['question_id'],qid)
            self.assertEqual(reopened.call(A,'start',{'topic':'W01_INPUT'})['session_id'],sid)
