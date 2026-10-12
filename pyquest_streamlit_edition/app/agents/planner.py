"""Deterministic generation planner for learner state."""
from __future__ import annotations

from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class GenerationPlan:
    action: str
    target_difficulty: str
    question_style: str
    learning_objective: str


class Planner:
    """Choose the next learning action from mastery and recent evidence."""

    def plan(self, state):
        mastery = float(state.get('mastery_score') or 0)
        attempts = state.get('recent_attempts') or []
        recent = attempts[:5]
        if not recent:
            action, difficulty, style = 'FOUNDATION', 'easy', 'SCENARIO_BASED'
        elif len(recent) >= 2 and not any(item.get('correct') for item in recent[:2]):
            action, difficulty, style = 'REMEDIATION', 'easy', 'DEBUGGING'
        elif mastery >= 0.85:
            action, difficulty, style = 'MASTERY_CHALLENGE', 'hard', 'PROBLEM_SOLVING'
        elif mastery >= 0.6:
            action, difficulty, style = 'SAME_LEVEL_VARIATION', 'normal', 'IMPLEMENTATION'
        elif mastery >= 0.35:
            action, difficulty, style = 'PRACTICE', 'easy', 'SCENARIO_BASED'
        else:
            action, difficulty, style = 'FOUNDATION', 'easy', 'TECHNICAL'

        objective = state.get('learning_objective') or 'Practice the selected subtopic with a fresh challenge.'
        plan = GenerationPlan(action=action, target_difficulty=difficulty, question_style=style, learning_objective=objective)
        state_plan = asdict(plan)
        state_plan['difficulty'] = state_plan['target_difficulty']
        return state_plan
