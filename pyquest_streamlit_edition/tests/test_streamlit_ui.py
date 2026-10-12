import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from streamlit.testing.v1 import AppTest
from app.catalog import WORLDS

ROOT=Path(__file__).resolve().parents[1]


class StreamlitUITests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.env=patch.dict(os.environ,{'PYQUEST_FRONTEND':'native','PYQUEST_DATA_DIR':self.temp.name,'PYQUEST_VERIFICATION_MODE':'1','PYQUEST_DEPLOYMENT':'local','PYQUEST_BACKEND_MODE':'local','PYQUEST_REQUIRE_AUTH':'false'})
        self.env.start()
        self.at=AppTest.from_file(str(ROOT/'app.py'),default_timeout=30).run()
    def tearDown(self):self.env.stop();self.temp.cleanup()
    def learn(self):
        self.at.switch_page('app_pages/learn.py').run()
        self.at.selectbox(key='topic_choice').select('W01_INPUT').run()
        return self.at
    def test_home_lists_fourteen_worlds_and_no_rankings(self):
        self.assertFalse(self.at.exception)
        labels=[button.label for button in self.at.button]
        for world in WORLDS:self.assertIn('Explore '+world['name'],labels)
        self.assertEqual(len([label for label in labels if label.startswith('Explore ')]),14)
    def test_concept_to_code_review_rerun_empty_draft_and_rewards(self):
        at=self.learn();self.assertFalse(at.exception)
        at.button(key='start_challenge').click().run();self.assertFalse(at.exception)
        at.switch_page('app_pages/practice.py').run()
        code=next(widget for widget in at.text_area if widget.label=='Python code')
        key=code.key
        code.set_value('name=input()\nprint("Welcome",name)').run()
        next(button for button in at.button if button.label=='Run code').click().run()
        self.assertFalse(at.exception)
        next(button for button in at.button if button.label=='Check answer').click().run()
        self.assertFalse(at.exception)
        self.assertTrue(any('Correct!' in value.value for value in at.success))
        next(button for button in at.button if button.label=='Review concept').click().run()
        self.assertFalse(at.exception)
        at.switch_page('app_pages/learn.py').run()
        self.assertFalse(at.exception)
        at.button(key='start_challenge').click().run()
        at.switch_page('app_pages/practice.py').run()
        self.assertEqual(at.text_area(key=key).value,'name=input()\nprint("Welcome",name)')
        at.text_area(key=key).set_value('').run()
        next(button for button in at.button if button.label=='Review concept').click().run()
        self.assertFalse(at.exception)
        at.switch_page('app_pages/learn.py').run()
        at.button(key='start_challenge').click().run()
        at.switch_page('app_pages/practice.py').run()
        self.assertFalse(at.exception);self.assertEqual(at.text_area(key=key).value,'')
    def test_lesson_completion_does_not_change_statistics(self):
        at=self.learn();before=dict(at.session_state['_stats'])
        at.button(key='complete_concept').click().run()
        self.assertFalse(at.exception);self.assertEqual(before,at.session_state['_stats'])
    def test_success_dialog_close_and_rerun_preserve_challenge_without_replay(self):
        at=self.learn();at.button(key='start_challenge').click().run()
        at.switch_page('app_pages/practice.py').run()
        code=next(widget for widget in at.text_area if widget.label=='Python code')
        code.set_value('name=input()\nprint("Welcome",name)').run()
        next(button for button in at.button if button.label=='Run code').click().run()
        self.assertNotIn('_native_success_pending',at.session_state)
        next(button for button in at.button if button.label=='Check answer').click().run()
        self.assertFalse(at.exception)
        sid=at.session_state.current_session
        event=dict(at.session_state['_native_success_pending'])
        at.run()
        self.assertEqual(at.session_state['_native_success_pending']['id'],event['id'])
        at.button(key='success_stay').click().run()
        self.assertFalse(at.exception)
        self.assertEqual(at.session_state.current_session,sid)
        self.assertNotIn('_native_success_pending',at.session_state)
        stats=dict(at.session_state['_stats'])
        next(button for button in at.button if button.label=='Check answer').click().run()
        self.assertNotIn('_native_success_pending',at.session_state)
        for field in ('xp','coins','mastery'):self.assertEqual(at.session_state['_stats'][field],stats[field])
    def test_all_113_cards_render_with_native_widgets(self):
        at=self.learn();seen=0
        for world in WORLDS:
            at.selectbox(key='world_choice').select(world['id']).run()
            for topic in world['topics']:
                at.selectbox(key='topic_choice').select(topic['id']).run()
                self.assertFalse(at.exception,topic['id'])
                self.assertTrue(any(heading.value==topic['name'] for heading in at.header),topic['id'])
                seen+=1
        self.assertEqual(seen,113)
    def test_cloud_without_remote_backend_is_read_only_preview(self):
        with patch.dict(os.environ,{'PYQUEST_DEPLOYMENT':'cloud','PYQUEST_BACKEND_MODE':'local','PYQUEST_VERIFICATION_MODE':'0'}):
            at=AppTest.from_file(str(ROOT/'app.py'),default_timeout=30).run()
            self.assertFalse(at.exception);self.assertIsNone(at.session_state['_client'])
            at.switch_page('app_pages/learn.py').run()
            self.assertTrue(at.button(key='start_challenge').disabled)
            self.assertTrue(at.button(key='complete_concept').disabled)

    def test_unavailable_advanced_challenge_keeps_concept_and_no_rewards(self):
        at=self.learn()
        at.selectbox(key='world_choice').select('W12').run()
        at.selectbox(key='topic_choice').select('W12_FUNCTIONS').run()
        before=dict(at.session_state['_stats'])
        with patch('edition.service.sandbox_available',return_value=False):
            at.button(key='start_challenge').click().run()
        self.assertFalse(at.exception)
        self.assertTrue(any('secure execution service is offline' in value.value for value in at.error))
        self.assertEqual(before,at.session_state['_stats'])
        self.assertFalse(at.button(key='start_challenge').disabled)
