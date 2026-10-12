"""Deterministic adaptation from persisted learner evidence."""
import logging


def adaptive_agent(state):
    attempts = state.get('recent_attempts', [])
    mastery = state['mastery_score']
    if len(attempts) >= 2 and not any(a['correct'] for a in attempts[:2]):
        action, difficulty = 'remediation', 'easy'
    elif attempts and not attempts[0]['correct']:
        action, difficulty = 'easier', 'easy'
    elif mastery >= .75:
        action, difficulty = 'challenge', 'hard'
    elif mastery >= .4:
        action, difficulty = 'harder', 'normal'
    else:
        action, difficulty = 'same', 'easy'
    logging.info('adaptive_route action=%s world=%s subtopic=%s',
                 action, state['world_id'], state['subtopic_id'])
    return {'next_action': action, 'difficulty': difficulty}
