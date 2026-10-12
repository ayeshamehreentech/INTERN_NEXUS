import json
import unittest
from app.agents.question_guard import question_guard
from app.agents.adaptive_agent import adaptive_agent
from app.catalog import TOPICS
from app.learning import rebrand
from app.validation import required_concepts, concepts_in
from tests.test_learning import Model
from tests import test_learning


class GuardTests(unittest.TestCase):
    def question(self):
        return Model().generate_question({'difficulty':'easy'})

    def test_guard_rejects_wrong_context_and_leaks(self):
        for changes in [dict(world_id='W02'), dict(concept_tags=['classes']),
                        dict(prompt='Doraemon asks the player to print a name.')]:
            with self.subTest(changes=changes), self.assertRaises(ValueError):
                question_guard(self.question()|changes, TOPICS['W01_INPUT'], 'easy', [])
        q=self.question();q['starter_code']=q['solution']
        with self.assertRaises(ValueError):question_guard(q,TOPICS['W01_INPUT'],'easy',[])

    def test_guard_requires_distinct_input_tests(self):
        q=self.question();q['test_cases']=q['test_cases'][:1]
        with self.assertRaises(ValueError):question_guard(q,TOPICS['W01_INPUT'],'easy',[])

    def test_future_concepts_and_near_duplicates_rejected(self):
        q=self.question()
        with self.assertRaises(ValueError):
            question_guard(q|{'solution':'for x in range(1):\n print(input())'},TOPICS['W01_INPUT'],'easy',[])
        with self.assertRaises(ValueError):
            question_guard(q|{'prompt':q['prompt'].replace('explorer','traveler')},TOPICS['W01_INPUT'],'easy',[q])

    def test_same_structure_different_story_rejected(self):
        q=self.question()
        with self.assertRaises(ValueError):
            question_guard(q|{'prompt':'A completely different forest adventure requires the ranger to greet a tree.'},TOPICS['W01_INPUT'],'easy',[q])

    def test_nested_loop_structure_detected(self):
        self.assertIn('nested_loop',concepts_in('for row in range(2):\n for col in range(3):\n  print(row,col)'))
        self.assertNotIn('nested_loop',concepts_in('for row in range(2):\n print(row)\nfor col in range(3):\n print(col)'))

    def test_executable_test_payload_rejected(self):
        q=self.question();q['test_cases'][0]['test_code']='import os'
        with self.assertRaises(ValueError):question_guard(q,TOPICS['W01_INPUT'],'easy',[])

    def test_guard_rejects_invalid_solution_and_duplicates(self):
        q=self.question()
        with self.assertRaises(ValueError):question_guard(q|{'solution':'print("wrong")'},TOPICS['W01_INPUT'],'easy',[])
        with self.assertRaises(ValueError):question_guard(q,TOPICS['W01_INPUT'],'easy',[q])

    def test_generated_has_private_alternate_input_fixture(self):
        q=question_guard(self.question(),TOPICS['W01_INPUT'],'easy',[])
        self.assertGreaterEqual(len(q.test_cases),2)
        self.assertNotEqual(q.test_cases[0].expected,q.test_cases[1].expected)
        self.assertIn('input',required_concepts(q))
        self.assertNotIn('test_cases',q.public())
        self.assertNotIn('solution',q.public())

    def test_sanitization_and_required_syntax(self):
        self.assertEqual(rebrand('NOBITA and Doraemon eat doracakes'),'Kai and Byte eat trail snacks')
        self.assertIn('unpack',concepts_in('a,b=1,2'))
        self.assertIn('semicolon',concepts_in('a=1; b=2'))
        self.assertNotIn('semicolon',concepts_in('print(";")'))

    def test_adaptive_actions(self):
        base=dict(world_id='W01',subtopic_id='W01_INPUT',mastery_score=0)
        for changes,action in [({},'same'),({'recent_attempts':[{'correct':False}]},'easier'),
            ({'recent_attempts':[{'correct':False}]*2},'remediation'),
            ({'mastery_score':.5},'harder'),({'mastery_score':.8},'challenge')]:
            self.assertEqual(adaptive_agent(base|changes)['next_action'],action)


