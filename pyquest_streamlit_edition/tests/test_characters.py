import tempfile
import unittest
from pathlib import Path

from app.characters import result_card
from app.storage import Store


class CharacterPersistenceTests(unittest.TestCase):
    def test_result_card_is_deterministic_for_character_and_tier(self):
        self.assertEqual(result_card('nova', 'EXCELLENT')['pose'], 'celebrating')
        self.assertEqual(result_card('kai', 'GOOD_TRY')['character'], 'kai')
        self.assertEqual(result_card('zed', 'TRY_AGAIN')['pose'], 'thinking')
        self.assertEqual(result_card('unknown', 'GREAT')['character'], 'byte')

    def test_preferences_are_queryable_after_restart(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / 'pyquest.db'
            store = Store(path)
            store.learner('learner')
            with store.db() as db:
                db.execute('UPDATE learners SET settings=? WHERE id=?',
                           ('{"selected_character":"mira","companion":"mira",'
                            '"sound_effects_enabled":false}', 'learner'))
            reopened = Store(path)
            reopened.learner('learner')
            with reopened.db() as db:
                row = db.execute('SELECT selected_character,sound_effects_enabled '
                                 'FROM user_preferences WHERE learner_id=?', ('learner',)).fetchone()
            self.assertEqual(tuple(row), ('mira', 0))