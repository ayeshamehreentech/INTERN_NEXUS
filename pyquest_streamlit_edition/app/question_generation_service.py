"""The single generation entry point shared by all fourteen specialists."""
import logging
import time
import httpx
from groq import APIConnectionError
from app.question_style import QuestionStylePlanner


class QuestionGenerationUnavailable(ValueError):
    code = 'QUESTION_GENERATION_UNAVAILABLE'

    def __init__(self, reason):
        self.reason = reason
        if reason=='rate_limited':
            super().__init__('Groq temporarily limited question requests. Try again after the provider quota resets. Your current challenge and code are preserved.')
            return
        if reason=='provider_authentication':
            super().__init__('Groq rejected the configured credentials. Check the local provider configuration. Your current challenge and code are preserved.')
            return
        super().__init__('A new challenge could not be prepared. Try again. No static question was substituted.')


class QuestionGenerationService:
    def __init__(self, sleep=time.sleep):
        self.sleep=sleep

    def request(self, provider, context):
        """At most three transport attempts; never retry permanent/schema errors."""
        for attempt in range(3):
            try:
                return provider.generate_question(context)
            except Exception as exc:
                status=getattr(exc,'status_code',None)
                transient=isinstance(exc,(TimeoutError,ConnectionError,httpx.TransportError,APIConnectionError)) or status in (429,500,502,503,504)
                if not transient or attempt==2:
                    raise
                delay=0.5*(2**attempt)
                response=getattr(exc,'response',None)
                retry_after=getattr(response,'headers',{}).get('retry-after') if response is not None else None
                if retry_after is not None:
                    try:delay=max(delay,float(retry_after))
                    except (TypeError,ValueError):raise  # Do not retry earlier than an unknown server deadline.
                    if not 0<=delay<=5:raise
                logging.info('question_transport_retry attempt=%s category=%s',attempt+2,type(exc).__name__)
                self.sleep(delay)

    def generate(self, provider, context):
        topic = context['topic']
        logging.info('question_generation_started selected_world=%s selected_subtopic=%s',
                     topic['world_id'], topic['id'])
        # No private reference solutions belong in this context.
        style=QuestionStylePlanner().plan(context)
        result=self.request(provider,context|{'question_style':style,
            'style_instruction':'Use a story only when it clarifies the objective. Technical and tracing tasks must still be answerable with executable Python.'})
        if not isinstance(result,dict):raise ValueError('Expected a structured question object')
        result=dict(result)
        result['question_style']=style
        return result
