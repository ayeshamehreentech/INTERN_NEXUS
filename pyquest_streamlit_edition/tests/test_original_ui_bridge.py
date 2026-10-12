import tempfile
import unittest
from unittest.mock import patch
from edition.service import LearningService
from edition.original_ui import route_request
from tests.test_learning import Model

class OriginalUIBridgeTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.service=LearningService(self.temp.name,Model()).initialize()
        self.identity='c'*64
        self.adapter=patch('edition.original_ui.call',lambda action,payload=None:self.service.call(self.identity,action,payload))
        self.adapter.start()
    def tearDown(self):self.adapter.stop();self.temp.cleanup()

    def test_original_studio_preferences_persist_without_rewards(self):
        before=route_request('progress')
        route_request('settings',{'settings':{'companion':'nova','character_outfits':{'nova':'outfit_02'},'reduced_motion':True,'music_enabled':False,'music_volume':.3,'sound_effects_enabled':True,'sound_effect_volume':.2}})
        after=route_request('progress')
        self.assertEqual(after['settings']['selected_character'],'nova')
        self.assertEqual(after['settings']['character_outfits']['nova'],'outfit_02')
        for key in ('coins','xp','mastery'):self.assertEqual(before[key],after[key])
        with self.assertRaises(ValueError):route_request('settings',{'settings':{'music_volume':2}})

    def test_original_routes_preserve_empty_drafts_and_private_fixtures(self):
        route_request('concept-complete',{'topic':'W01_INPUT'})
        session=route_request('concept-start',{'topic':'W01_INPUT'})
        q=session['question'];payload={'session_id':session['session_id'],'question_id':q['question_id'],'code':''}
        route_request('draft',payload)
        restored=route_request('session/'+session['session_id'])
        self.assertTrue(restored['draft_saved']);self.assertEqual(restored['draft'],'')
        self.assertNotIn('test_cases',restored['question']);self.assertNotIn('solution',restored['question'])
        catalog=route_request('catalog')
        self.assertEqual(len(catalog),14)
        self.assertTrue(all(world['image'].startswith('/app/static/assets/maps/') for world in catalog))

if __name__=='__main__':unittest.main()
