"""CONTAINER ONLY. Defense in depth; Docker is the isolation boundary.

This module must never be imported or executed by the host application.
One request and one fixture per disposable container. No expected answers enter.
"""
import ast
import builtins
import json
import sys


def main():
    request = json.loads(sys.stdin.buffer.read(30000))
    code = request['code']
    limit = min(int(request['output_limit']), 12000)
    parts = []
    size = 0
    inputs = iter(request['inputs'])

    def output(*values, sep=' ', end='\n'):
        nonlocal size
        value = sep.join(str(item) for item in values) + end
        size += len(value.encode('utf-8'))
        if size > limit:
            raise OverflowError()
        parts.append(value)

    try:
        tree = ast.parse(code)
        for node in ast.walk(tree):
            if isinstance(node, (ast.Import, ast.ImportFrom, ast.Global, ast.AsyncFunctionDef, ast.Await)):
                raise ValueError()
            if isinstance(node, ast.Attribute) and node.attr.startswith('_'):
                raise ValueError()
            if isinstance(node, ast.Name) and node.id.startswith('__'):
                raise ValueError()
            if isinstance(node, (ast.FunctionDef, ast.ClassDef)) and node.name.startswith('__') and node.name != '__init__':
                raise ValueError()
        names = ('abs all any bool dict enumerate filter float int isinstance issubclass iter len list '
                 'map max min next object pow property range reversed round set slice sorted staticmethod '
                 'classmethod str sum super tuple zip Exception ValueError TypeError StopIteration').split()
        safe = {name: getattr(builtins, name) for name in names}
        safe.update(__build_class__=builtins.__build_class__, print=output, input=lambda prompt='': next(inputs))
        namespace = {'__builtins__': safe, '__name__': 'exercise'}
        exec(compile(tree, '<exercise>', 'exec'), namespace, namespace)
        captured = ''.join(parts)
        # Match the bounded runner: remove one print terminator, not blank lines.
        result = {'status': 'ok', 'output': captured[:-1] if captured.endswith('\n') else captured}
    except OverflowError:
        result = {'status': 'output_limit'}
    except MemoryError:
        result = {'status': 'memory_limit'}
    except BaseException:
        result = {'status': 'learner_error'}
    sys.stdout.write(json.dumps(result))


if __name__ == '__main__':
    main()
