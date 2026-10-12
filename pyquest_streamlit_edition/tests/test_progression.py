import json
import tempfile
import unittest
from pathlib import Path
from app.catalog import WORLDS
from app.storage import Store
from app.learning import LearningEngine
from tests.test_learning import Model

class ProgressionTests(unittest.TestCase):
    def test_completion_replay_persistence_and_no_bonus(self):
        with tempfile.TemporaryDirectory() as folder:
            store=Store(Path(folder)/'db');store.learner('p')
            engine=LearningEngine(store,Model())
            session=engine.start('p','W01_INPUT')
            with store.db() as db:
                for topic in WORLDS[0]['topics']:
                    db.execute('INSERT OR REPLACE INTO mastery VALUES(?,?,?)',('p',topic['id'],.9))
            args=('p',session['session_id'],session['question']['question_id'],'name=input()\nprint("Welcome",name)')
            value=engine.submit(*args,'first');completion=value['world_completion']
            self.assertTrue(completion['completed']);self.assertTrue(completion['completion_id'])
            self.assertEqual(value,engine.submit(*args,'first'))
            self.assertEqual(completion['xp_gained'],value['xp_awarded'])
            self.assertEqual(completion['coins_gained'],value['coins_awarded'])
            self.assertEqual(value['xp_total'],Store(store.path).progress('p')['xp'])
            again=engine.submit(*args,'second')
            self.assertEqual(again['xp_awarded'],0)
            self.assertEqual(again['world_completion']['completion_id'],completion['completion_id'])
            with Store(store.path).db() as db:
                saved=json.loads(db.execute('SELECT result FROM level_completions').fetchone()[0])
                self.assertEqual(saved['completion_id'],completion['completion_id'])

    def test_normal_correct_is_not_completion(self):
        with tempfile.TemporaryDirectory() as folder:
            store=Store(Path(folder)/'db');store.learner('p');engine=LearningEngine(store,Model())
            s=engine.start('p','W01_INPUT')
            v=engine.submit('p',s['session_id'],s['question']['question_id'],'name=input()\nprint("Welcome",name)','first')
            self.assertTrue(v['correct']);self.assertFalse(v['world_completion']['completed'])
            self.assertEqual(v['new_mastery'],.15)
