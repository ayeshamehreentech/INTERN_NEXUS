"""Feedback explains deterministic evidence; it cannot change the verdict."""


def feedback_agent(correct, evidence):
    if correct:
        return 'Correct! All checked outputs and required concepts match.'
    return evidence.get('message', 'Output or required concept does not match. Check the example and requirements.')
