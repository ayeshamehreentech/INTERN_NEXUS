"""Independent local PyQuest V2 server: python main.py."""
import json
import logging
import mimetypes
import os
import secrets
import uuid
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
from dotenv import load_dotenv
from app.catalog import WORLDS
from app.models import GeneratedQuestion
from app.storage import Store
from app.provider import LLMService
from app.learning import LearningEngine
from app.question_generation_service import QuestionGenerationUnavailable
from app.rewards import SOLUTION_PRICES,transact
from app.hints import HintAgent
from app.characters import normalize_character
from app.api_validation import validate_payload

ROOT=Path(__file__).resolve().parent 

def create_server(port=8766,data_dir=None,provider=None):
    store=Store(Path(data_dir or ROOT/'data')/'pyquest.db')
    engine=LearningEngine(store,provider or LLMService())
    class Handler(BaseHTTPRequestHandler):
        def setup(self):
            super().setup()
            self.connection.settimeout(20)
        def end_headers(self):
            self.send_header('X-Content-Type-Options','nosniff')
            self.send_header('X-Frame-Options','DENY')
            self.send_header('Referrer-Policy','no-referrer')
            super().end_headers()
        def valid_host(self):
            return self.headers.get('Host') in (f'127.0.0.1:{self.server.server_port}',f'localhost:{self.server.server_port}')
        def identity(self):
            cookies=SimpleCookie(self.headers.get('Cookie',''))
            token=cookies.get('pyquest')
            value=token.value if token else ''
            if len(value)!=64 or any(c not in '0123456789abcdef' for c in value):
                value=secrets.token_hex(32)
            store.learner(value)
            return value
        def send_json(self,value,status=200):
            payload=json.dumps(value).encode()
            self.send_response(status)
            self.send_header('Content-Type','application/json')
            self.send_header('Cache-Control','no-store')
            self.send_header('Set-Cookie',f'pyquest={self.user}; HttpOnly; SameSite=Strict; Path=/; Max-Age=31536000')
            self.send_header('Content-Length',str(len(payload)));self.end_headers();self.wfile.write(payload)
        def do_GET(self):
            if not self.valid_host():
                self.user='';return self.send_json({'error':'Host rejected'},403)
            self.user=self.identity()
            path=urlsplit(self.path).path
            if path=='/api/catalog':return self.send_json(WORLDS)
            if path=='/api/progress':return self.send_json(store.progress(self.user))
            if path=='/api/health':return self.send_json({'status':'ok','graph':'compiled','verification_mode':provider is not None})
            if path.startswith('/api/concept/'):
                try:return self.send_json(store.concept(self.user,path.rsplit('/',1)[1]))
                except ValueError as exc:return self.send_json({'error':str(exc)},404)
            if path.startswith('/api/session/'):
                try:
                    row=store.session(self.user,path.rsplit('/',1)[1])
                    if json.loads(row['question']).get('generation_source')!='generated':
                        return self.send_json({'error':'This saved legacy exercise is archived. Choose the topic to generate a fresh quest.','code':'LEGACY_QUEST_ARCHIVED'},409)
                    return self.send_json(dict(session_id=row['id'],question=GeneratedQuestion.model_validate_json(row['question']).public(),draft=row['draft']))
                except ValueError as exc:return self.send_json({'error':str(exc)},404)
            if path=='/':target=ROOT/'web/index.html'
            elif path.startswith(('/assets/','/web/')):target=(ROOT/path.lstrip('/')).resolve()
            else:return self.send_json({'error':'Not found'},404)
            animation_manifest = target == ROOT/'assets/characters/animated/manifest.json'
            if not target.is_relative_to(ROOT) or not target.is_file() or (target.suffix not in ('.html','.css','.js','.jpeg','.png','.svg','.webp') and not animation_manifest):
                return self.send_json({'error':'Not found'},404)
            raw=target.read_bytes();self.send_response(200)
            self.send_header('Content-Type',mimetypes.guess_type(str(target))[0] or 'application/octet-stream')
            self.send_header('Content-Length',str(len(raw)));self.end_headers();self.wfile.write(raw)
        def do_POST(self):
            if not self.valid_host():
                self.user='';return self.send_json({'error':'Host rejected'},403)
            self.user=self.identity()
            if self.headers.get('Origin') not in (None,'http://'+self.headers.get('Host','')):
                return self.send_json({'error':'Origin rejected'},403)
            try:
                if self.headers.get_content_type()!='application/json':raise ValueError('Use application/json')
                if self.headers.get('Transfer-Encoding'):raise ValueError('Transfer encoding is unsupported')
                size=int(self.headers.get('Content-Length','0'))
                if not 0<size<=16000:raise ValueError('Invalid request size')
                def reject_constant(value):raise ValueError('Non-finite JSON numbers are unsupported')
                p=validate_payload(json.loads(self.rfile.read(size),parse_constant=reject_constant))
                route=urlsplit(self.path).path
                if route=='/api/concept-complete':result=store.concept(self.user,p['topic'],complete=True)
                elif route=='/api/concept-start':
                    state=store.concept(self.user,p['topic'])
                    if not state['completed']:raise ValueError('Complete the concept card first.')
                    from app.checkpoints import thread_lock
                    with thread_lock(engine.graph.path,self.user+':concept:'+p['topic']):
                        state=store.concept(self.user,p['topic'])
                        if state['session_id']:
                            row=store.session(self.user,state['session_id'])
                            result=dict(session_id=row['id'],question=GeneratedQuestion.model_validate_json(row['question']).public(),draft=row['draft'])
                        else:result=engine.start(self.user,p['topic'])
                elif route=='/api/start':result=engine.start(self.user,p['topic'])
                elif route=='/api/next':
                    result=engine.next(self.user,p['session_id'],p.get('question_id'))
                elif route in ('/api/run','/api/check'):
                    result=engine.submit(self.user,p['session_id'],p['question_id'],p['code'],
                        self.user+':'+str(p.get('operation_id',uuid.uuid4().hex)),run=route=='/api/run',inputs=p.get('inputs'))
                elif route in ('/api/draft','/api/hint','/api/reveal'):
                    row=store.session(self.user,p['session_id'])
                    q=GeneratedQuestion.model_validate_json(row['question'])
                    if p['question_id']!=q.question_id:raise ValueError('Question changed')
                    result={}
                    if route=='/api/draft':
                        if not isinstance(p['code'],str) or len(p['code'])>4000:raise ValueError('Invalid draft')
                        with store.db() as db:db.execute('UPDATE sessions SET draft=? WHERE id=?',(p['code'],row['id']))
                    elif route=='/api/hint':
                        with store.db() as db:
                            number=db.execute('SELECT COUNT(*) FROM hint_history WHERE learner=? AND quest=?',(self.user,q.question_id)).fetchone()[0]+1
                            hint=HintAgent().hint(q,number)
                            db.execute('INSERT INTO hint_history(learner,quest,number,text) VALUES(?,?,?,?)',(self.user,q.question_id,number,hint))
                            db.execute('UPDATE sessions SET hints=hints+1 WHERE id=?',(row['id'],))
                            result={'hint':hint,'hint_number':number,'source':'deterministic'}
                    else:
                        if p.get('confirmed') is not True:raise ValueError('Confirm the solution purchase.')
                        with store.db() as db:
                            bought=db.execute('SELECT 1 FROM purchases WHERE learner=? AND question=?',(self.user,q.question_id)).fetchone()
                            if not bought:
                                transact(db,self.user,q.question_id,'SOLUTION_PURCHASE',-SOLUTION_PRICES[q.difficulty],
                                    'purchase:'+self.user+':'+q.question_id,'Solution reveal')
                                db.execute('INSERT INTO purchases VALUES(?,?)',(self.user,q.question_id))
                            db.execute('UPDATE sessions SET revealed=1 WHERE id=?',(row['id'],))
                        result={'solution':q.solution}
                elif route=='/api/settings':
                    settings=p.get('settings',{})
                    if not isinstance(settings,dict):raise ValueError('Invalid settings')
                    allowed={k:v for k,v in settings.items() if k in ('selected_character','companion','background','reduced_motion','character_outfits','music_enabled','music_volume','sound_effects_enabled','sound_effect_volume')}
                    if 'selected_character' in allowed:
                        allowed['selected_character']=normalize_character(allowed['selected_character'])
                        allowed['companion']=allowed['selected_character']
                    elif 'companion' in allowed:
                        allowed['companion']=normalize_character(allowed['companion'])
                        allowed['selected_character']=allowed['companion']
                    if 'music_enabled' in allowed and not isinstance(allowed['music_enabled'],bool):raise ValueError('Invalid music preference')
                    if 'music_volume' in allowed and (type(allowed['music_volume']) not in (int,float) or not 0<=allowed['music_volume']<=1):raise ValueError('Invalid volume')
                    if 'sound_effect_volume' in allowed and (type(allowed['sound_effect_volume']) not in (int,float) or not 0<=allowed['sound_effect_volume']<=1):raise ValueError('Invalid volume')
                    if 'sound_effects_enabled' in allowed and not isinstance(allowed['sound_effects_enabled'],bool):raise ValueError('Invalid sound preference')
                    if 'character_outfits' in allowed:
                        outfits=allowed['character_outfits']
                        if not isinstance(outfits,dict) or any(k not in ('byte','nova','kai','mira','zed') or v not in ('outfit_01','outfit_02') for k,v in outfits.items()):
                            raise ValueError('Invalid character outfits')
                    if 'companion' in allowed and normalize_character(allowed['companion']) != allowed['companion']:
                        raise ValueError('Unknown companion')
                    if 'background' in allowed and allowed['background'] not in ['',*[w['image'] for w in WORLDS]]:
                        raise ValueError('Unknown background')
                    if 'reduced_motion' in allowed and not isinstance(allowed['reduced_motion'],bool):
                        raise ValueError('Invalid motion preference')
                    with store.db() as db:
                        old=json.loads(db.execute('SELECT settings FROM learners WHERE id=?',(self.user,)).fetchone()[0])
                        if 'character_outfits' in allowed:
                            allowed['character_outfits']=old.get('character_outfits',{})|allowed['character_outfits']
                        merged=old|allowed
                        db.execute('UPDATE learners SET settings=? WHERE id=?',(json.dumps(merged),self.user))
                        db.execute("""INSERT INTO user_preferences
                            (learner_id,selected_character,music_enabled,music_volume,
                             sound_effects_enabled,sound_effect_volume,reduced_motion)
                            VALUES(?,?,?,?,?,?,?)
                            ON CONFLICT(learner_id) DO UPDATE SET
                            selected_character=excluded.selected_character,
                            music_enabled=excluded.music_enabled,
                            music_volume=excluded.music_volume,
                            sound_effects_enabled=excluded.sound_effects_enabled,
                            sound_effect_volume=excluded.sound_effect_volume,
                            reduced_motion=excluded.reduced_motion,
                            updated_at=CURRENT_TIMESTAMP""",
                            (self.user,merged.get('selected_character','byte'),int(merged.get('music_enabled',False)),
                             merged.get('music_volume',.15),int(merged.get('sound_effects_enabled',True)),
                             merged.get('sound_effect_volume',.2),int(merged.get('reduced_motion',False))))
                    result={'saved':True}
                else:return self.send_json({'error':'Unknown operation'},404)
                self.send_json(result)
            except QuestionGenerationUnavailable as exc:
                self.send_json({'error':str(exc),'code':exc.code,'reason':exc.reason,'retryable':True},503)
            except (ValueError,KeyError,TypeError) as exc:self.send_json({'error':str(exc)},400)
            except Exception:
                logging.exception('request_failed')
                self.send_json({'error':'The request failed. Please retry.'},500)
    server=ThreadingHTTPServer(('127.0.0.1',port),Handler)
    server.engine=engine
    return server

if __name__=='__main__':
    load_dotenv(ROOT/'pyquest_v2.env')
    load_dotenv(ROOT/'.env')
    logging.basicConfig(level=logging.INFO)
    server=create_server(int(os.getenv('PYQUEST_PORT') or '8766'),os.getenv('PYQUEST_DATA_DIR'))
    print(f'PyQuest V2: http://127.0.0.1:{server.server_port}')
    try:server.serve_forever()
    except KeyboardInterrupt:pass
    finally:server.server_close()
