"""Configuration and per-browser UI state. Durable state belongs to the service."""
import hashlib
import os
import secrets
from pathlib import Path
import streamlit as st
from streamlit.errors import StreamlitSecretNotFoundError
from dotenv import load_dotenv
from edition.client import RemoteClient, subject_identity
from edition.service import LearningService

ROOT=Path(__file__).resolve().parents[1]


def setting(name,default=''):
    if name in os.environ:return os.environ[name] or default
    try:return str(st.secrets.get(name,default)) or default
    except (FileNotFoundError,StreamlitSecretNotFoundError):return default


@st.cache_resource(max_entries=4)
def local_service(directory,verification=False,implementation_epoch=0,provider_revision=''):
    provider=None
    if verification:
        from tests.test_learning import Model
        provider=Model()
    return LearningService(directory,provider).initialize()


@st.cache_resource(max_entries=4)
def remote_service(url,secret,implementation_epoch=0):
    return RemoteClient(url,secret)


def initialize():
    load_dotenv(ROOT/'.env')
    for name in ('GROQ_API_KEY','GROQ_MODEL'):
        value=setting(name)
        if value:os.environ[name]=value
    ss=st.session_state
    for key,value in dict(selected_world='W01',selected_topic='W01_PRINT',current_session=None,
                          drafts={},feedback={},outputs={},hints={},pending_operations={},error='',review_session=None).items():
        ss.setdefault(key,value)
    ss.setdefault('_demo_nonce',secrets.token_hex(32))
    # Public/default bindings are preview-only unless explicitly configured.
    local_binding=st.get_option('server.address') in ('127.0.0.1','localhost','::1')
    deployment=setting('PYQUEST_DEPLOYMENT','local' if local_binding else 'cloud')
    mode=setting('PYQUEST_BACKEND_MODE','preview' if deployment=='cloud' else 'local')
    if deployment not in ('local','cloud') or mode not in ('local','remote','preview'):raise ValueError('Invalid deployment configuration.')
    # Refuse local execution/storage in an explicitly configured cloud deployment.
    if deployment=='cloud' and mode=='local':mode='preview'
    verification=setting('PYQUEST_VERIFICATION_MODE')=='1'
    if deployment=='cloud' and verification:raise ValueError('Mock verification mode is local only.')
    ss['_mode']=mode
    ss['_verification']=verification
    if mode=='remote':
        client=remote_service(setting('PYQUEST_BACKEND_URL'),setting('PYQUEST_BACKEND_SECRET'),id(RemoteClient))
    elif mode=='local':
        # Streamlit can reload modules while keeping cached instances. An old
        # engine can retain a worker function that multiprocessing cannot pickle
        # against the reloaded module. Rebuild on implementation/config changes.
        revision=hashlib.sha256((setting('GROQ_API_KEY')+'\0'+setting('GROQ_MODEL')).encode()).hexdigest()
        client=local_service(setting('PYQUEST_DATA_DIR',str(ROOT/'data')),verification,id(LearningService),revision)
    else:client=None
    require_auth=setting('PYQUEST_REQUIRE_AUTH','false').lower()=='true'
    if require_auth and not st.user.get('is_logged_in',False):
        st.title('Sign in to PyQuest')
        st.caption('Your learning history is attached to your verified identity.')
        if st.button('Sign in',icon=':material/login:'):st.login()
        st.stop()
    if st.user.get('is_logged_in',False):
        ss['_identity']=subject_identity(st.user.get('iss'),st.user.get('sub'),setting('PYQUEST_IDENTITY_SECRET'))
        ss['_authenticated']=True
    else:
        ss['_identity']=hashlib.sha256(ss['_demo_nonce'].encode()).hexdigest()
        ss['_authenticated']=False
    ss['_client']=client
    ss['_stats']=None
    if client:
        try:
            ss['_stats']=client.call(ss['_identity'],'progress')
            if not ss.current_session:
                ss.current_session=ss['_stats']['settings'].get('last_session')
        except Exception:
            ss.error='The learning service is unavailable. Lessons remain readable and your editor draft stays in this session.'


def call(action,payload=None):
    ss=st.session_state
    if ss.get('_client') is None:raise ValueError('Cloud preview: configure the authenticated external learning backend for persistence, generation, and grading.')
    return ss['_client'].call(ss['_identity'],action,payload)


def report_error(exc):
    # Validation/provider messages are bounded; no provider payloads or secrets.
    from edition.client import BackendUnavailable
    from app.question_generation_service import QuestionGenerationUnavailable
    from edition.service import ExecutionUnavailable
    if isinstance(exc,(ValueError,BackendUnavailable,QuestionGenerationUnavailable,ExecutionUnavailable)):
        st.session_state.error=str(exc)[:400]
    else:st.session_state.error='The request failed. Your code remains saved in this session; retry later.'


def open_topic(topic):
    from app.catalog import TOPICS
    if topic not in TOPICS:raise ValueError('Unknown topic.')
    st.session_state.selected_topic=topic
    st.session_state.selected_world=TOPICS[topic]['world_id']
    st.session_state.review_session=None
    st.session_state.error=''
    st.switch_page('app_pages/learn.py')


def accept_session(value):
    ss=st.session_state
    q=value['question'];sid=value['session_id'];key=sid+':'+q['question_id']
    ss.current_session=sid
    ss.selected_topic=q['subtopic_id'];ss.selected_world=q['world_id']
    # Session State is a draft buffer; the DB provides reconnection recovery.
    if key not in ss.drafts:ss.drafts[key]=value['draft'] if value.get('draft_saved') or value.get('draft') else q['starter_code']
    return key


def save_draft(sid,qid,code):
    st.session_state.drafts[sid+':'+qid]=code
    return call('draft',dict(session_id=sid,question_id=qid,code=code))


def action_operation(action,sid,qid,code,inputs):
    import json
    fingerprint=hashlib.sha256(json.dumps([action,sid,qid,code,inputs]).encode()).hexdigest()
    ops=st.session_state.pending_operations
    if fingerprint not in ops:ops[fingerprint]=secrets.token_hex(16)
    return fingerprint,ops[fingerprint]
