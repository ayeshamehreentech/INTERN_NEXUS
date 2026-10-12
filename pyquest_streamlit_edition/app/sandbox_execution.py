"""Ephemeral Linux Docker execution. Never launch a host Python interpreter."""
import ast
import json
import logging
import shutil
import subprocess
import threading
import uuid
from dataclasses import dataclass
from app.validation import concepts_in


INFRASTRUCTURE_FAILURES = {'sandbox_unavailable', 'sandbox_error', 'unsupported_execution', 'worker_failure'}


@dataclass(frozen=True)
class SandboxLimits:
    image: str = 'pyquest-sandbox:1'
    wall_seconds: float = 8
    memory: str = '128m'
    cpus: str = '0.5'
    pids: int = 16
    source_bytes: int = 4000
    stdout_bytes: int = 12000
    stderr_bytes: int = 2000
    request_bytes: int = 30000


def failure(status):
    messages = {'sandbox_unavailable': 'Advanced execution is unavailable. Please retry when the sandbox is ready.',
                'sandbox_error': 'The execution service could not complete this request.',
                'timeout': 'Execution time limit exceeded.',
                'output_limit': 'Output limit exceeded.',
                'validation_error': 'Submitted source exceeds the supported limit.'}
    logging.info('sandbox_result status=%s', status)
    return {'status': status, 'outputs': [], 'infrastructure_failure': True,
            'message': messages.get(status, 'Execution could not complete.')}


class DockerSandboxExecutionService:
    def __init__(self, limits=None):
        self.limits = limits or SandboxLimits()

    def command(self, docker, name):
        p = self.limits
        return [docker, 'run', '--rm', '--pull=never', '--name', name,
                '--network=none', '--read-only', '--user=65534:65534',
                '--cap-drop=ALL', '--security-opt=no-new-privileges',
                '--memory=' + p.memory, '--memory-swap=' + p.memory,
                '--cpus=' + p.cpus, '--pids-limit=' + str(p.pids),
                '--ulimit=nofile=64:64', '--ulimit=core=0:0',
                '--tmpfs=/tmp:rw,noexec,nosuid,nodev,size=8m',
                '--workdir=/tmp', '--log-driver=none', '-i', p.image]

    def execute(self, code, fixtures):
        p = self.limits
        if not isinstance(code, str) or len(code.encode('utf-8')) > p.source_bytes:
            return failure('validation_error')
        if not isinstance(fixtures, list) or not 1 <= len(fixtures) <= 5:
            return failure('validation_error')
        for fixture in fixtures:
            inputs = fixture.get('inputs', [])
            if not isinstance(inputs, list) or len(inputs) > 10 or any(not isinstance(x, str) or len(x.encode('utf-8')) > 2000 for x in inputs):
                return failure('validation_error')
            if len(self._payload(code, inputs)) > p.request_bytes:
                return failure('validation_error')
        docker = shutil.which('docker')
        if not docker:
            return failure('sandbox_unavailable')
        try:
            ast.parse(code)
        except SyntaxError:
            return {'status': 'learner_error', 'outputs': [], 'message': 'Syntax error in submitted code.'}
        outputs = []
        for fixture in fixtures:
            result = self._fixture(docker, code, fixture.get('inputs', []))
            if result['status'] != 'ok':
                return result
            outputs.append(result['output'])
        return {'status': 'ok', 'outputs': outputs, 'concepts': sorted(concepts_in(code))}

    def _payload(self, code, inputs):
        return json.dumps({'code': code, 'inputs': inputs,
                           'output_limit': self.limits.stdout_bytes}, ensure_ascii=False).encode('utf-8')

    def _fixture(self, docker, code, inputs):
        p = self.limits
        name = 'pyquest-' + uuid.uuid4().hex
        process = None
        readers = []
        writer = None
        overflow = threading.Event()
        stdout, stderr = bytearray(), bytearray()

        def drain(stream, target, limit):
            while True:
                chunk = stream.read(1024)
                if not chunk:
                    break
                available = max(0, limit - len(target))
                target.extend(chunk[:available])
                if len(chunk) > available:
                    overflow.set()
                    process.kill()
                    break

        try:
            process = subprocess.Popen(self.command(docker, name), stdin=subprocess.PIPE,
                                       stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=False)
            # JSON escaping can expand captured output by up to six times.
            for stream, target, limit in [(process.stdout, stdout, p.stdout_bytes * 6 + 4096),
                                           (process.stderr, stderr, p.stderr_bytes)]:
                thread = threading.Thread(target=drain, args=(stream, target, limit), daemon=True)
                thread.start()
                readers.append(thread)
            payload = self._payload(code, inputs)
            # A non-reading Docker daemon must not block the wall-clock deadline.
            def send():
                try:
                    process.stdin.write(payload)
                    process.stdin.close()
                except (OSError, ValueError):
                    pass
            writer = threading.Thread(target=send, daemon=True)
            writer.start()
            process.wait(timeout=p.wall_seconds)
            for thread in readers:
                thread.join(timeout=1)
            if writer is not None:
                writer.join(timeout=1)
            if overflow.is_set():
                return failure('output_limit')
            if process.returncode != 0:
                return failure('sandbox_unavailable' if process.returncode == 125 else 'sandbox_error')
            result = json.loads(stdout.decode('utf-8'))
            if not isinstance(result, dict) or result.get('status') not in {'ok', 'learner_error', 'output_limit', 'memory_limit'}:
                return failure('sandbox_error')
            if result['status'] == 'ok':
                output = result.get('output')
                if not isinstance(output, str) or len(output.encode('utf-8')) > p.stdout_bytes:
                    return failure('sandbox_error')
                return {'status': 'ok', 'output': output}
            return {'status': result['status'], 'outputs': [], 'message': 'Code could not complete within the exercise limits.'}
        except subprocess.TimeoutExpired:
            return failure('timeout')
        except (OSError, ValueError, TypeError):
            return failure('sandbox_unavailable')
        finally:
            if process is not None:
                if process.poll() is None:
                    process.kill()
                try:
                    process.wait(timeout=2)
                except subprocess.TimeoutExpired:
                    pass
            # Killing the CLI alone does not stop a container. Always remove it.
            try:
                subprocess.run([docker, 'rm', '-f', name], stdout=subprocess.DEVNULL,
                               stderr=subprocess.DEVNULL, timeout=3, shell=False)
            except (OSError, subprocess.TimeoutExpired):
                logging.warning('sandbox_cleanup_failed')
            for thread in readers:
                thread.join(timeout=1)
            if writer is not None:
                writer.join(timeout=1)
            if process is not None:
                for stream in (process.stdin, process.stdout, process.stderr):
                    if stream and not stream.closed:
                        stream.close()
