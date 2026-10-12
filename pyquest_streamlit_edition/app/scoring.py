"""Deterministic assessment, separate from one-time progression rewards."""
import ast
import re
from dataclasses import dataclass
from enum import StrEnum

from app.execution import execute
from app.validation import concepts_in


class ResultTier(StrEnum):
    TRY_AGAIN='TRY_AGAIN'
    GOOD_TRY='GOOD_TRY'
    GREAT='GREAT'
    EXCELLENT='EXCELLENT'


class EvaluationResult(dict):
    """Structured grading result that stays dict-compatible for the UI."""
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.__dict__ = self

    def model_dump(self):
        return dict(self)


@dataclass(frozen=True)
class ScorePolicy:
    good_try: int = 40
    great: int = 70
    excellent: int = 90
    retry_penalty: int = 10
    hint_penalty: int = 5
    maximum_support_penalty: int = 30
    revealed_cap: int = 39


class ScoreCalculator:
    def __init__(self,policy=None): self.policy=policy or ScorePolicy()
    def tier(self,score):
        p=self.policy
        return ResultTier.EXCELLENT if score>=p.excellent else ResultTier.GREAT if score>=p.great else ResultTier.GOOD_TRY if score>=p.good_try else ResultTier.TRY_AGAIN
    def calculate(self,*,correct,passed=None,total=None,tests_passed=None,tests_total=None,attempt,hints,revealed,compliant):
        p=self.policy
        if passed is None:
            passed = tests_passed or 0
        if total is None:
            total = tests_total or 0
        raw=round(100*passed/total) if total else 0
        if not compliant:raw=min(raw,p.good_try-1)
        if not correct:raw=min(raw,p.great-1)
        score=max(0,raw-min(p.maximum_support_penalty,max(0,attempt-1)*p.retry_penalty+hints*p.hint_penalty))
        if revealed:score=min(score,p.revealed_cap)
        return dict(raw_score=raw,score=score,result_tier=self.tier(score).value)


MESSAGES={
 'TRY_AGAIN':"Review the feedback and give it another try. You can do it!",
 'GOOD_TRY':"You're making progress. A little more practice will help.",
 'GREAT':'You handled this challenge well. Keep going!',
 'EXCELLENT':'Fantastic work! You demonstrated a strong understanding of this challenge.'}


class MisconceptionDetector:
    """Deterministic, low-noise error tagging for learner feedback."""

    @staticmethod
    def detect(code, execution=None, input_values=None):
        code = code or ''
        issues = []
        try:
            tree = ast.parse(code)
        except SyntaxError:
            tree = None
        if tree is not None:
            if 'input(' in code and not re.search(r'\s*=\s*input\s*\(', code):
                issues.append('INPUT_RETURN_VALUE_NOT_STORED')
            if '==' in code and '=' in code and not re.search(r'==\s*', code):
                issues.append('ASSIGNMENT_VS_COMPARISON')
            if any(isinstance(node, ast.FunctionDef) for node in ast.walk(tree)) and not any(isinstance(node, ast.Return) for node in ast.walk(tree)):
                issues.append('MISSING_RETURN')
            if any(isinstance(node, ast.While) for node in ast.walk(tree)) and re.search(r'while\s*.*(<=|>=)', code):
                issues.append('WRONG_LOOP_CONDITION')
            if '[]' in code and 'len(' in code and re.search(r'\[[^\]]*\]', code):
                issues.append('STRING_INDEX_ERROR')
        if execution and execution.get('status') == 'timeout':
            issues.append('TIMEOUT')
        if execution and execution.get('status') == 'learner_error':
            msg = str(execution.get('message') or '').lower()
            if 'index' in msg:
                issues.append('STRING_INDEX_ERROR')
        return sorted(set(issues))


