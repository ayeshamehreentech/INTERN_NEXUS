import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from streamlit.testing.v1 import AppTest
from edition.studio_content import CONCEPTS
ROOT=Path(__file__).resolve().parents[1]

class StudioPageTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.env=patch.dict(os.environ,{'PYQUEST_FRONTEND':'native','PYQUEST_DATA_DIR':self.temp.name,'PYQUEST_IMAGE_CACHE_DIR':self.temp.name,'PYQUEST_IMAGE_PROVIDER':'huggingface','HF_TOKEN':'','HUGGINGFACEHUB_API_TOKEN':'','CLOUDFLARE_API_TOKEN':'','CLOUDFLARE_ACCOUNT_ID':'','PYQUEST_VIDEO_CACHE_DIR':self.temp.name,'PYQUEST_VIDEO_PROVIDER':'','PYQUEST_VERIFICATION_MODE':'1','PYQUEST_DEPLOYMENT':'local','PYQUEST_BACKEND_MODE':'local','PYQUEST_REQUIRE_AUTH':'false'})
        self.env.start();self.at=AppTest.from_file(str(ROOT/'app.py'),default_timeout=30).run()
    def tearDown(self):self.env.stop();self.temp.cleanup()
    def test_search_filter_and_tip_reading_do_not_change_rewards(self):
        at=self.at;before=dict(at.session_state['_stats'])
        at.switch_page('app_pages/tips.py').run();self.assertFalse(at.exception)
        at.text_input(key='tips_search').set_value('enumerate').run();self.assertFalse(at.exception)
        self.assertTrue(any(heading.value=='enumerate: index and value' for heading in at.subheader))
        at.text_input(key='tips_search').set_value('not-a-tip-987').run()
        self.assertTrue(any('No matches' in value.value for value in at.info))
        self.assertEqual(at.session_state['_stats'],before)
    def test_all_eight_diagrams_render_without_video_generation(self):
        at=self.at;before=dict(at.session_state['_stats'])
        at.switch_page('app_pages/visual_studio.py').run()
        for key in CONCEPTS:
            at.selectbox(key='visual_concept').select(key).run();self.assertFalse(at.exception,key)
            self.assertFalse(any(button.label=='Generate video' for button in at.button))
            self.assertFalse(any(button.label in ('Generate Visual Explanation','Regenerate Image','Download Image') for button in at.button))
            self.assertFalse(at.text_area)
        self.assertEqual(at.session_state['_stats'],before)
    def test_binary_search_single_step_and_independent_objects(self):
        at=self.at;at.switch_page('app_pages/visual_studio.py').run()
        at.selectbox(key='visual_concept').select('binary_search').run()
        next(widget for widget in at.slider if widget.label=='Search target').set_value(7).run();self.assertFalse(at.exception)
        at.selectbox(key='visual_concept').select('oop_concepts').run()
        next(button for button in at.button if button.label=='Increment object A').click().run()
        self.assertEqual(at.session_state.studio_object_a,1);self.assertEqual(at.session_state.studio_object_b,0)
    def test_original_interface_registers_native_studio_pages(self):
        with patch.dict(os.environ,{'PYQUEST_FRONTEND':'original'}):
            at=AppTest.from_file(str(ROOT/'app.py'),default_timeout=30).run()
            self.assertFalse(at.exception)
            at.switch_page('app_pages/tips.py').run();self.assertFalse(at.exception)
            self.assertTrue(any(value.value=='Pythonist Pro-Tips Vault' for value in at.title))
            at.switch_page('app_pages/visual_studio.py').run();self.assertFalse(at.exception)
