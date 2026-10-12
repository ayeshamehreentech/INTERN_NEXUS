import contextlib
import io
import tempfile
import threading
import unittest
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from unittest.mock import patch
import httpx
from edition.video_cache import VideoCache
from edition.video_provider import FalVideoProvider,VideoProviderError,MODEL
from edition.video_workflow import VisualWorkflow,normalize_concept
from edition.studio_content import TIPS,CONCEPTS,search_tips
from edition.studio_diagrams import binary_trace,bubble_trace,insertion_trace
from edition.motivation import difficulty_support

class FakeProvider:
    name='fal';model=MODEL
    def __init__(self):self.submits=0;self.polls=0;self.complete=False;self.reject=None;self.poll_fail=False;self.lock=threading.Lock()
    def submit(self,prompt):
        with self.lock:self.submits+=1
        if self.reject:raise self.reject
        return {'job_id':'job-one','status_url':'https://queue.fal.run/fal-ai/kling-video/requests/job-one/status','response_url':'https://queue.fal.run/fal-ai/kling-video/requests/job-one/response'}
    def poll(self,row):
        self.polls+=1
        if self.poll_fail:raise RuntimeError('private provider payload')
        return {'status':'completed','video_location':'https://v3.fal.media/test.mp4'} if self.complete else {'status':'pending'}

class VisualWorkflowTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.cache=VideoCache(Path(self.temp.name)/'video_cache.db');self.provider=FakeProvider();self.workflow=VisualWorkflow(self.cache,self.provider)
    def tearDown(self):self.temp.cleanup()
    def test_page_read_does_not_submit_and_unconfigured_provider_is_truthful(self):
        self.assertEqual(self.workflow.run('Binary integer representation')['status'],'missing')
        self.assertEqual(self.provider.submits,0)
        self.assertEqual(VisualWorkflow(self.cache).run('binary_integer',generate=True)['status'],'unavailable')
        self.assertIsNone(self.cache.get('binary_integer',self.workflow.version,'fal',MODEL))
    def test_cache_hit_makes_zero_provider_calls_even_without_credentials(self):
        self.provider.complete=True
        completed=self.workflow.run('binary_integer',generate=True)
        self.assertEqual(completed['status'],'completed')
        before=(self.provider.submits,self.provider.polls)
        self.assertEqual(self.workflow.run(' BINARY INTEGER REPRESENTATION ',generate=True,poll=True)['video_location'],'https://v3.fal.media/test.mp4')
        self.assertEqual((self.provider.submits,self.provider.polls),before)
        self.assertEqual(VisualWorkflow(self.cache).run('binary_integer')['status'],'completed')
    def test_duplicate_concurrent_requests_submit_one_job(self):
        with ThreadPoolExecutor(max_workers=8) as pool:list(pool.map(lambda _:self.workflow.run('recursion',generate=True),range(16)))
        self.assertEqual(self.provider.submits,1)
    def test_pending_jobs_survive_restart_and_resume_without_resubmission(self):
        row=self.workflow.run('binary_search',generate=True)['row']
        self.assertEqual(row['status'],'pending');self.assertEqual(row['job_id'],'job-one')
        resumed_provider=FakeProvider();resumed_provider.complete=True
        restarted=VisualWorkflow(VideoCache(self.cache.path),resumed_provider)
        self.assertEqual(restarted.run('binary_search',poll=True)['status'],'completed');self.assertEqual(self.provider.submits,1)
        self.assertEqual(resumed_provider.submits,0);self.assertEqual(resumed_provider.polls,1)
    def test_poll_failure_is_recoverable_and_does_not_leak_payload(self):
        self.provider.poll_fail=True
        result=self.workflow.run('oop_concepts',generate=True)
        self.assertEqual(result['status'],'poll_error');self.assertNotIn('private',str(result))
        self.provider.poll_fail=False;self.provider.complete=True
        recovered=self.workflow.run('oop_concepts',poll=True)
        self.assertEqual(recovered['status'],'completed');self.assertIsNone(recovered['row']['error_state']);self.assertEqual(self.provider.submits,1)
    def test_uncertain_submission_and_restart_never_submit_twice(self):
        self.provider.reject=VideoProviderError('Uncertain',uncertain=True)
        self.assertEqual(self.workflow.run('memory_references',generate=True)['status'],'submission_unknown')
        self.provider.reject=None
        restarted=VisualWorkflow(VideoCache(self.cache.path),self.provider)
        self.assertEqual(restarted.run('memory_references',generate=True,retry=True)['status'],'submission_unknown');self.assertEqual(self.provider.submits,1)
    def test_crashed_submission_reservation_remains_owned(self):
        self.cache.reserve('stack_queue',self.workflow.version,'fal',MODEL)
        self.assertEqual(self.workflow.run('stack_queue',generate=True)['status'],'submitting');self.assertEqual(self.provider.submits,0)
    def test_definitively_rejected_request_requires_explicit_retry(self):
        self.provider.reject=VideoProviderError('HTTP 401')
        self.assertEqual(self.workflow.run('bitwise_operators',generate=True)['status'],'submission_error')
        self.provider.reject=None
        self.workflow.run('bitwise_operators',generate=True);self.assertEqual(self.provider.submits,1)
        self.assertEqual(self.workflow.run('bitwise_operators',retry=True)['status'],'pending');self.assertEqual(self.provider.submits,2)
    def test_normalization_validation_and_version_are_part_of_cache_identity(self):
        self.assertEqual(normalize_concept('  Binary Search  '),'binary_search')
        with self.assertRaises(ValueError):self.workflow.run('../.env',generate=True)
        self.assertEqual(self.provider.submits,0)
        self.workflow.run('binary_search',generate=True)
        VisualWorkflow(self.cache,self.provider,version='new-version').run('binary_search',generate=True)
        self.assertEqual(self.provider.submits,2)
    def test_graph_has_real_named_nodes(self):
        nodes=self.workflow.graph.get_graph().nodes
        for node in ['Normalize','CacheLookup','ConditionalRoute','Validate','Storyboard','SubmitJob','PersistPending','Resume/Poll','SaveCompleted','LoadVideo']:self.assertIn(node,nodes)

