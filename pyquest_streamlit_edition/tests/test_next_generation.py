import tempfile
import unittest
from pathlib import Path
from langchain_core.exceptions import OutputParserException
from app.learning import LearningEngine
from app.storage import Store
from app.question_generation_service import QuestionGenerationUnavailable
from edition.generation_plan import introductory_plan
from tests.test_learning import Model

class NextGenerationTests(unittest.TestCase):
    def test_malformed_next_retries_and_accepts_fresh_generated_question(self):
        class MalformedOnce(Model):
            fail=False
            def generate_question(self,context):
                if self.fail:
                    self.fail=False
                    raise OutputParserException('Malformed JSON')
                return super().generate_question(context)
        with tempfile.TemporaryDirectory() as directory:
            store=Store(Path(directory)/'db');store.learner('a')
            model=MalformedOnce();engine=LearningEngine(store,model)
            first=engine.start('a','W01_INPUT');model.fail=True
            next_value=engine.next('a',first['session_id'],first['question']['question_id'])
            self.assertNotEqual(first['question']['question_id'],next_value['question']['question_id'])
            self.assertEqual(next_value['question']['generation_source'],'generated')
            self.assertEqual(store.progress('a')['xp'],0)

    def test_plan_changes_input_structure_without_private_code(self):
        plan=introductory_plan([{'solution':'a=input()\nb=input()\nprint(a,b)'}])
        self.assertEqual(plan['input_count'],1)
        self.assertNotIn('solution',plan)

    def test_rate_limit_preserves_session_and_draft(self):
        class RateLimited(Exception):status_code=429
        class Offline:
            def generate_question(self,context):raise RateLimited()
        with tempfile.TemporaryDirectory() as directory:
            store=Store(Path(directory)/'db');store.learner('a')
            engine=LearningEngine(store,Model());value=engine.start('a','W01_INPUT')
            with store.db() as db:db.execute('UPDATE sessions SET draft=? WHERE id=?',('my draft',value['session_id']))
            engine.provider=Offline()
            with self.assertRaises(QuestionGenerationUnavailable) as caught:
                engine.next('a',value['session_id'],value['question']['question_id'])
            self.assertEqual(caught.exception.reason,'rate_limited')
            self.assertIn('quota resets',str(caught.exception))
            self.assertEqual(store.session('a',value['session_id'])['draft'],'my draft')

if __name__=='__main__':unittest.main()
