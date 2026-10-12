"""Choose pedagogy before invoking the shared generator; never grade with an LLM."""
class QuestionStylePlanner:
    def plan(self,context):
        topic=context['topic'];name=topic['name'].lower()
        if any(word in name for word in ('identifier','keyword','naming','case sensitivity','precedence','complexity','compar')):return 'TECHNICAL'
        if 'trac' in name:return 'TRACE'
        if context.get('recent_attempts') and not any(a['correct'] for a in context['recent_attempts'][:2]):return 'DEBUGGING'
        if topic['world_id'] in ('W09','W10','W12','W13'):return 'IMPLEMENTATION'
        if topic['world_id']=='W14':return 'PROBLEM_SOLVING'
        return 'SCENARIO_BASED'