class ProviderAdapterTests(unittest.TestCase):
    def test_documented_queue_contract_and_completed_result(self):
        calls=[]
        def handle(request):
            calls.append(request)
            if request.method=='POST':return httpx.Response(200,json={'request_id':'abc','status_url':'https://queue.fal.run/fal-ai/kling-video/requests/abc/status','response_url':'https://queue.fal.run/fal-ai/kling-video/requests/abc/response'})
            return httpx.Response(200,json={'status':'COMPLETED'} if request.url.path.endswith('/status') else {'video':{'url':'https://v3.fal.media/valid.mp4'}})
        with httpx.Client(transport=httpx.MockTransport(handle)) as client:
            provider=FalVideoProvider('private-key',client);job=provider.submit('Reviewed educational storyboard')
            import json
            result=provider.poll({'job_id':job['job_id'],'provider_data':json.dumps(job)})
            self.assertEqual(result['status'],'completed');self.assertEqual(len(calls),3)
            self.assertEqual(str(calls[0].url),'https://queue.fal.run/'+MODEL)
            self.assertIn('Key private-key',calls[0].headers['Authorization'])
    def test_invalid_job_urls_and_provider_errors_are_bounded(self):
        with httpx.Client(transport=httpx.MockTransport(lambda r:httpx.Response(401,json={'secret':'do not show'}))) as client:
            with self.assertRaises(VideoProviderError) as error:FalVideoProvider('private-key',client).submit('prompt')
            self.assertNotIn('secret',str(error.exception));self.assertFalse(error.exception.uncertain)
        provider=object.__new__(FalVideoProvider)
        with self.assertRaises(VideoProviderError):provider._queue_url('http://127.0.0.1/private','job')

class CuratedLearningTests(unittest.TestCase):
    def test_curated_examples_match_outputs_and_search_is_deterministic(self):
        for tip in TIPS:
            if tip.get('code') and 'output' in tip:
                output=io.StringIO()
                with contextlib.redirect_stdout(output):exec(tip['code'],{})
                self.assertEqual(output.getvalue().rstrip('\n'),tip['output'],tip['title'])
        self.assertEqual(len(search_tips('enumerate')),1)
        self.assertFalse(search_tips('missing-word-XYZ'));self.assertEqual(len(CONCEPTS),8)
    def test_diagrams_trace_sorted_duplicates_missing_targets_and_empty_search(self):
        self.assertEqual(bubble_trace([3,1,1])[-1]['values'],[1,1,3])
        self.assertEqual(insertion_trace([3,1,1])[-1]['values'],[1,1,3])
        self.assertEqual(binary_trace([1,3,5],3)[1],1)
        self.assertIsNone(binary_trace([1,3,5],4)[1]);self.assertEqual(binary_trace([],4),([],None))
    def test_motivation_uses_recorded_failures_and_stops_at_success(self):
        recent=[{'topic':'W01_INPUT','correct':False}]*2
        self.assertIn('2 recent tries',difficulty_support(recent,'W01_INPUT'))
        self.assertIsNone(difficulty_support([{'topic':'W01_INPUT','correct':True}]+recent,'W01_INPUT'))
        self.assertIsNone(difficulty_support(recent,'W02_INT'))
