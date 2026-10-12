"""Hardening regression tests; mock providers never consume API credits."""
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock, patch

from app.catalog import WORLDS, TOPICS
from app.agents.supervisor import supervisor, AGENTS
from app.execution import execute
from app.hints import HintAgent, HintGuard
from app.learning import LearningEngine
from app.scoring import EvaluationAgent
from app.storage import Store
from tests.test_learning import Model


class GameplayHardeningTests(unittest.TestCase):
    def test_every_world_routes_every_subtopic_without_substitution(self):
        self.assertEqual(len(WORLDS), 14)
        for world in WORLDS:
            for topic in world['topics']:
                with self.subTest(topic=topic['id']):
                    state=dict(subtopic_id=topic['id'], difficulty='easy', mastery_score=0)
                    state.update(supervisor(state))
                    context=AGENTS[world['id']](state)['specialist_context']
                    self.assertEqual(context['selected_topic']['id'], topic['id'])
                    self.assertEqual(context['world_id'], world['id'])

    def test_equivalent_solutions_and_errors_are_deterministic(self):
        fixtures=[dict(inputs=['Kai'],expected='Welcome Kai'),dict(inputs=['Nova'],expected='Welcome Nova')]
        cases=[('name=input()\nprint("Welcome",name)',True),
               ('visitor=input()\nprint(f"Welcome {visitor} ")',True),
               ('name=input()\nprint("wrong")',False),
               ('name = input(\n',False), ('print(1/0)',False), ('',False)]
        for code,expected in cases:
            with self.subTest(code=code):
                self.assertEqual(EvaluationAgent.evaluate(code,fixtures,{'must_use_input':True})['correct'],expected)

    def test_current_advanced_execution_limit_is_explicit(self):
        # Document a blocker, not a claim that Functions/OOP gameplay works.
        for code in ['def answer():\n return 3\nprint(answer())', 'class Explorer:\n pass\nprint(Explorer())']:
            self.assertEqual(execute(code,[dict(inputs=[],expected='3')])['status'],'learner_error')

    def test_hints_do_not_emit_executable_seed(self):
        q=Mock(hint_seed='print("secret solution")')
        for number in [1,2,3]:
            hint=HintAgent().hint(q,number)
            self.assertTrue(HintGuard().accept(hint))
            self.assertNotIn('secret solution',hint)

class GraphHardeningTests(unittest.TestCase):
    def test_graph_preserves_identity_character_and_atomic_active_quest(self):
        with tempfile.TemporaryDirectory() as folder:
            store=Store(Path(folder)/'test.db');store.learner('owner')
            with store.db() as db:db.execute('UPDATE learners SET settings=? WHERE id=?',(json.dumps({'selected_character':'kai'}),'owner'))
            engine=LearningEngine(store,Model())
            s=engine.start('owner','W01_INPUT')
            with store.db() as db:
                self.assertEqual(db.execute('SELECT learner_id FROM generated_quests').fetchone()[0],'owner')
                self.assertEqual(db.execute('SELECT COUNT(*) FROM learners').fetchone()[0],1)
            state=engine.load_learner_state(dict(learner_id='owner',session_id=s['session_id'],subtopic_id='W01_INPUT'))
            self.assertEqual(state['selected_character'],'kai')
            engine.next('owner',s['session_id'])
            with store.db() as db:
                self.assertEqual(db.execute("SELECT COUNT(*) FROM active_quests WHERE status='ACTIVE'").fetchone()[0],1)
            reopened=Store(store.path)
            self.assertEqual(reopened.session('owner',s['session_id'])['learner'],'owner')

    def test_graph_rejects_missing_state(self):
        with tempfile.TemporaryDirectory() as folder:
            engine=LearningEngine(Store(Path(folder)/'test.db'),Model())
            with self.assertRaisesRegex(ValueError,'subtopic'):engine.graph.invoke({})

