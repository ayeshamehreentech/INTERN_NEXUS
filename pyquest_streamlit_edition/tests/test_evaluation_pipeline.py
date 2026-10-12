import unittest

from app.scoring import EvaluationAgent


class EvaluationPipelineTests(unittest.TestCase):
    def test_equivalent_solutions_pass_same_behavioral_challenge(self):
        challenge = "number = int(input())\nprint(number * 2)"
        cases = [
            {'stdin': '5\n', 'expected_stdout': '10'},
            {'stdin': '0\n', 'expected_stdout': '0'},
            {'stdin': '-4\n', 'expected_stdout': '-8'},
            {'stdin': '13\n', 'expected_stdout': '26'},
        ]
        equivalent = [
            "x = int(input())\nanswer = x + x\nprint(answer)",
            "value = int(input())\nprint(2 * value)",
        ]
        for candidate in [challenge, *equivalent]:
            result = EvaluationAgent.evaluate(candidate, cases)
            self.assertTrue(result['correct'])
            self.assertEqual(result['tests_passed'], 4)
            self.assertEqual(result['tests_total'], 4)

    def test_hardcoded_output_fails_hidden_tests(self):
        result = EvaluationAgent.evaluate('print(10)', [
            {'stdin': '5\n', 'expected_stdout': '10'},
            {'stdin': '0\n', 'expected_stdout': '0'},
            {'stdin': '-4\n', 'expected_stdout': '-8'},
        ])
        self.assertFalse(result['correct'])
        self.assertEqual(result['tests_passed'], 1)

    def test_syntax_runtime_and_timeout_are_flagged(self):
        syntax = EvaluationAgent.evaluate('print(', [{'stdin': '1\n', 'expected_stdout': '1'}])
        self.assertTrue(syntax['syntax_error'])

        runtime = EvaluationAgent.evaluate('value = []\nprint(value[3])', [{'stdin': '', 'expected_stdout': ''}])
        self.assertIn('STRING_INDEX_ERROR', runtime['detected_misconceptions'])

        timeout = EvaluationAgent.evaluate('while True:\n    pass', [{'stdin': '', 'expected_stdout': ''}])
        self.assertTrue(timeout['timeout'])

    def test_ast_requirements_are_enforced_only_when_requested(self):
        allowed = EvaluationAgent.evaluate('x = int(input())\nprint(x * 2)', [
            {'stdin': '5\n', 'expected_stdout': '10'}
        ], requirement={'must_use_input': True})
        self.assertTrue(allowed['structural_requirements_passed'])

        denied = EvaluationAgent.evaluate('x = 5\nprint(x * 2)', [
            {'stdin': '5\n', 'expected_stdout': '10'}
        ], requirement={'must_use_input': True})
        self.assertFalse(denied['structural_requirements_passed'])

        loop_only = EvaluationAgent.evaluate('x = 0\nwhile x < 2:\n    x += 1\nprint(x)', [
            {'stdin': '', 'expected_stdout': '2'}
        ], requirement={'must_use_for': True})
        self.assertFalse(loop_only['structural_requirements_passed'])
