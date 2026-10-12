"""Offline contract tests; live Docker tests require an explicitly built image."""
import io
import json
import os
from pathlib import Path
import sqlite3
import sys
from contextlib import closing
import subprocess
import tempfile
import unittest
from concurrent.futures import ThreadPoolExecutor
from types import SimpleNamespace
from unittest.mock import Mock, patch
from langgraph.graph import StateGraph, START, END
from typing import TypedDict
from app.checkpoints import PersistentGraph, CheckpointUnavailable
from app.execution_router import ExecutionRouter, capability_for, Capability
from app.sandbox_execution import DockerSandboxExecutionService, SandboxLimits
from app.learning import LearningEngine
from app.storage import Store
from test_learning import Model


class RouterTests(unittest.TestCase):
    def test_beginner_uses_bounded_runner(self):
        with patch('app.execution_router.bounded_execute', return_value={'status': 'ok'}) as bounded:
            sandbox = Mock()
            ExecutionRouter(sandbox).execute(SimpleNamespace(subtopic_id='W01_INPUT', world_id='W01'), 'print(1)', [])
            bounded.assert_called_once()
            sandbox.execute.assert_not_called()

    def test_advanced_cannot_downgrade(self):
        for topic, world in [('W12_FUNCTIONS','W12'),('W13_CLASSES_AND_OBJECTS','W13')]:
            with self.subTest(topic=topic), patch('app.execution_router.bounded_execute') as bounded:
                sandbox = Mock()
                sandbox.execute.return_value = {'status': 'sandbox_unavailable'}
                result = ExecutionRouter(sandbox).execute(SimpleNamespace(subtopic_id=topic, world_id=world,
                    execution_capability='bounded_ast'), 'print(1)', [])
                self.assertEqual(result['status'], 'sandbox_unavailable')
                sandbox.execute.assert_called_once()
                bounded.assert_not_called()

    def test_unknown_or_mismatched_topic_unsupported(self):
        for topic in ['unknown','W01_INPUT']:
            result = ExecutionRouter().execute(SimpleNamespace(subtopic_id=topic, world_id='W12'), '', [])
            self.assertEqual(result['status'], 'unsupported_execution')

    def test_all_advanced_worlds_require_sandbox(self):
        from app.catalog import TOPICS
        for topic in TOPICS.values():
            expected = Capability.ISOLATED_SANDBOX if topic['world_id'] in {'W09','W10','W11','W12','W13','W14'} else Capability.BOUNDED_AST
            self.assertEqual(capability_for(topic['id']), expected)


