"""Validate provider output before it can become an active question."""
import ast
import logging
import re
import uuid
from difflib import SequenceMatcher
from app.models import GeneratedQuestion
from app.execution_router import ExecutionRouter, capability_for
from app.sandbox_execution import INFRASTRUCTURE_FAILURES
from app.validation import required_concepts
from app.novelty import structure_fingerprint


def fingerprint(question):
    return re.sub(r'\W+', ' ', question['prompt'].lower()).strip()


def question_guard(raw, topic, difficulty, history):
    q = GeneratedQuestion.model_validate(raw)
    if (q.world_id, q.subtopic_id, q.difficulty) != (topic['world_id'], topic['id'], difficulty):
        raise ValueError('Question context mismatch')
    if not q.concept_tags or not set(q.concept_tags) <= set(topic['allowed_concepts']):
        raise ValueError('Concept mismatch')
    ast.parse(q.starter_code)
    visible = '\n'.join([q.title, q.prompt, q.starter_code, q.hint_seed,
                         q.learning_objective, q.expected_behavior, *q.requirements])
    if re.search(r'\b(doraemon|nobita|shizuka|gian|suneo|doracakes?)\b', visible, re.I):
        raise ValueError('Legacy branding rejected')
    if q.solution.strip() in visible:
        raise ValueError('Solution leakage')
    normalized=fingerprint(q.model_dump())
    for previous in history:
        if SequenceMatcher(None,normalized,fingerprint(previous)).ratio() >= .86:
            raise ValueError('Duplicate or near-duplicate question')
        if previous.get('solution') and structure_fingerprint(q.solution)==structure_fingerprint(previous['solution']):
            raise ValueError('Repeated task structure: vary input count, output pattern, or required operations within the topic')
    # Introductory I/O may not smuggle in future-world constructs via false tags.
    if topic['world_id']=='W01':
        for code in [q.starter_code,q.solution]:
            nodes=list(ast.walk(ast.parse(code)))
            if any(isinstance(n,(ast.For,ast.While,ast.If,ast.FunctionDef,ast.ClassDef,ast.Import,ast.ImportFrom,ast.ListComp)) for n in nodes):
                raise ValueError('Future concept in introductory I/O')
            calls={n.func.id for n in nodes if isinstance(n,ast.Call) and isinstance(n.func,ast.Name)}
            if not calls <= {'print','input','str'}:
                raise ValueError('Future call in introductory I/O')
    if 'input' in required_concepts(q):
        if len({tuple(f.inputs) for f in q.test_cases}) < 2 or len({f.expected for f in q.test_cases}) < 2:
            raise ValueError('Input questions require distinct input-dependent fixtures')
    q.execution_capability = capability_for(q.subtopic_id).value
    result = ExecutionRouter().execute(q, q.solution, [f.model_dump() for f in q.test_cases])
    if result['status'] in INFRASTRUCTURE_FAILURES:
        raise ValueError('Sandbox unavailable; reference execution cannot proceed')
    if (result['status'] != 'ok' or result['outputs'] != [f.expected for f in q.test_cases]
            or not required_concepts(q) <= set(result.get('concepts', []))):
        raise ValueError('Reference solution does not pass')
    q.question_id = 'GEN_' + topic['id'] + '_' + uuid.uuid4().hex
    q.generation_source = 'generated'
    logging.info('question_guard_passed selected_world=%s selected_subtopic=%s', q.world_id, q.subtopic_id)
    return q
