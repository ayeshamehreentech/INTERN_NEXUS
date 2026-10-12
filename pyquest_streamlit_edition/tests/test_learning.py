import tempfile
import unittest
from pathlib import Path
from app.storage import Store
from app.learning import LearningEngine

class Model:
    def __init__(self):self.n=0
    def generate_question(self,context):
        self.n+=1
        scenarios=['Ask for the explorer name and print Welcome followed by that name.',
                   'A museum visitor signs the guestbook. Read their signature, then display Welcome and the signature.',
                'Collect a pilot callsign for the flight board; write the greeting Welcome before the callsign.']
        return dict(world_id='W01',subtopic_id='W01_INPUT',title='Explorer greeting',
            prompt=scenarios[(self.n-1)%len(scenarios)],
            learning_objective='Read and use input',requirements=['input','print'],
            expected_behavior='Welcome followed by the input name',test_cases=[
                dict(inputs=['Nova'],expected='Welcome Nova'),dict(inputs=['Kai'],expected='Welcome Kai')],
            hint_seed='Store the input in a variable.',concept_tags=['input()'],
            solution=('name = input()\nprint("Welcome", name)' if self.n%2 else 'name = input()\nprint(f"Welcome {name}")'),difficulty=context['difficulty'])

class LearningTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.store=Store(Path(self.temp.name)/'db')
        self.store.learner('a');self.engine=LearningEngine(self.store,Model())
    def tearDown(self):self.temp.cleanup()
    def test_generated_vertical_slice(self):
        self.assertEqual(self.store.progress('a')['score'],0)
        session=self.engine.start('a','W01_INPUT');q=session['question']
        self.assertEqual(q['generation_source'],'generated');self.assertNotIn('solution',q)
        args=('a',session['session_id'],q['question_id'])
        self.assertFalse(self.engine.submit(*args,'pass','bad')['correct'])
        result=self.engine.submit(*args,'name=input()\nprint("Welcome",name)','good')
        self.assertTrue(result['correct']);self.assertGreater(result['new_mastery'],0)
        self.assertEqual(result['tests_total'],2)
        self.assertEqual(len(result['outputs']),1)
        self.assertEqual(self.engine.submit(*args,'name=input()\nprint("Welcome",name)','again')['xp_awarded'],0)
        reopened=Store(self.store.path);self.assertEqual(reopened.progress('a')['score'],75)
        new=self.engine.start('a','W01_INPUT',session['session_id'])
        self.assertNotEqual(q['question_id'],new['question']['question_id'])
    def test_run_does_not_score(self):
        s=self.engine.start('a','W01_INPUT')
        self.engine.submit('a',s['session_id'],s['question']['question_id'],'print(5)','run',run=True)
        self.assertEqual(self.store.progress('a')['attempts'],0)
    def test_provider_failure_does_not_serve_static_question(self):
        class Offline:
            def generate_question(self,c):raise TimeoutError()
        self.engine.provider=Offline()
        from app.question_generation_service import QuestionGenerationUnavailable
        with self.assertRaises(QuestionGenerationUnavailable):self.engine.start('a','W01_INPUT')
        with self.store.db() as db:self.assertEqual(db.execute('SELECT COUNT(*) FROM sessions').fetchone()[0],0)
    def test_identity(self):
        s=self.engine.start('a','W01_INPUT')
        self.store.learner('b')
        with self.assertRaises(ValueError):self.store.session('b',s['session_id'])
