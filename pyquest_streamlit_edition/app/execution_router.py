"""Trusted curriculum routing. Advanced execution has NO host fallback."""
import logging
from enum import StrEnum
from app.catalog import TOPICS
from app.execution import execute as bounded_execute
from app.sandbox_execution import DockerSandboxExecutionService


class Capability(StrEnum):
    BOUNDED_AST = 'bounded_ast'
    ISOLATED_SANDBOX = 'isolated_sandbox'
    UNSUPPORTED = 'unsupported'


def capability_for(topic_id):
    topic = TOPICS.get(topic_id)
    if not topic:
        return Capability.UNSUPPORTED
    if topic['world_id'] in {'W09', 'W10', 'W11', 'W12', 'W13', 'W14'}:
        return Capability.ISOLATED_SANDBOX
    return Capability.BOUNDED_AST


class ExecutionRouter:
    def __init__(self, sandbox=None):
        self.sandbox = sandbox or DockerSandboxExecutionService()

    def execute(self, question, code, fixtures):
        capability = capability_for(question.subtopic_id)
        topic = TOPICS.get(question.subtopic_id)
        if not topic or topic['world_id'] != question.world_id:
            capability = Capability.UNSUPPORTED
        logging.info('execution_backend_selected backend=%s', capability)
        if capability == Capability.BOUNDED_AST:
            # Even a forged provider field cannot enable unrestricted execution.
            return bounded_execute(code, fixtures)
        if capability == Capability.ISOLATED_SANDBOX:
            return self.sandbox.execute(code, fixtures)
        return {'status': 'unsupported_execution', 'outputs': [], 'message': 'Exercise execution is not supported.'}