class SandboxTests(unittest.TestCase):
    def test_missing_docker_no_host_execution(self):
        with patch('app.sandbox_execution.shutil.which', return_value=None), patch('app.sandbox_execution.subprocess.Popen') as popen:
            result = DockerSandboxExecutionService().execute('def f(): return 1', [{'inputs':[]}])
            self.assertEqual(result['status'], 'sandbox_unavailable')
            popen.assert_not_called()

    def test_oversize_rejected_before_launch(self):
        with patch('app.sandbox_execution.subprocess.Popen') as popen:
            result = DockerSandboxExecutionService().execute('x'*4001, [])
            self.assertEqual(result['status'], 'validation_error')
            popen.assert_not_called()

    def test_security_command(self):
        command = DockerSandboxExecutionService().command('docker', 'test')
        for flag in ['--network=none','--read-only','--user=65534:65534','--cap-drop=ALL',
                     '--security-opt=no-new-privileges','--memory=128m','--memory-swap=128m',
                     '--cpus=0.5','--pids-limit=16','--pull=never','--rm']:
            self.assertIn(flag,command)
        self.assertNotIn('-v',command)
        self.assertFalse(any('--mount' in item for item in command))

    def fixture(self, status='ok', exitcode=0, wait_error=None):
        process = Mock()
        process.stdin = io.BytesIO()
        process.stdout = io.BytesIO(json.dumps({'status':status,'output':'42'}).encode())
        process.stderr = io.BytesIO()
        process.returncode = exitcode
        process.poll.return_value = exitcode
        if wait_error: process.wait.side_effect = wait_error
        with patch('app.sandbox_execution.subprocess.Popen',return_value=process) as launch, \
             patch('app.sandbox_execution.subprocess.run') as cleanup:
            result = DockerSandboxExecutionService()._fixture('docker','print(42)',[])
            self.assertFalse(launch.call_args.kwargs['shell'])
            self.assertNotIn('print(42)',launch.call_args.args[0])
            self.assertEqual(cleanup.call_args.args[0][:3],['docker','rm','-f'])
            return result

    def test_capture_and_learner_errors(self):
        self.assertEqual(self.fixture(), {'status':'ok','output':'42'})
        for status in ['learner_error','output_limit','memory_limit']:
            self.assertEqual(self.fixture(status)['status'],status)

    def test_daemon_image_start_failure(self):
        self.assertEqual(self.fixture(exitcode=125)['status'],'sandbox_unavailable')
        for status in [126,127,137,1]:
            self.assertEqual(self.fixture(exitcode=status)['status'],'sandbox_error')

    def test_timeout_cleanup(self):
        self.assertEqual(self.fixture(wait_error=subprocess.TimeoutExpired('docker',8))['status'],'timeout')

    def test_creation_failure_cleanup(self):
        with patch('app.sandbox_execution.subprocess.Popen',side_effect=OSError()), patch('app.sandbox_execution.subprocess.run') as cleanup:
            self.assertEqual(DockerSandboxExecutionService()._fixture('docker','pass',[])['status'],'sandbox_unavailable')
            cleanup.assert_called_once()


class State(TypedDict):
    value: int


def builder():
    graph = StateGraph(State)
    graph.add_node('increment',lambda s:{'value':s['value']+1})
    graph.add_edge(START,'increment')
    graph.add_edge('increment',END)
    return graph


class CheckpointTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.path=Path(self.temp.name)/'checkpoints.sqlite'
        self.graph=PersistentGraph(builder(),self.path)
        self.config={'configurable':{'thread_id':'learner:session'}}

    def tearDown(self): self.temp.cleanup()

    def test_real_checkpoint_reconstruction_and_isolation(self):
        self.assertEqual(self.graph.invoke({'value':4},self.config)['value'],5)
        restored=PersistentGraph(builder(),self.path)
        self.assertEqual(restored.get_state(self.config).values,{'value':5})
        self.assertEqual(restored.invoke(None,self.config),{'value':5})
        self.assertGreater(len(restored.get_state_history(self.config)),1)
        self.assertEqual(restored.get_state({'configurable':{'thread_id':'other'}}).values,{})
        with closing(sqlite3.connect(self.path)) as db:
            self.assertGreater(db.execute('SELECT COUNT(*) FROM checkpoints').fetchone()[0],0)

    def test_checkpoint_read_in_fresh_process(self):
        self.graph.invoke({'value':11},self.config)
        # Trusted checkpoint reader only. Never learner code or sandbox runner.
        script = ('import sys; from langgraph.checkpoint.sqlite import SqliteSaver; '
                  'context=SqliteSaver.from_conn_string(sys.argv[1]); saver=context.__enter__(); '
                  'saved=saver.get_tuple({"configurable":{"thread_id":"learner:session"}}); '
                  'print(saved.checkpoint["channel_values"]["value"]); context.__exit__(None,None,None)')
        result=subprocess.run([sys.executable,'-c',script,str(self.path)],capture_output=True,text=True,timeout=15,check=True)
        self.assertEqual(result.stdout.strip(),'12')

    def test_interrupted_graph_resume(self):
        from langgraph.types import interrupt, Command
        graph=StateGraph(State)
        graph.add_node('pause',lambda s:{'value':s['value']+interrupt('continue?')})
        graph.add_edge(START,'pause');graph.add_edge('pause',END)
        original=PersistentGraph(graph,self.path)
        original.invoke({'value':7},self.config)
        restored=PersistentGraph(graph,self.path)
        self.assertTrue(restored.get_state(self.config).next)
        self.assertEqual(restored.invoke(Command(resume=2),self.config)['value'],9)

    def test_invalid_config_and_corrupt_storage(self):
        for config in [None,{}, {'configurable':{'thread_id':12}}, {'configurable':None}, []]:
            with self.assertRaises(ValueError): self.graph.invoke({'value':1},config)
        # A directory is an unavailable SQLite path, without corrupting user data.
        bad=PersistentGraph(builder(),Path(self.temp.name))
        with self.assertRaises(CheckpointUnavailable):bad.invoke({'value':1},self.config)

    def test_concurrent_same_thread(self):
        with ThreadPoolExecutor(2) as pool:
            values=list(pool.map(lambda value:self.graph.invoke({'value':value},self.config)['value'],[1,2]))
        self.assertEqual(values,[2,3])
        self.assertIn(self.graph.get_state(self.config).values['value'],values)


class BusinessBoundaryTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.store=Store(Path(self.temp.name)/'business.sqlite')
        self.store.learner('a')
        self.engine=LearningEngine(self.store,Model())
        self.session=self.engine.start('a','W01_INPUT')

    def tearDown(self): self.temp.cleanup()

    def test_resume_does_not_award_and_active_quest_remains(self):
        sid=self.session['session_id']
        config={'configurable':{'thread_id':'a:'+sid}}
        recreated=LearningEngine(self.store,Model())
        state=recreated.graph.invoke(None,config)
        self.assertEqual(state['current_question']['question_id'],self.session['question']['question_id'])
        self.assertEqual(recreated.provider.n,0)
        self.assertEqual(self.store.progress('a')['attempts'],0)
        self.assertEqual(json.loads(self.store.session('a',sid)['question'])['question_id'],self.session['question']['question_id'])

    def test_simultaneous_check_one_receipt(self):
        args=('a',self.session['session_id'],self.session['question']['question_id'],'name=input()\nprint("Welcome",name)','same-op')
        with ThreadPoolExecutor(2) as pool:
            results=list(pool.map(lambda _:self.engine.submit(*args),range(2)))
        self.assertEqual(results[0],results[1])
        self.assertEqual(self.store.progress('a')['attempts'],1)
        with self.store.db() as db:self.assertEqual(db.execute('SELECT COUNT(*) FROM rewards').fetchone()[0],1)

    def test_simultaneous_next_one_new_quest(self):
        args=('a',self.session['session_id'],self.session['question']['question_id'])
        with ThreadPoolExecutor(2) as pool:
            results=list(pool.map(lambda _:self.engine.next(*args),range(2)))
        self.assertEqual(results[0]['question']['question_id'],results[1]['question']['question_id'])
        self.assertEqual(self.engine.provider.n,2)
        with self.store.db() as db:self.assertEqual(db.execute('SELECT COUNT(*) FROM generated_quests').fetchone()[0],2)

    def test_infrastructure_failure_no_attempt_or_reward(self):
        with patch('app.check_answer_service.ExecutionRouter') as router:
            router.return_value.execute.return_value={'status':'sandbox_unavailable','outputs':[]}
            result=self.engine.submit('a',self.session['session_id'],self.session['question']['question_id'],'pass','no-reward')
        self.assertEqual(result['status'],'sandbox_unavailable')
        self.assertEqual(self.store.progress('a')['attempts'],0)

    def test_actual_advanced_session_fails_closed_without_docker(self):
        sid=self.session['session_id']
        with self.store.db() as db:
            question=json.loads(db.execute('SELECT question FROM sessions WHERE id=?',(sid,)).fetchone()[0])
            question.update(world_id='W12',subtopic_id='W12_FUNCTIONS',execution_capability='bounded_ast')
            db.execute('UPDATE sessions SET topic=?,question=? WHERE id=?',('W12_FUNCTIONS',json.dumps(question),sid))
        with patch('app.sandbox_execution.shutil.which',return_value=None), patch('app.execution_router.bounded_execute') as bounded:
            result=self.engine.submit('a',sid,question['question_id'],'print(1)','advanced')
        self.assertEqual(result['status'],'sandbox_unavailable')
        bounded.assert_not_called()
        self.assertEqual(self.store.progress('a')['attempts'],0)
        with self.store.db() as db:
            self.assertEqual(db.execute('SELECT COUNT(*) FROM rewards').fetchone()[0],0)
            self.assertEqual(db.execute('SELECT COUNT(*) FROM mastery').fetchone()[0],0)


