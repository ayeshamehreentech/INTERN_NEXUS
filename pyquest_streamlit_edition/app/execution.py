"""Restricted AST worker. Local mode is not an OS security sandbox."""
import ast
import multiprocessing as mp
import os
import time
from app.runner import LearningRunner
from app.validation import concepts_in

def _worker(code, fixtures, connection):
    os.environ.clear()
    try:
        tree=ast.parse(code)
        nodes=list(ast.walk(tree))
        if len(code)>4000 or len(nodes)>400: raise ValueError('Program is too large.')
        # Reject risky allocation forms before the inherited interpreter evaluates them.
        if any(isinstance(n,(ast.Pow,ast.LShift,ast.RShift)) for n in nodes):
            raise ValueError('Power and shift operations are unavailable in this local playground.')
        if any(isinstance(n,ast.BinOp) and isinstance(n.op,ast.Mod) and isinstance(n.left,ast.Constant) and isinstance(n.left.value,str) for n in nodes):
            raise ValueError('Use f-strings instead of percent formatting in the playground.')
        results=[LearningRunner(f['inputs']).run(code) for f in fixtures]
        concepts=concepts_in(code)
        connection.send(dict(status='ok',outputs=results,concepts=sorted(concepts)))
    except Exception as exc:
        connection.send(dict(status='learner_error',outputs=[],message=str(exc)[:400]))
    finally: connection.close()

def execute(code,fixtures,timeout=8):
    if not isinstance(code,str) or len(code)>4000:
        return dict(status='learner_error',outputs=[],message='Keep code under 4,000 characters.')
    context=mp.get_context('spawn')
    parent,child=context.Pipe(duplex=False)
    process=context.Process(target=_worker,args=(code,fixtures,child))
    try:
        process.start()
        child.close()
        if parent.poll(timeout):
            try: return parent.recv()
            except EOFError: return dict(status='worker_failure',outputs=[],message='Execution worker stopped.')
        return dict(status='timeout',outputs=[],message='Execution deadline exceeded.')
    finally:
        if process.pid:
            process.join(.2)
            if process.is_alive(): process.terminate(); process.join(1)
            if process.is_alive(): process.kill(); process.join()
            process.close()
        parent.close()
        child.close()