class ProviderHardeningTests(unittest.TestCase):
    def test_transient_failure_retries_then_succeeds(self):
        from app.question_generation_service import QuestionGenerationService
        provider=Mock();provider.generate_question.side_effect=[TimeoutError(),ConnectionError(),{'ok':True}]
        waits=[];service=QuestionGenerationService(sleep=waits.append)
        self.assertEqual(service.request(provider,{}),{'ok':True})
        self.assertEqual(waits,[.5,1]);self.assertEqual(provider.generate_question.call_count,3)

    def test_retry_exhaustion_and_permanent_failure(self):
        from app.question_generation_service import QuestionGenerationService
        for failure,count in [(TimeoutError(),3),(ValueError('invalid schema'),1)]:
            provider=Mock();provider.generate_question.side_effect=failure
            with self.assertRaises(type(failure)):QuestionGenerationService(sleep=lambda _:None).request(provider,{})
            self.assertEqual(provider.generate_question.call_count,count)

    def test_rate_limit_respects_retry_after(self):
        from app.question_generation_service import QuestionGenerationService
        class Limited(Exception):
            status_code=429
            response=Mock(headers={'retry-after':'2'})
        provider=Mock();provider.generate_question.side_effect=[Limited(),{}]
        waits=[];QuestionGenerationService(sleep=waits.append).request(provider,{})
        self.assertEqual(waits,[2])

    def test_malformed_result_is_not_retried(self):
        from app.question_generation_service import QuestionGenerationService
        for result in ['not JSON',None,[]]:
            provider=Mock();provider.generate_question.return_value=result
            with self.assertRaises(ValueError):QuestionGenerationService().generate(provider,{'topic':TOPICS['W01_INPUT'],'difficulty':'easy'})
            self.assertEqual(provider.generate_question.call_count,1)

class SecurityHardeningTests(unittest.TestCase):
    def test_payload_rejects_oversize_tampered_and_wrong_types(self):
        from app.api_validation import validate_payload
        for body in [{'code':'x'*4001},{'code':[]},{'inputs':'abc'},{'inputs':['x'*2001]},
                     {'inputs':['x']*11},{'xp_awarded':100},{'coins':999},{'operation_id':[]}]:
            with self.subTest(body=str(body)[:50]),self.assertRaises(ValueError):validate_payload(body)

    def test_execution_limits_and_forbidden_capabilities(self):
        fixture=[dict(inputs=[],expected='unused')]
        for code in ['import os','open("private")','__import__("socket")','print(1).__class__',
                     'while True:\n print("x"*1000)','x'*4001]:
            with self.subTest(code=code[:40]):self.assertEqual(execute(code,fixture)['status'],'learner_error')
        self.assertEqual(execute('print(1)',fixture,timeout=0)['status'],'timeout')

    def test_http_rejects_bad_json_origin_host_and_rewards(self):
        import threading
        import http.client
        from main import create_server
        with tempfile.TemporaryDirectory() as folder:
            server=create_server(0,folder,Model())
            thread=threading.Thread(target=server.serve_forever);thread.start()
            try:
                for body,headers,status in [('{',{},400),('[]',{},400),('{"coins":999}',{},400),
                    ('{}',{'Origin':'http://untrusted.example'},403),('{}',{'Host':'untrusted.example'},403),
                    ('{"settings":{"music_volume":NaN}}',{},400)]:
                    with self.subTest(body=body,headers=headers):
                        c=http.client.HTTPConnection('127.0.0.1',server.server_port,timeout=5)
                        c.request('POST','/api/settings',body,{'Content-Type':'application/json',**headers})
                        response=c.getresponse();payload=response.read()
                        self.assertEqual(response.status,status)
                        self.assertEqual(response.getheader('X-Content-Type-Options'),'nosniff')
                        self.assertNotIn(b'Traceback',payload);c.close()
            finally:server.shutdown();thread.join();server.server_close()
