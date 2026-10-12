"""Authoritative actions: reuse the engine, store, guards and coin ledger."""
import json
import re
import threading
from pathlib import Path
from app.catalog import WORLDS, TOPICS
from edition.curriculum import VISIBLE_WORLDS
from app.storage import Store
from app.learning import LearningEngine
from app.provider import LLMService
from app.models import GeneratedQuestion
from app.api_validation import validate_payload
from app.checkpoints import thread_lock
from app.hints import HintAgent
from app.rewards import SOLUTION_PRICES, transact
from app.execution_router import capability_for, Capability
from edition.availability import sandbox_available

# Separate start locks avoid nesting two differently keyed graph-lock stripes.
_START_LOCKS=[threading.RLock() for _ in range(64)]


class ExecutionUnavailable(ValueError):
    pass


class LearningService:
    def __init__(self, data_dir, provider=None, execution_enabled=True):
        self.store = Store(Path(data_dir)/'pyquest.db')
        self.engine = LearningEngine(self.store, provider if provider is not None else LLMService())
        self.execution_enabled = execution_enabled

    def public_session(self, identity, sid):
        row = self.store.session(identity, sid)
        q = GeneratedQuestion.model_validate_json(row['question'])
        if q.generation_source != 'generated':
            raise ValueError('Archived challenge. Select a concept to generate a new challenge.')
        # Empty saved drafts must remain empty; pristine sessions can use starter code.
        with self.store.db() as db:
            saved = db.execute('SELECT 1 FROM edition_drafts WHERE learner=? AND session=?', (identity, sid)).fetchone()
        return dict(session_id=sid, question=q.public(), draft=row['draft'], draft_saved=bool(saved))

    def initialize(self):
        with self.store.db() as db:
            db.execute('CREATE TABLE IF NOT EXISTS edition_drafts(learner TEXT NOT NULL, session TEXT NOT NULL, PRIMARY KEY(learner,session))')
        return self

    def remember(self, identity, session):
        with self.store.db() as db:
            settings = json.loads(db.execute('SELECT settings FROM learners WHERE id=?', (identity,)).fetchone()[0])
            settings.update(last_session=session['session_id'], last_topic=session['question']['subtopic_id'])
            db.execute('UPDATE learners SET settings=? WHERE id=?', (json.dumps(settings), identity))

    def require_runtime(self, topic):
        if capability_for(topic)==Capability.ISOLATED_SANDBOX and not sandbox_available():
            raise ExecutionUnavailable('Advanced challenges are unavailable while the secure execution service is offline. You can still study this Concept Card. No rewards were changed.')

    def call(self, identity, action, payload=None):
        if not isinstance(identity, str) or not re.fullmatch(r'[a-f0-9]{64}', identity):
            raise ValueError('Invalid learner identity.')
        p = validate_payload(payload or {})
        self.store.learner(identity)
        if action == 'catalog': return VISIBLE_WORLDS
        if action == 'health':
            return dict(status='ok', execution_enabled=self.execution_enabled, checkpoint='sqlite', verification_mode=not isinstance(self.engine.provider, LLMService))
        if action == 'progress': return self.store.progress(identity)
        if action == 'concept': return self.store.concept(identity, p['topic'])
        if action == 'complete': return self.store.concept(identity, p['topic'], True)
        if action == 'session': return self.public_session(identity, p['session_id'])
        if action in ('start','next','run','check') and not self.execution_enabled:
            raise ExecutionUnavailable('Secure execution is disabled here. Configure the authenticated external backend before generating or grading challenges.')
        if action == 'start':
            state = self.store.concept(identity, p['topic'])
            if not state['completed']: raise ValueError('Complete the Concept Card first.')
            with _START_LOCKS[hash((str(self.store.path),identity,p['topic']))%len(_START_LOCKS)]:
                state = self.store.concept(identity, p['topic'])
                if state['session_id']:value=self.public_session(identity,state['session_id'])
                else:
                    self.require_runtime(p['topic'])
                    value=self.engine.start(identity,p['topic'])
                self.remember(identity, value)
                return value
        if action == 'next':
            with thread_lock(self.engine.graph.path, identity+':'+p['session_id']):
                previous=self.public_session(identity,p['session_id'])
                self.require_runtime(previous['question']['subtopic_id'])
                value = self.engine.next(identity, p['session_id'], p['question_id'])
                if previous['question']['question_id']==p['question_id']:
                    with self.store.db() as db:
                        db.execute('DELETE FROM edition_drafts WHERE learner=? AND session=?', (identity,p['session_id']))
                self.remember(identity, value)
                return self.public_session(identity,p['session_id'])
        if action in ('run','check'):
            return self.engine.submit(identity, p['session_id'], p['question_id'], p['code'],
                                      identity+':'+p['operation_id'], run=action=='run', inputs=p.get('inputs'))
        if action in ('draft','hint','reveal'):
            row = self.store.session(identity, p['session_id'])
            question = GeneratedQuestion.model_validate_json(row['question'])
            if question.question_id != p['question_id']: raise ValueError('Question changed. Reload the challenge.')
            if action == 'draft':
                if 'code' not in p: raise ValueError('A code draft is required.')
                with self.store.db() as db:
                    db.execute('UPDATE sessions SET draft=? WHERE id=? AND learner=?', (p['code'],row['id'],identity))
                    db.execute('INSERT OR IGNORE INTO edition_drafts VALUES(?,?)', (identity,row['id']))
                return dict(saved=True)
            if action == 'hint':
                with self.store.db() as db:
                    number = db.execute('SELECT COUNT(*) FROM hint_history WHERE learner=? AND quest=?',(identity,question.question_id)).fetchone()[0]+1
                    hint = HintAgent().hint(question, number)
                    db.execute('INSERT INTO hint_history(learner,quest,number,text) VALUES(?,?,?,?)',(identity,question.question_id,number,hint))
                    db.execute('UPDATE sessions SET hints=hints+1 WHERE id=?',(row['id'],))
                return dict(hint=hint, hint_number=number, source='deterministic')
            if p.get('confirmed') is not True: raise ValueError('Confirm the solution purchase.')
            with self.store.db() as db:
                bought = db.execute('SELECT 1 FROM purchases WHERE learner=? AND question=?',(identity,question.question_id)).fetchone()
                if not bought:
                    transact(db,identity,question.question_id,'SOLUTION_PURCHASE',-SOLUTION_PRICES[question.difficulty],
                             'purchase:'+identity+':'+question.question_id,'Solution reveal')
                    db.execute('INSERT INTO purchases VALUES(?,?)',(identity,question.question_id))
                db.execute('UPDATE sessions SET revealed=1 WHERE id=?',(row['id'],))
            return dict(solution=question.solution)
        if action == 'settings':
            values = p.get('settings',{})
            allowed={'selected_character','companion','character_outfits','background','reduced_motion','music_enabled','music_volume','sound_effects_enabled','sound_effect_volume'}
            if not isinstance(values,dict) or set(values)-allowed: raise ValueError('Unsupported settings.')
            values=dict(values)
            if 'companion' in values and 'selected_character' not in values:values['selected_character']=values['companion']
            for key in ('reduced_motion','music_enabled','sound_effects_enabled'):
                if key in values and not isinstance(values[key],bool):raise ValueError('Invalid preference.')
            for key in ('music_volume','sound_effect_volume'):
                if key in values and (type(values[key]) not in (int,float) or not 0<=values[key]<=1):raise ValueError('Invalid volume.')
            if 'background' in values and values['background'] not in {w['image'] for w in WORLDS}:raise ValueError('Unknown world background.')
            if 'selected_character' in values and values['selected_character'] not in {'byte','kai','nova','mira','zed'}: raise ValueError('Unknown companion.')
            outfits = values.get('character_outfits',{})
            if not isinstance(outfits,dict) or any(k not in {'byte','kai','nova','mira','zed'} or v not in {'outfit_01','outfit_02'} for k,v in outfits.items()): raise ValueError('Unknown outfit.')
            with self.store.db() as db:
                old = json.loads(db.execute('SELECT settings FROM learners WHERE id=?',(identity,)).fetchone()[0])
                old.update(values)
                if 'selected_character' in values: old['companion']=values['selected_character']
                db.execute('UPDATE learners SET settings=? WHERE id=?',(json.dumps(old),identity))
            return dict(saved=True)
        raise ValueError('Unknown operation.')
