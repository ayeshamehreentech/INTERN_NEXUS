import ast
import hashlib
import json
import logging
import re
import uuid
from langgraph.graph import StateGraph, START, END
from app.models import GeneratedQuestion,LearningState
from app.catalog import TOPICS
from app.legacy_catalog import WORLDS as LEGACY
from app.execution import execute
from app.agents.supervisor import AGENTS, supervisor
from app.agents.question_guard import question_guard as guard
from app.agents.adaptive_agent import adaptive_agent
from app.agents.remediation_agent import remediation_agent
from app.agents.feedback_agent import feedback_agent
from app.question_generation_service import QuestionGenerationService, QuestionGenerationUnavailable
from app.validation import required_concepts
from app.mastery import MasteryPolicy,evidence_for,next_topic
from app.novelty import structure_fingerprint
from app.scoring import ScoreAgent,SuggestionAgent
from app.check_answer_service import CheckAnswerService
from app.rewards import QUESTION_COINS,transact
from app.characters import result_card, normalize_character
from app.agents.planner import Planner
from app.checkpoints import PersistentGraph, thread_lock
from langchain_core.exceptions import OutputParserException

def fingerprint(q):
    return re.sub(r'\W+',' ',q['prompt'].lower()).strip()

def rebrand(text):
    for old,new in [('Doraemon','Byte'),('Nobita','Kai'),('Shizuka','Nova'),('Gian','Zed'),('Suneo','Mira'),('doracakes','trail snacks'),('doracake','trail snack')]:
        text=re.sub(r'\b'+re.escape(old)+r'\b',new,text,flags=re.I)
    return text