class AdditionalLearningTests(unittest.TestCase):
    setUp=test_learning.LearningTests.setUp
    tearDown=test_learning.LearningTests.tearDown

    def test_mastery_accumulates_across_fresh_quests_and_next_advances(self):
        prompts=[
            'Read the visitor name for a museum guest book and welcome them at reception.',
            'A spaceship captain needs a launch greeting. Collect the destination planet to complete it.',
            'Record which instrument a musician brought to rehearsal, then announce its arrival.',
            'The garden club is labeling seed packets. Capture a plant variety from the console.',
            'An explorer has discovered a cave. Ask its new name to prepare a trail marker.',
            'A library robot checks an author signature from the keyboard and displays a message.',
            'Prepare a team badge for the coding festival using one console entry.'
        ]
        class Varied:
            def __init__(self):self.n=0
            def generate_question(self,context):
                q=Model().generate_question(context)
                count=self.n+1
                names=[f'value{i}' for i in range(count)]
                code='\n'.join(name+'=input()' for name in names)+'\nprint(f"Welcome '+ ' '.join('{'+name+'}' for name in names)+'")'
                q.update(prompt=prompts[self.n]+' Display the word Welcome followed by the entered text.',
                         world_id=context['topic']['world_id'],subtopic_id=context['topic']['id'],
                         concept_tags=context['topic']['allowed_concepts'],
                         solution=code,test_cases=[dict(inputs=[word]*count,expected='Welcome '+' '.join([word]*count)) for word in ['Nova','Kai']])
                self.n+=1
                return q
        self.engine.provider=Varied()
        s=self.engine.start('a','W01_INPUT')
        for i in range(6):
            solution=json.loads(self.store.session('a',s['session_id'])['question'])['solution']
            result=self.engine.submit('a',s['session_id'],s['question']['question_id'],
                                     solution,'mastery-'+str(i))
            self.assertEqual(result['topic_mastered'],i==5)
            if i<5:
                s=self.engine.next('a',s['session_id'])
                self.assertEqual(s['question']['subtopic_id'],'W01_INPUT')
        repeated=self.engine.submit('a',s['session_id'],s['question']['question_id'],
                                   solution,'mastery-replay')
        self.assertEqual(repeated['xp_awarded'],0)
        self.assertEqual(repeated['independent_successes'],6)
        self.assertEqual(self.engine.next('a',s['session_id'])['question']['subtopic_id'],'W01_FSTRINGS')

    def test_failure_preserves_active_question_and_draft(self):
        from app.question_generation_service import QuestionGenerationUnavailable
        s=self.engine.start('a','W01_INPUT')
        with self.store.db() as db:db.execute('UPDATE sessions SET draft=? WHERE id=?',('my draft',s['session_id']))
        class Offline:
            def generate_question(self,context):raise TimeoutError()
        self.engine.provider=Offline()
        with self.assertRaises(QuestionGenerationUnavailable):self.engine.next('a',s['session_id'])
        row=self.store.session('a',s['session_id'])
        self.assertEqual(row['draft'],'my draft')
        self.assertEqual(json.loads(row['question'])['question_id'],s['question']['question_id'])

    def test_generated_rejects_hardcoded_output(self):
        s=self.engine.start('a','W01_INPUT');q=s['question']
        args=('a',s['session_id'],q['question_id'])
        code='name=input()\nprint("Welcome Nova")'
        self.assertFalse(self.engine.submit(*args,code,'hardcoded')['correct'])
        row=self.store.session('a',s['session_id'])
        self.assertTrue(self.engine.submit(*args,json.loads(row['question'])['solution'],'good-generated')['correct'])

    def test_provider_context_contains_no_private_solutions(self):
        seen=[]
        model=Model()
        class Recording:
            def generate_question(self,context):
                seen.append(context)
                return model.generate_question(context)
        self.engine.provider=Recording()
        s=self.engine.start('a','W01_INPUT')
        self.engine.start('a','W01_INPUT',s['session_id'])
        for context in seen:
            self.assertNotIn('solution',json.dumps(context))
            self.assertNotIn('Doraemon',json.dumps(context))