class AdvancedGuardTests(unittest.TestCase):
    def test_reference_uses_sandbox_and_normalizes_metadata(self):
        from app.agents.question_guard import question_guard
        from app.catalog import TOPICS
        from app.validation import concepts_in
        raw=Model().generate_question({'difficulty':'easy'})
        raw.update(world_id='W12',subtopic_id='W12_FUNCTIONS',concept_tags=['Functions'],
                   requirements=['function','return','print'],
                   solution='def greet(name):\n return "Welcome " + name\nprint(greet(input()))')
        result={'status':'ok','outputs':['Welcome Nova','Welcome Kai'],'concepts':list(concepts_in(raw['solution']))}
        with patch('app.execution_router.DockerSandboxExecutionService.execute',return_value=result) as sandbox:
            question=question_guard(raw,TOPICS['W12_FUNCTIONS'],'easy',[])
        sandbox.assert_called_once()
        self.assertEqual(question.execution_capability,'isolated_sandbox')
        with patch('app.execution_router.DockerSandboxExecutionService.execute',return_value={'status':'sandbox_unavailable'}):
            with self.assertRaisesRegex(ValueError,'Sandbox unavailable'):
                question_guard(raw,TOPICS['W12_FUNCTIONS'],'easy',[])

    def test_trusted_function_requirement_cannot_be_omitted(self):
        from app.models import GeneratedQuestion
        from app.validation import required_concepts
        raw=Model().generate_question({'difficulty':'easy'})
        raw.update(world_id='W12',subtopic_id='W12_FUNCTIONS',requirements=['print'],validation_concepts=[])
        self.assertTrue({'function','return'} <= required_concepts(GeneratedQuestion.model_validate(raw)))


@unittest.skipUnless(os.getenv('PYQUEST_LIVE_SANDBOX_TESTS')=='1','Live Docker sandbox not enabled; build image and opt in')
class LiveDockerTests(unittest.TestCase):
    def test_advanced_semantics(self):
        examples=[('def f(n):\n return 1 if n<2 else n*f(n-1)\nprint(f(5))','120'),
                  ('class A:\n def value(self): return 3\nclass B(A):\n pass\nprint(B().value())','3'),
                  ('class A:\n def __init__(self,x): self.x=x\nprint(A(7).x)','7'),
                  ('def outer(x):\n def inner(y): return x+y\n return inner\nprint(outer(2)(3))','5'),
                  ('def g():\n yield 2\nprint(next(g()))','2')]
        for code,expected in examples:
            with self.subTest(code=code):
                result=DockerSandboxExecutionService().execute(code,[{'inputs':[]}])
                self.assertEqual(result.get('outputs'),[expected],result)

    def test_restrictions_and_limits(self):
        for code in ['import socket','open("/etc/passwd")','import subprocess','print(1/0)','def !']:
            with self.subTest(code=code):
                self.assertEqual(DockerSandboxExecutionService().execute(code,[{'inputs':[]}])['status'],'learner_error')
        self.assertEqual(DockerSandboxExecutionService().execute('print("x"*13000)',[{'inputs':[]}])['status'],'output_limit')
        self.assertEqual(DockerSandboxExecutionService(SandboxLimits(wall_seconds=2)).execute('while True: pass',[{'inputs':[]}])['status'],'timeout')