class LearningEngine:
    def __init__(self,store,provider):
        self.store,self.provider=store,provider
        self.question_service=QuestionGenerationService()
        self.planner=Planner()
        self.check_answer_service = CheckAnswerService(self.store)

        def planner_node(state):
            plan = self.planner.plan(state)
            return {**state, **plan}

        graph=StateGraph(LearningState)
        graph.add_node('load_learner_state',self.load_learner_state)
        graph.add_node('planner',planner_node)
        graph.add_node('supervisor',supervisor)
        graph.add_node('curriculum',lambda s:{'world_id':TOPICS[s['subtopic_id']]['world_id']})
        graph.add_node('performance',self.performance)
        graph.add_node('adaptive',self.adaptive)
        graph.add_node('remediation',remediation_agent)
        graph.add_node('question_generator',self.generate)
        graph.add_node('question_guard',self.check)
        graph.add_node('novelty_guard',self.novelty_guard)
        graph.add_node('persist_quest',self.persist_quest)
        graph.add_node('generation_unavailable',self.unavailable)
        for world,agent in AGENTS.items():
            graph.add_node(world,agent)
            graph.add_edge(world,'question_generator')
        graph.add_edge(START,'load_learner_state');graph.add_edge('load_learner_state','planner');graph.add_edge('planner','supervisor');graph.add_edge('supervisor','curriculum')
        graph.add_edge('curriculum','performance');graph.add_edge('performance','adaptive')
        graph.add_conditional_edges('adaptive',lambda s:'remediation' if s['next_action']=='remediation' else s['world_id'],
                                    {'remediation':'remediation',**{w:w for w in AGENTS}})
        graph.add_conditional_edges('remediation',lambda s:s['world_id'],{w:w for w in AGENTS})
        graph.add_edge('question_generator','question_guard');graph.add_edge('question_guard','novelty_guard')
        graph.add_conditional_edges('novelty_guard',lambda s:'done' if s.get('valid') else ('retry' if s.get('retries',0)<3 and s.get('provider_status')!='unavailable' else 'unavailable'),
                                    {'done':'persist_quest','retry':'question_generator','unavailable':'generation_unavailable'})
        graph.add_edge('persist_quest',END)
        graph.add_edge('generation_unavailable',END)
        self.graph=PersistentGraph(graph, store.path.with_name(store.path.name + '.checkpoints.sqlite'))
    def load_learner_state(self,s):
        if not isinstance(s.get('subtopic_id'),str) or s['subtopic_id'] not in TOPICS:
            raise ValueError('A valid subtopic is required.')
        if not s.get('learner_id') or not s.get('session_id'):
            raise ValueError('Learner and session are required.')
        learner_id = s.get('learner_id') or s.get('session_id','anonymous')
        with self.store.db() as db:
            stored = json.loads(db.execute('SELECT settings FROM learners WHERE id=?', (learner_id,)).fetchone()[0] or '{}') if db.execute('SELECT 1 FROM learners WHERE id=?', (learner_id,)).fetchone() else {}
        selected_character = normalize_character(stored.get('selected_character') or stored.get('companion') or 'byte')
        return {'learner_id': learner_id, 'selected_character': selected_character}

    def performance(self,s):
        recent=s.get('recent_attempts',[])
        return {'next_action':'remediation' if len(recent)>=2 and not any(x['correct'] for x in recent[:2]) else 'practice'}
    def adaptive(self,s):
        return adaptive_agent(s)
    def novelty_guard(self,s):
        return {'valid': bool(s.get('valid')), 'retries': s.get('retries', 0), 'provider_status': s.get('provider_status', 'responded')}
    def persist_quest(self,s):
        q = s.get('current_question')
        learner_id = s.get('learner_id') or s.get('session_id') or 'anonymous'
        # Commit quest, active record and session together after invoke succeeds.
        return {'valid': True, 'learner_id': learner_id, 'question_source': s.get('question_source', 'generated'), 'current_question': q}
    def generate(self,s):
        try:
            from edition.generation_plan import introductory_plan
            references=[{'prompt':rebrand(q['task']),'requirements':q['required']} for w in LEGACY for t in w['topics'] if t['id']==s['subtopic_id'] for q in t['questions'][1:3]]
            raw=self.question_service.generate(self.provider,dict(specialist=s['specialist_context'],topic=TOPICS[s['subtopic_id']],difficulty=s['difficulty'],
                correction=s.get('guard_error',''),
                mastery=s['mastery_score'],recent_attempts=s.get('recent_attempts',[]),
                novelty_plan=introductory_plan(s.get('recent_questions',[])) if s['subtopic_id']=='W01_INPUT' else {},
                recent_questions=[{'prompt':q['prompt'],'structure_fingerprint':structure_fingerprint(q['solution'])} for q in s.get('recent_questions',[])],reference_examples=references))
            return {'candidate':raw,'retries':s['retries']+1,'provider_status':'responded'}
        except Exception as exc:
            logging.warning('question_generation_failed category=%s',type(exc).__name__)
            if isinstance(exc, OutputParserException):
                # Malformed model output is correctable within bounded graph
                # retries; it is not a transport outage.
                return {'candidate':{},'retries':s['retries']+1,'provider_status':'responded'}
            status=getattr(exc,'status_code',None)
            reason='rate_limited' if status==429 else ('provider_authentication' if status in (401,403) else 'provider_unavailable')
            return {'candidate':{},'retries':s['retries']+1,'provider_status':'unavailable','generation_error':reason}
    def check(self,s):
        try:
            q=guard(s['candidate'],TOPICS[s['subtopic_id']],s['difficulty'],s.get('recent_questions',[]))
            return {'valid':True,'current_question':q.model_dump(),'question_source':'generated'}
        except Exception as exc:
            # Only our short validation reasons may enter logs/model context;
            # Pydantic errors may embed the private candidate and are not logged.
            reason=str(exc) if type(exc) is ValueError else 'Structured question schema invalid'
            logging.warning('question_guard_rejected category=%s reason=%s',type(exc).__name__,reason)
            if reason.startswith('Sandbox unavailable'):
                return {'valid':False,'guard_error':reason,'provider_status':'unavailable'}
            return {'valid':False,'guard_error':reason}
    def unavailable(self,s):
        logging.warning('QUESTION_GENERATION_UNAVAILABLE reason=%s',s.get('generation_error') or ('provider_unavailable' if s['provider_status']=='unavailable' else 'guard_rejected'))
        raise QuestionGenerationUnavailable(s.get('generation_error') or ('provider_unavailable' if s['provider_status']=='unavailable' else 'guard_rejected'))
    def next(self,identity,sid,expected_question_id=None):
        previous=self.store.session(identity,sid)
        expected=expected_question_id or json.loads(previous['question'])['question_id']
        with thread_lock(self.graph.path, identity+':'+sid):
            current=self.store.session(identity,sid)
            question=GeneratedQuestion.model_validate_json(current['question'])
            if question.question_id != expected:
                return dict(session_id=sid,question=question.public(),draft=current['draft'],
                            next_action='practice',provider_status='restored')
            return self._next(identity,sid)

    def _next(self,identity,sid):
        previous=self.store.session(identity,sid)
        progress=self.store.progress(identity)
        topic=previous['topic']
        if progress['topic_statuses'][topic]['topic_mastered']:
            topic=next_topic(topic) or topic
        return self.start(identity,topic,sid,advance=True)

    def start(self,identity,topic,sid=None,advance=False):
        if topic not in TOPICS: raise ValueError('Unknown topic.')
        if sid:
            old=self.store.session(identity,sid)
            if old['topic']!=topic and not advance: raise ValueError('Topic mismatch')
        stats=self.store.progress(identity)
        with self.store.db() as db:
            history=[json.loads(r[0]) for r in db.execute('SELECT question FROM history WHERE learner=? AND topic=? ORDER BY rowid DESC LIMIT 10',(identity,topic))]
        sid=sid or uuid.uuid4().hex
        logging.info('langgraph_invoked session=%s topic=%s',sid,topic)
        with self.store.db() as db:
            row = db.execute('SELECT settings FROM learners WHERE id=?', (identity,)).fetchone()
            settings = json.loads(row[0] or '{}') if row else {}
        state=self.graph.invoke(
            dict(
                learner_id=identity,
                session_id=sid,
                event='next' if history else 'start',
                subtopic_id=topic,
                world_id=TOPICS[topic]['world_id'],
                current_question={}, candidate={}, valid=False, retries=0,
                guard_error='', provider_status='', generation_error='', question_source='', learning_objective='',
                mastery_score=stats['mastery'].get(topic,0),
                recent_attempts=[x for x in stats['recent'] if x['topic']==topic],
                recent_questions=history,
                selected_character=normalize_character((settings or {}).get('selected_character') or (settings or {}).get('companion') or 'byte')
            ),
            config={'recursion_limit':20,'configurable':{'thread_id':identity+':'+sid}}
        )
        question=state['current_question']
        logging.info('question_accepted session=%s question=%s question_source=%s',sid,question['question_id'],state['question_source'])
        with self.store.db() as db:
            if sid:
                previous=db.execute('SELECT question FROM sessions WHERE id=? AND learner=?',(sid,identity)).fetchone()
                if previous:
                    db.execute("UPDATE active_quests SET status='REPLACED' WHERE quest_id=? AND learner_id=?",
                               (json.loads(previous[0])['question_id'],identity))
            db.execute('INSERT INTO generated_quests(id,learner_id,world_id,subtopic_id,quest_json) VALUES(?,?,?,?,?)',
                       (question['question_id'],identity,question['world_id'],topic,json.dumps(question)))
            db.execute('INSERT INTO active_quests(id,learner_id,world_id,subtopic_id,quest_id,status) VALUES(?,?,?,?,?,?)',
                       (question['question_id'],identity,question['world_id'],topic,question['question_id'],'ACTIVE'))
            db.execute('INSERT OR REPLACE INTO sessions(id,learner,topic,question) VALUES(?,?,?,?)',(sid,identity,topic,json.dumps(question)))
            db.execute('INSERT INTO history(learner,topic,question) VALUES(?,?,?)',(identity,topic,json.dumps(question)))
        return dict(session_id=sid,question=GeneratedQuestion.model_validate(question).public(),draft='',
                    next_action=state['next_action'],provider_status=state['provider_status'])

    def submit(self,identity,sid,question_id,code,operation,run=False,inputs=None):
        return self.check_answer_service.check_answer(identity, sid, question_id, code, operation=operation, run=run, inputs=inputs)
