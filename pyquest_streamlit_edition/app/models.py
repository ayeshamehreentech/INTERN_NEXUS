from typing import Literal, TypedDict
from pydantic import BaseModel, Field, ConfigDict

class Fixture(BaseModel):
    model_config = ConfigDict(extra='forbid')
    inputs: list[str] = Field(default_factory=list, max_length=10)
    expected: str = Field(min_length=1, max_length=2000)

class GeneratedQuestion(BaseModel):
    model_config = ConfigDict(extra='forbid')
    question_id: str = ''
    world_id: str
    subtopic_id: str
    title: str = Field(min_length=3, max_length=120)
    prompt: str = Field(min_length=10, max_length=1600)
    difficulty: Literal['easy', 'normal', 'hard'] = 'easy'
    question_style: Literal['SCENARIO_BASED','TECHNICAL','DEBUGGING','TRACE','IMPLEMENTATION','PROBLEM_SOLVING'] = 'SCENARIO_BASED'
    learning_objective: str
    requirements: list[str] = Field(min_length=1, max_length=8)
    starter_code: str = '# Write your Python here'
    expected_behavior: str
    test_cases: list[Fixture] = Field(min_length=1, max_length=5)
    hint_seed: str
    concept_tags: list[str]
    validation_concepts: list[Literal['input','print','assign','fstring','for','while','if','int','float','str','bool','len','range','list','tuple','set','dict','function','return','class','inheritance','lambda','yield']] = Field(default_factory=list)
    execution_capability: Literal['bounded_ast', 'isolated_sandbox'] = 'bounded_ast'
    solution: str = Field(min_length=1, max_length=4000)
    generation_source: Literal['generated', 'fallback'] = 'generated'

    def public(self):
        from app.rewards import SOLUTION_PRICES
        return self.model_dump(exclude={'solution','test_cases','hint_seed'}) | {
            'example': self.test_cases[0].model_dump(),'solution_cost':SOLUTION_PRICES[self.difficulty]}

class LearningState(TypedDict, total=False):
    learner_id: str
    selected_character: str
    action: str
    target_difficulty: str
    question_style: str
    learning_objective: str
    session_id: str
    event: str
    world_id: str
    subtopic_id: str
    difficulty: str
    mastery_score: float
    recent_attempts: list
    recent_questions: list
    current_question: dict
    question_source: str
    provider_status: str
    generation_error: str
    next_action: str
    candidate: dict
    retries: int
    valid: bool
    message: str
    specialist_context: dict
    guard_error: str
