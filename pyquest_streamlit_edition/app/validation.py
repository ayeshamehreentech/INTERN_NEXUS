"""Machine-readable concept requirements, independent of any LLM verdict."""
import ast

TAGS = {'input', 'print', 'assign', 'fstring', 'for', 'while', 'if',
        'int', 'float', 'str', 'bool', 'len', 'range', 'list', 'tuple', 'set', 'dict', 'unpack', 'semicolon','nested_loop'}


def required_concepts(question):
    explicit = set(question.validation_concepts)
    # Compatibility with migrated and previously persisted questions.
    explicit.update(r.strip().removesuffix('()') for r in question.requirements
                    if r.strip().removesuffix('()') in TAGS)
    if 'INPUT' in question.subtopic_id:
        explicit.add('input')
    if 'FSTRING' in question.subtopic_id:
        explicit.add('fstring')
    if question.subtopic_id=='W06_NESTED_LOOPS':explicit.add('nested_loop')
    if question.subtopic_id in {'W12_FUNCTIONS', 'W12_RECURSIVE_FUNCTIONS', 'W12_CLOSURES', 'W12_DECORATORS'}:
        explicit.update({'function', 'return'})
    if question.subtopic_id == 'W12_LAMBDA_FUNCTIONS': explicit.add('lambda')
    if question.subtopic_id == 'W12_GENERATORS': explicit.update({'function', 'yield'})
    if question.world_id == 'W13': explicit.add('class')
    if question.subtopic_id == 'W13_INHERITANCE': explicit.add('inheritance')
    return explicit


def concepts_in(code):
    nodes = list(ast.walk(ast.parse(code)))
    nested=any(isinstance(n,(ast.For,ast.While)) and any(isinstance(child,(ast.For,ast.While)) for statement in n.body for child in ast.walk(statement)) for n in nodes)
    tags = {n.func.id for n in nodes if isinstance(n, ast.Call) and isinstance(n.func, ast.Name)}
    if nested:tags.add('nested_loop')
    if any(isinstance(n, ast.ClassDef) and n.bases for n in nodes): tags.add('inheritance')
    if any(isinstance(n, ast.Assign) and any(isinstance(t, (ast.Tuple, ast.List)) for t in n.targets) for n in nodes):
        tags.add('unpack')
    import io
    import tokenize
    if any(t.type == tokenize.OP and t.string == ';' for t in tokenize.generate_tokens(io.StringIO(code).readline)):
        tags.add('semicolon')
    for kind, tag in [(ast.Assign, 'assign'), (ast.JoinedStr, 'fstring'),
                      (ast.For, 'for'), (ast.While, 'while'), (ast.If, 'if'),
                      (ast.FunctionDef, 'function'), (ast.Return, 'return'),
                      (ast.ClassDef, 'class'), (ast.Lambda, 'lambda'), (ast.Yield, 'yield'), (ast.YieldFrom, 'yield')]:
        if any(isinstance(n, kind) for n in nodes):
            tags.add(tag)
    return tags