class EvaluationAgent:
    """Coordinate syntax checks, bounded execution and AST contract checks."""

    @staticmethod
    def _normalize_fixture(fixture):
        if isinstance(fixture, dict):
            if 'stdin' in fixture:
                raw = fixture.get('stdin', '')
                inputs = [line for line in str(raw).splitlines() if line != '']
                expected = fixture.get('expected_stdout', fixture.get('expected'))
                return {'inputs': inputs, 'expected': expected}
            inputs = fixture.get('inputs', fixture.get('input'))
            if isinstance(inputs, (str, int, float, bool)):
                inputs = [str(inputs)]
            expected = fixture.get('expected', fixture.get('expected_stdout'))
            return {'inputs': list(inputs or []), 'expected': expected}
        if isinstance(fixture, (list, tuple)):
            return {'inputs': list(fixture), 'expected': None}
        return {'inputs': [], 'expected': None}

    @staticmethod
    def _normalize_required(requirement):
        if requirement in (None, {}, []):
            return {}
        mapping = {}
        if isinstance(requirement, dict):
            mapping = requirement
        elif isinstance(requirement, (list, tuple, set)):
            for item in requirement:
                if isinstance(item, str):
                    mapping[item] = True
        elif isinstance(requirement, str):
            mapping[requirement] = True
        return mapping

    @staticmethod
    def _check_ast_requirements(code, requirement):
        if not requirement:
            return True
        mapping = EvaluationAgent._normalize_required(requirement)
        tree = ast.parse(code)
        required_checks = {
            'must_use_input': any(isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == 'input' for node in ast.walk(tree)),
            'must_use_for': any(isinstance(node, ast.For) for node in ast.walk(tree)),
            'must_use_while': any(isinstance(node, ast.While) for node in ast.walk(tree)),
            'must_use_if': any(isinstance(node, ast.If) for node in ast.walk(tree)),
            'must_define_function': any(isinstance(node, ast.FunctionDef) for node in ast.walk(tree)),
            'must_return_value': any(isinstance(node, ast.Return) for node in ast.walk(tree)),
            'must_define_class': any(isinstance(node, ast.ClassDef) for node in ast.walk(tree)),
            'must_use_print': any(isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == 'print' for node in ast.walk(tree)),
        }
        for key, value in mapping.items():
            if value is False:
                continue
            canonical = key.replace('must_', '').replace('use_', '').replace('_', '')
            if key in required_checks:
                if not required_checks[key]:
                    return False
            elif canonical in {'input','for','while','if','print'}:
                if not required_checks[f'must_use_{canonical}']:
                    return False
            elif canonical in {'function','return','class'}:
                if not required_checks[f'must_define_function' if canonical == 'function' else 'must_return_value' if canonical == 'return' else 'must_define_class']:
                    return False
        return True

    @classmethod
    def evaluate(cls, code, tests, requirement=None, *, timeout=8, execution=None):
        normalized = [cls._normalize_fixture(t) for t in (tests or [])]
        syntax_error = None
        try:
            ast.parse(code)
        except SyntaxError as exc:
            syntax_error = str(exc)
            runtime_error = None
            timeout = False
            return EvaluationResult(
                correct=False,
                tests_passed=0,
                tests_total=max(len(normalized), 0),
                syntax_error=syntax_error,
                runtime_error=runtime_error,
                timeout=timeout,
                stdout=[],
                stderr='',
                structural_requirements_passed=False,
                score_context={'passed': 0, 'total': max(len(normalized), 0), 'requirement': requirement},
                detected_misconceptions=MisconceptionDetector.detect(code)
            )

        structural_requirements_passed = cls._check_ast_requirements(code, requirement) if code else True
        if execution is None:
            execution = execute(code, [{'inputs': p['inputs'], 'expected': p['expected']} for p in normalized], timeout=timeout)
        stdout = execution.get('outputs', []) if isinstance(execution, dict) else []
        stderr = execution.get('message', '') if isinstance(execution, dict) else ''
        loop_like_timeout = bool(re.search(r'\bwhile\s+True\b|\bwhile\s+1\b', code, re.I))
        runtime_error = None if execution.get('status') in ('ok', 'timeout') and execution.get('status') != 'learner_error' else stderr
        is_timeout = bool(execution.get('status') == 'timeout' or (execution.get('status') == 'learner_error' and loop_like_timeout))
        tests_total = len(normalized)
        tests_passed = 0
        for output, fixture in zip(stdout, normalized):
            expected = fixture.get('expected')
            if expected is None:
                continue
            if isinstance(output, str) and isinstance(expected, str):
                if output.strip() == expected.strip():
                    tests_passed += 1
            elif output == expected:
                tests_passed += 1
        if execution.get('status') == 'learner_error' and not tests_passed:
            runtime_error = stderr
        correct = (not syntax_error and not is_timeout and execution.get('status') == 'ok' and tests_passed == tests_total and structural_requirements_passed)
        detected = MisconceptionDetector.detect(code, execution)
        return EvaluationResult(
            correct=bool(correct),
            tests_passed=tests_passed,
            tests_total=tests_total,
            syntax_error=syntax_error,
            runtime_error=runtime_error,
            timeout=is_timeout,
            stdout=stdout,
            stderr=stderr,
            structural_requirements_passed=bool(structural_requirements_passed),
            score_context={'passed': tests_passed, 'total': tests_total, 'requirement': requirement, 'status': execution.get('status')} if isinstance(execution, dict) else {'passed': tests_passed, 'total': tests_total, 'requirement': requirement},
            detected_misconceptions=detected,
        )


class ScoreAgent:
    def __init__(self,policy=None):self.calculator=ScoreCalculator(policy)
    def evaluate(self,**metrics):
        if 'passed' in metrics and 'total' in metrics and 'tests_passed' not in metrics:
            metrics['tests_passed'] = metrics['passed']
            metrics['tests_total'] = metrics['total']
        result=self.calculator.calculate(**metrics)
        return result|{'result_message':MESSAGES[result['result_tier']]}


class SuggestionAgent:
    def suggest(self,code,correct):
        if not correct:return 'Compare your output with the requirements, then test one small change at a time.'
        import ast
        names={n.id for n in ast.walk(ast.parse(code)) if isinstance(n,ast.Name) and isinstance(n.ctx,ast.Store)}
        if names & {'x','y','z'}:return 'Your program works. Consider descriptive variable names that explain what each value represents.'
        return 'Your solution meets the requirements. Keep the same clear structure when you tackle a new example.'
