import base64
import tempfile
import unittest
from unittest.mock import patch
from app.concepts import LESSONS
from edition.service import LearningService
from edition.original_ui import route_request
from tests.test_learning import Model

class LearningMediaTests(unittest.TestCase):
    def test_presentation_receipts_are_ui_only_and_acknowledged_once(self):
        with patch('edition.original_ui.st.session_state',{}),patch('edition.original_ui.call') as backend:
            self.assertTrue(route_request('celebration-claim',{'event_id':'s:q'})['show'])
            self.assertFalse(route_request('celebration-claim',{'event_id':'s:q'})['show'])
            self.assertTrue(route_request('celebration-ack',{'event_id':'s:q'})['acknowledged'])
            self.assertFalse(route_request('celebration-claim',{'event_id':'s:q'})['show'])
            backend.assert_not_called()
    def test_video_and_review_are_read_only_for_learning_rewards(self):
        with tempfile.TemporaryDirectory() as folder:
            service=LearningService(folder,Model()).initialize()
            identity='d'*64
            with patch('edition.original_ui.call',lambda action,payload=None:service.call(identity,action,payload)):
                before=route_request('progress')
                media=route_request('toolkit-video')
                data=base64.b64decode(media['video'].split(',',1)[1])
                self.assertEqual(data[4:8],b'ftyp')
                captions=base64.b64decode(media['captions'].split(',',1)[1]).decode()
                for term in ('MODULE','PACKAGE','LIBRARY','FRAMEWORK'):self.assertIn(term,captions)
                for key in LESSONS:
                    route_request('concept/'+key)
                self.assertEqual(route_request('progress'),before)

    def test_reference_notes_stay_inside_existing_curriculum(self):
        adapted=[lesson for lesson in LESSONS.values() if lesson.get('practice_reference')]
        self.assertEqual(len(LESSONS),113)
        self.assertEqual(len(adapted),20)
        for lesson in adapted:
            self.assertEqual(lesson['version'],1)
            self.assertEqual(len(lesson['line_by_line']),len(lesson['worked_examples'][0]['code'].splitlines()))
