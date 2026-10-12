"""Original PyQuest presentation, mounted in Streamlit with Python authority."""
import json
import base64
import re
import shutil
from functools import lru_cache
from pathlib import Path
import streamlit as st
from edition.runtime import ROOT, call
from app.question_generation_service import QuestionGenerationUnavailable


@lru_cache(maxsize=1)
def prepare_assets():
    source=ROOT/'assets';target=ROOT/'static/assets'
    for path in source.rglob('*'):
        if path.is_file() and path.suffix in {'.jpeg','.jpg','.png','.svg','.webp','.json'}:
            destination=target/path.relative_to(source)
            destination.parent.mkdir(parents=True,exist_ok=True)
            if path.name=='manifest.json':
                destination.write_text(path.read_text().replace('/assets/','/app/static/assets/'))
            elif not destination.exists() or destination.stat().st_mtime<path.stat().st_mtime:
                shutil.copy2(path,destination)


def asset_urls(value):
    if isinstance(value,dict):return {k:asset_urls(v) for k,v in value.items()}
    if isinstance(value,list):return [asset_urls(v) for v in value]
    if isinstance(value,str) and value.startswith('/assets/'):return '/app/static'+value
    return value


def route_request(path,payload=None):
    if not isinstance(path,str) or len(path)>160:raise ValueError('Invalid operation.')
    if path in {'celebration-claim','celebration-ack'}:
        event_id=(payload or {}).get('event_id')
        if not isinstance(event_id,str) or not event_id or len(event_id)>160:raise ValueError('Invalid celebration event.')
        events=st.session_state.setdefault('_celebration_events',{})
        if path=='celebration-claim':
            show=event_id not in events
            events.setdefault(event_id,'presented')
            return {'show':show}
        if event_id in events:events[event_id]='acknowledged'
        return {'acknowledged':True}
    if path=='toolkit-video':
        folder=ROOT/'assets/learning'
        return {'video':'data:video/mp4;base64,'+base64.b64encode((folder/'python-toolkit.mp4').read_bytes()).decode(),
                'captions':'data:text/vtt;base64,'+base64.b64encode((folder/'python-toolkit.vtt').read_bytes()).decode()}
    if path.startswith('concept/'):
        action='concept';payload={'topic':path.split('/',1)[1]}
    elif path.startswith('session/'):
        action='session';payload={'session_id':path.split('/',1)[1]}
    else:action={'concept-complete':'complete','concept-start':'start'}.get(path,path)
    if action=='settings' and isinstance(payload,dict):
        payload=dict(payload);settings=dict(payload.get('settings',{}))
        background=settings.get('background')
        if isinstance(background,str) and background.startswith('/app/static/assets/'):
            settings['background']=background.removeprefix('/app/static')
        payload['settings']=settings
    return asset_urls(call(action,payload))


def receive_request():
    ss=st.session_state
    request=(ss.get('pyquest_original_ui') or {}).get('request')
    if not isinstance(request,dict):return
    rid=request.get('id')
    if not isinstance(rid,str) or len(rid)>80:return
    responses=ss.setdefault('_original_ui_responses',{})
    if rid in responses:return
    try:
        value=route_request(request.get('path'),request.get('payload'))
        responses[rid]={'ok':True,'value':value}
    except Exception as exc:
        if isinstance(exc,QuestionGenerationUnavailable):
            responses[rid]={'ok':False,'error':str(exc),'code':exc.code,'reason':exc.reason}
        elif isinstance(exc,(ValueError,KeyError,TypeError)):
            responses[rid]={'ok':False,'error':str(exc)[:400]}
        else:
            responses[rid]={'ok':False,'error':'The learning service could not complete this request. Your draft remains saved.'}
    while len(responses)>64:responses.pop(next(iter(responses)))


