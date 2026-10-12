"""Real LangGraph workflow: bounded per invocation; SQLite owns durable jobs."""
import re
import unicodedata
from typing import TypedDict
from langgraph.graph import StateGraph,START,END
from edition.studio_content import CONCEPTS
from edition.video_provider import VideoProviderError,media_location

PROMPT_VERSION='pyquest-visual-v1'

def normalize_concept(value):
    if not isinstance(value,str) or len(value)>100:raise ValueError('Select a supported visual concept.')
    key=re.sub(r'[^a-z0-9]+','_',unicodedata.normalize('NFKC',value).casefold()).strip('_')
    aliases={normalize_title(title):key for key,(title,*_) in CONCEPTS.items()}
    key=aliases.get(key,key)
    if key not in CONCEPTS:raise ValueError('Select a supported visual concept.')
    return key

def normalize_title(title):return re.sub(r'[^a-z0-9]+','_',title.casefold()).strip('_')

class VisualState(TypedDict,total=False):
    concept:str
    concept_key:str
    generate:bool
    poll:bool
    retry:bool
    row:dict
    status:str
    message:str
    prompt:str
    video_location:str
    job:dict
    owner:bool

class VisualWorkflow:
    def __init__(self,cache,provider=None,version=PROMPT_VERSION):
        self.cache=cache;self.provider=provider;self.version=version
        self.provider_name=provider.name if provider else 'fal'
        from edition.video_provider import MODEL
        self.model=provider.model if provider else MODEL
        graph=StateGraph(VisualState)
        for name,node in [('Normalize',self.normalize),('CacheLookup',self.lookup),('ConditionalRoute',lambda s:{}),('LoadVideo',self.load),('Validate',self.validate),('Storyboard',self.storyboard),('SubmitJob',self.submit),('PersistPending',self.persist),('Resume/Poll',self.poll),('SaveCompleted',self.save)]:graph.add_node(name,node)
        graph.add_edge(START,'Normalize');graph.add_edge('Normalize','CacheLookup');graph.add_edge('CacheLookup','ConditionalRoute')
        graph.add_conditional_edges('ConditionalRoute',self.route,{'hit':'LoadVideo','miss':'Validate','pending':'Resume/Poll','stop':END})
        graph.add_edge('LoadVideo',END)
        graph.add_conditional_edges('Validate',lambda s:'ready' if s['status']=='ready' else 'stop',{'ready':'Storyboard','stop':END})
        graph.add_edge('Storyboard','SubmitJob')
        graph.add_conditional_edges('SubmitJob',lambda s:'submitted' if s.get('job') else 'stop',{'submitted':'PersistPending','stop':END})
        graph.add_edge('PersistPending','Resume/Poll');graph.add_edge('Resume/Poll','SaveCompleted');graph.add_edge('SaveCompleted',END)
        self.graph=graph.compile()
    def run(self,concept,*,generate=False,poll=False,retry=False):return self.graph.invoke({'concept':concept,'generate':generate,'poll':poll,'retry':retry})
    def normalize(self,s):return {'concept_key':normalize_concept(s['concept'])}
    def lookup(self,s):
        row=self.cache.get(s['concept_key'],self.version,self.provider_name,self.model)
        return {'row':row,'status':row['status'] if row else 'missing'}
    def route(self,s):
        row=s.get('row')
        if row and row['status']=='completed':return 'hit'
        if row and row['status']=='submission_error' and s.get('retry'):return 'miss'
        if row and row.get('job_id') and row['status'] in ('pending','poll_error') and s.get('poll') and self.provider:return 'pending'
        if row:return 'stop'
        return 'miss'
    def load(self,s):return {'status':'completed','video_location':media_location(s['row']['video_location']),'message':'Cached video — no generation request.'}
    def validate(self,s):
        if not self.provider:return {'status':'unavailable','message':'Video generation unavailable: no configured video provider. Explore the interactive diagram below.'}
        if not (s.get('generate') or s.get('retry')):return {'status':'missing','message':'No cached video. Generation starts only when you explicitly request it.'}
        return {'status':'ready'}
    def storyboard(self,s):
        title,definition,scenes=CONCEPTS[s['concept_key']]
        return {'prompt':'Create a clear, restrained educational motion diagram on a warm light background. No mascots, fake addresses or invented code. '+title+': '+definition+' Show these three scenes in order: '+' '.join(scenes)}
    def submit(self,s):
        owner,row=self.cache.reserve(s['concept_key'],self.version,self.provider_name,self.model,retry=s.get('retry',False))
        if not owner:return {'row':row,'status':row['status'],'message':'An existing job owns this concept/version. No duplicate submission.'}
        try:job=self.provider.submit(s['prompt'])
        except VideoProviderError as exc:
            row=self.cache.update(row,status='submission_unknown' if exc.uncertain else 'submission_error',error_state=str(exc))
            return {'row':row,'status':row['status'],'message':str(exc)}
        except Exception:
            row=self.cache.update(row,status='submission_unknown',error_state='Submission outcome unknown. Reconcile with the provider before retrying.')
            return {'row':row,'status':row['status']}
        return {'row':row,'job':job,'status':'submitted'}
    def persist(self,s):
        job=s['job'];row=self.cache.update(s['row'],status='pending',job_id=job['job_id'],provider_data=job,error_state=None)
        return {'row':row,'status':'pending'}
    def poll(self,s):
        if not self.provider:return {'status':'pending','message':'Provider is unavailable; the saved job can be resumed later.'}
        try:
            result=self.provider.poll(s['row'])
            if result.get('status')=='completed':media_location(result.get('video_location'))
            if result.get('status') in ('pending','completed'):result['error_state']=None
        except Exception:
            result={'status':'poll_error','error_state':'Status retrieval failed. Resume this saved job; do not submit a second job.'}
        row=self.cache.update(s['row'],**result)
        return {'row':row,'status':row['status']}
    def save(self,s):
        row=s['row']
        if row['status']=='completed':return {'video_location':media_location(row['video_location']),'message':'Provider job completed and its video location was cached.'}
        return {'message':row.get('error_state') or 'Video job is saved. Use Check saved job to resume polling.'}
