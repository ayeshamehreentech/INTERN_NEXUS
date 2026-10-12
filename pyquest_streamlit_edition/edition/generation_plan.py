"""Readable structural constraints for live introductory question diversity."""
import ast

def introductory_plan(history):
    used=[]
    for item in history:
        try:
            nodes=ast.walk(ast.parse(item['solution']))
            used.append(sum(isinstance(n,ast.Call) and isinstance(n.func,ast.Name) and n.func.id=='input' for n in nodes))
        except (KeyError,SyntaxError):continue
    count=min(range(1,6),key=lambda n:(used.count(n),n))
    return {'input_count':count,'instruction':
        f'Read exactly {count} separate text inputs. Use every entered value in the output. '
        'Choose a genuinely different task and output layout from recent prompts; changing names alone is insufficient. '
        'Use only sequential assignments, input(), print(), and f-strings. '
        'Do not use conversions, functions, branches, or loops.'}
