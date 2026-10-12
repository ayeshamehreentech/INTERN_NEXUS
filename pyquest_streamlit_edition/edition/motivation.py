from app.concepts import LESSONS

def difficulty_support(recent,topic):
    failures=0
    for attempt in recent:
        if attempt.get('topic')!=topic:continue
        if attempt.get('correct'):break
        failures+=1
    if failures<2:return None
    lesson=LESSONS.get(topic,{})
    mistake=(lesson.get('common_mistakes') or ['Compare the example input and output.'])[0]
    return f'{failures} recent tries on this topic have not passed yet. Try one small step: {mistake} Trace the example by hand, run your code, then check again. Review Concept is always available.'
