import unittest
from app.mastery import MasteryPolicy,next_topic
from app.catalog import TOPICS,WORLDS


class MasteryTests(unittest.TestCase):
    def evidence(self,n,**changes):
        return [dict(correct=True,hints_used=0,solution_used=False,difficulty='normal')|changes for _ in range(n)]

    def test_single_correct_never_means_mastered(self):
        self.assertFalse(MasteryPolicy().evaluate(1,self.evidence(1))['topic_mastered'])

    def test_hints_and_solutions_are_not_independent(self):
        for changes in [dict(hints_used=1),dict(solution_used=True)]:
            self.assertFalse(MasteryPolicy().evaluate(1,self.evidence(10,**changes))['topic_mastered'])

    def test_transfer_and_recent_evidence_required(self):
        policy=MasteryPolicy()
        self.assertFalse(policy.evaluate(.9,self.evidence(6,difficulty='easy'))['topic_mastered'])
        self.assertTrue(policy.evaluate(.9,self.evidence(6))['topic_mastered'])
        self.assertFalse(policy.evaluate(.9,[dict(correct=False)]+self.evidence(6))['topic_mastered'])

    def test_configurable_policy_and_canonical_next(self):
        self.assertTrue(MasteryPolicy(threshold=.7,minimum_independent=4).evaluate(.75,self.evidence(4))['topic_mastered'])
        self.assertEqual(next_topic('W01_INPUT'),'W01_FSTRINGS')
        sequence=[t for w in WORLDS for t in w['topics']]
        self.assertIsNone(next_topic(sequence[-1]['id']))
        self.assertEqual(len(WORLDS),14)
        self.assertTrue(all(t['objective'] and t['allowed_concepts'] for t in TOPICS.values()))
