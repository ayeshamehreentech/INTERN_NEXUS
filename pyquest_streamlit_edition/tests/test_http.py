import json
import tempfile
import threading
import unittest
import urllib.request
import http.cookiejar
from main import create_server
from tests.test_learning import Model
from app.catalog import WORLDS
from app.agents.supervisor import AGENTS, supervisor

class HttpTests(unittest.TestCase):
    def test_animation_manifest_is_served_without_exposing_other_json(self):
        with tempfile.TemporaryDirectory() as folder:
            server=create_server(0,folder,Model())
            thread=threading.Thread(target=server.serve_forever);thread.start()
            try:
                with urllib.request.urlopen(f'http://127.0.0.1:{server.server_port}/assets/characters/animated/manifest.json') as response:
                    self.assertIn('application/json',response.headers['Content-Type'])
                    self.assertEqual(set(json.load(response)['characters']),{'kai','nova','mira','byte','zed'})
                with self.assertRaises(urllib.error.HTTPError):
                    urllib.request.urlopen(f'http://127.0.0.1:{server.server_port}/web/package.json')
            finally:server.shutdown();thread.join();server.server_close()
    def test_all_routes(self):
        for world in WORLDS:
            state=dict(subtopic_id=world['topics'][0]['id'],world_id=world['id'],difficulty='easy',mastery_score=0)
            state.update(supervisor(state))
            self.assertEqual(AGENTS[world['id']](state)['specialist_context']['world_id'],world['id'])
    def test_http_learning_and_restart(self):
        with tempfile.TemporaryDirectory() as folder:
            cookies=http.cookiejar.CookieJar()
            client=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cookies))
            server=create_server(0,folder,Model())
            thread=threading.Thread(target=server.serve_forever);thread.start()
            def call(path,data=None):
                request=urllib.request.Request(f'http://127.0.0.1:{server.server_port}/api/'+path,
                    data=json.dumps(data).encode() if data is not None else None,
                    headers={'Content-Type':'application/json'})
                return json.load(client.open(request,timeout=30))
            try:
                self.assertEqual(call('progress')['score'],0)
                call('settings',{'settings':{'companion':'kai','character_outfits':{'kai':'outfit_02'},'music_enabled':True,'music_volume':.2}})
                with self.assertLogs(level='INFO') as logs:
                    session=call('start',{'topic':'W01_INPUT'})
                self.assertIn('langgraph_invoked',' '.join(logs.output))
                self.assertIn('IOHarborAgent',' '.join(logs.output))
                q=session['question'];self.assertEqual(q['generation_source'],'generated')
                self.assertEqual(call('session/'+session['session_id'])['question']['question_id'],q['question_id'])
                body=dict(session_id=session['session_id'],question_id=q['question_id'],code='pass',operation_id='wrong')
                self.assertFalse(call('check',body)['correct'])
                body.update(code='name=input()\nprint("Welcome",name)',operation_id='right')
                self.assertTrue(call('check',body)['correct'])
                self.assertEqual(call('check',body)['xp_awarded'],75) # replay returns original receipt
                self.assertEqual(call('progress')['score'],75)
                action_body={'session_id':session['session_id'],'question_id':q['question_id']}
                self.assertTrue(call('hint',action_body)['hint'])
                coins_before=call('progress')['coins']
                solution=call('reveal',dict(action_body,confirmed=True))['solution']
                self.assertIn('input',solution)
                self.assertEqual(call('progress')['coins'],coins_before-q['solution_cost'])
                self.assertEqual(call('reveal',dict(action_body,confirmed=True))['solution'],solution)
                self.assertEqual(call('progress')['coins'],coins_before-q['solution_cost'])
                self.assertNotEqual(call('next',{'session_id':session['session_id']})['question']['question_id'],q['question_id'])
            finally:server.shutdown();thread.join();server.server_close()
            server=create_server(0,folder,Model())
            thread=threading.Thread(target=server.serve_forever);thread.start()
            try:
                progress=call('progress')
                self.assertEqual(progress['score'],75)
                self.assertEqual(progress['settings']['companion'],'kai')
                self.assertEqual(progress['settings']['character_outfits']['kai'],'outfit_02')
                self.assertTrue(progress['settings']['music_enabled'])
                self.assertEqual(progress['settings']['music_volume'],.2)
            finally:server.shutdown();thread.join();server.server_close()