_HTML='''<div class="pyquest-root"><header><a class="brand" href="#home">Py<span>Quest</span><small>Python Learning Adventure</small></a><nav id="top"></nav><div id="wallet"></div></header><main id="app"></main><div id="notice" role="status"></div></div>'''
_CSS='\n'.join((ROOT/'web'/name).read_text(encoding='utf-8') for name in ('theme.css','characters.css','concepts.css','resources.css'))
_CSS=re.sub(r'@import[^;]+;','',_CSS).replace('/assets/','/app/static/assets/').replace(':root',':host')
_CSS=re.sub(r'\bbody\b','.pyquest-root',_CSS)
_CSS+='\n:host{display:block;width:100%;}.pyquest-root{min-height:100vh;}#notice:empty{display:none;}'
_CSS+='\n.studio-page .pose-grid{gap:8px;}.studio-page .pose-grid svg.expression-portrait{height:72px;padding:4px;background:#f0e3d2;border-radius:12px;}.studio-page .pose-grid button{min-width:0;color:#583922;}.studio-page .pose-grid span{font-size:11px;margin-top:7px;}'
_CSS+='\n'+(ROOT/'assets/ui-theme.css').read_text(encoding='utf-8')
_CSS+='\n'+(ROOT/'assets/success-celebration.css').read_text(encoding='utf-8')
_BUNDLE=(ROOT/'edition/ui/app.bundle.js').read_text(encoding='utf-8')
_JS='''export default function(component) {
 const {parentElement,data,setTriggerValue}=component;
 const root=parentElement.querySelector('.pyquest-root');
 let state=root._pyquest;
 if(!state){state=root._pyquest={pending:new Map(),emit:setTriggerValue,listeners:[]};}
 state.emit=setTriggerValue;
 for(const [id,response] of Object.entries(data?.responses||{})){
  const pending=state.pending.get(id);if(!pending)continue;
  state.pending.delete(id);
  if(response.ok)pending.resolve(response.value);
  else{const error=Error(response.error);error.code=response.code;pending.reject(error);}
 }
 if(state.started)return;
 state.started=true;
 state.observer=new MutationObserver(()=>{
  if(root.isConnected)return;
  state.dispose?.();
  state.disposed=true;
  for(const [event,fn] of state.listeners)globalThis.window.removeEventListener(event,fn);
  for(const pending of state.pending.values())pending.reject(Error('The previous view was closed.'));
  state.pending.clear();state.observer.disconnect();
 });
 state.observer.observe(globalThis.document.body,{childList:true,subtree:true});
 const uiRequest=(path,payload)=>new Promise((resolve,reject)=>{
  const id=crypto.randomUUID();state.pending.set(id,{resolve,reject});
  state.emit('request',{id,path,payload:payload||null});
 });
 const nativeDocument=globalThis.document;
 const document=new Proxy(nativeDocument,{get(target,key){
  if(key==='body'||key==='documentElement')return root;
  if(key==='querySelector')return parentElement.querySelector.bind(parentElement);
  if(key==='querySelectorAll')return parentElement.querySelectorAll.bind(parentElement);
  if(key==='addEventListener'||key==='removeEventListener')return root[key].bind(root);
  const value=target[key];return typeof value==='function'?value.bind(target):value;
 }});
 const window=new Proxy(globalThis.window,{get(target,key){
  if(key==='addEventListener')return (event,fn,...args)=>{state.listeners.push([event,fn]);target.addEventListener(event,fn,...args);};
  const value=target[key];return typeof value==='function'?value.bind(target):value;
 }});
 (async()=>{
''' +_BUNDLE+'''
 })().catch(error=>{root.querySelector('#notice').textContent=error.message;});
}'''


def render():
    component=st.components.v2.component('pyquest_original_frontend',html=_HTML,css=_CSS,js=_JS)
    prepare_assets()
    st.html('<style>[data-testid="stHeader"]{display:none;}[data-testid="stMainBlockContainer"]{padding:0;max-width:none;}[data-testid="stAppViewContainer"]{background:#f3ebdf;}</style>')
    component(key='pyquest_original_ui',data={'responses':st.session_state.get('_original_ui_responses',{})},on_request_change=receive_request)

