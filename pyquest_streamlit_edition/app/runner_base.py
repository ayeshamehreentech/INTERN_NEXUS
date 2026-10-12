"""Bounded Python AST interpreter and authoritative local game state."""
import ast
import json
import operator
from pathlib import Path


class CodeError(ValueError):
    pass

class Runner:
    """Supports this course's assignments, literals, expressions and print only.
    Never uses exec/eval and cannot access files, network, imports or attributes.
    """
    binary = {ast.Add:operator.add,ast.Sub:operator.sub,ast.Mult:operator.mul,ast.Div:operator.truediv,ast.FloorDiv:operator.floordiv,ast.Mod:operator.mod,ast.Pow:operator.pow,ast.BitAnd:operator.and_,ast.BitOr:operator.or_,ast.BitXor:operator.xor,ast.LShift:operator.lshift,ast.RShift:operator.rshift}
    compare = {ast.Eq:operator.eq,ast.NotEq:operator.ne,ast.Lt:operator.lt,ast.LtE:operator.le,ast.Gt:operator.gt,ast.GtE:operator.ge,ast.Is:operator.is_,ast.IsNot:operator.is_not,ast.In:lambda a,b:a in b,ast.NotIn:lambda a,b:a not in b}
    def __init__(self, inputs=None): self.env={}; self.output=[]; self.inputs=iter(inputs or [])
    def bounded(self, value):
        if isinstance(value,(str,list,tuple,dict,set)) and len(value)>2000: raise CodeError('Keep values small for this challenge.')
        if isinstance(value,(int,float)) and abs(value)>10**12: raise CodeError('That number is too large for this challenge.')
        return value
    def expr(self,n):
        if isinstance(n,ast.JoinedStr):
            return self.bounded(''.join(str(self.expr(v.value)) if isinstance(v,ast.FormattedValue) and v.conversion==-1 and v.format_spec is None else self.expr(v) for v in n.values))
        if isinstance(n,ast.Call) and isinstance(n.func,ast.Name) and n.func.id in ('int','float','str','type') and len(n.args)==1 and not n.keywords:
            return self.bounded({'int':int,'float':float,'str':str,'type':type}[n.func.id](self.expr(n.args[0])))
        if isinstance(n,ast.Call) and isinstance(n.func,ast.Name) and n.func.id=='input' and len(n.args)<=1 and not n.keywords:
            if n.args:self.expr(n.args[0])
            try:return self.bounded(str(next(self.inputs)))
            except StopIteration:raise CodeError('Add another input value before running.') from None
        if isinstance(n,ast.Constant) and isinstance(n.value,(int,float,str,bool,type(None))): return self.bounded(n.value)
        if isinstance(n,ast.Name):
            if n.id not in self.env: raise CodeError(f'Create the variable {n.id} first.')
            return self.env[n.id]
        if isinstance(n,(ast.List,ast.Tuple,ast.Set)):
            items=[self.expr(x) for x in n.elts]
            return {ast.List:list,ast.Tuple:tuple,ast.Set:set}[type(n)](items)
        if isinstance(n,ast.Dict): return {self.expr(k):self.expr(v) for k,v in zip(n.keys,n.values)}
        if isinstance(n,ast.BinOp) and type(n.op) in self.binary:
            a,b=self.expr(n.left),self.expr(n.right)
            if isinstance(n.op,(ast.Pow,ast.LShift,ast.RShift)) and (not isinstance(b,(int,float)) or abs(b)>20): raise CodeError('Use a smaller exponent or shift.')
            if isinstance(n.op,ast.Mult) and ((isinstance(a,(str,list,tuple)) and isinstance(b,int) and len(a)*max(b,0)>2000) or (isinstance(b,(str,list,tuple)) and isinstance(a,int) and len(b)*max(a,0)>2000)): raise CodeError('That repetition is too large.')
            return self.bounded(self.binary[type(n.op)](a,b))
        if isinstance(n,ast.UnaryOp):
            funcs={ast.Not:operator.not_,ast.USub:operator.neg,ast.UAdd:operator.pos,ast.Invert:operator.invert}
            if type(n.op) in funcs:return self.bounded(funcs[type(n.op)](self.expr(n.operand)))
        if isinstance(n,ast.BoolOp):
            result=self.expr(n.values[0])
            for value in n.values[1:]:
                if isinstance(n.op,ast.And) and not result:break
                if isinstance(n.op,ast.Or) and result:break
                result=self.expr(value)
            return result
        if isinstance(n,ast.Compare):
            left=self.expr(n.left)
            for op,right_node in zip(n.ops,n.comparators):
                right=self.expr(right_node)
                if not self.compare[type(op)](left,right):return False
                left=right
            return True
        if isinstance(n,ast.IfExp):return self.expr(n.body if self.expr(n.test) else n.orelse)
        raise CodeError('Use literals, variables and operators here. Imports, loops and other calls are not part of this operator editor.')
    def run(self,code):
        if not isinstance(code,str) or len(code)>4000:raise CodeError('Keep your program under 4,000 characters.')
        try:
            tree=ast.parse(code)
            if len(list(ast.walk(tree)))>300:raise CodeError('Try a shorter program.')
            for n in tree.body:
                if isinstance(n,ast.Assign) and len(n.targets)==1 and isinstance(n.targets[0],(ast.Tuple,ast.List)) and all(isinstance(t,ast.Name) for t in n.targets[0].elts):
                    values=self.expr(n.value)
                    if len(values)!=len(n.targets[0].elts):raise CodeError('The number of variables must match the number of values.')
                    for target,value in zip(n.targets[0].elts,values):self.env[target.id]=value
                elif isinstance(n,ast.Assign) and all(isinstance(t,ast.Name) for t in n.targets):
                    value=self.expr(n.value)
                    for target in n.targets:self.env[target.id]=value
                elif isinstance(n,ast.AugAssign) and isinstance(n.target,ast.Name):
                    self.env[n.target.id]=self.expr(ast.BinOp(left=n.target,op=n.op,right=n.value))
                elif isinstance(n,ast.Expr) and isinstance(n.value,ast.Call) and isinstance(n.value.func,ast.Name) and n.value.func.id=='print' and not n.value.keywords:
                    self.output.append(' '.join(str(self.expr(arg)) for arg in n.value.args))
                elif isinstance(n,ast.Expr): self.output.append(str(self.expr(n.value)))
                else:raise CodeError('Use assignments and print() for this challenge.')
            return '\n'.join(self.output)
        except CodeError:raise
        except (SyntaxError,TypeError,ValueError,KeyError,ZeroDivisionError,OverflowError,RecursionError) as exc:
            raise CodeError('Check your Python syntax and value types. '+ ('Replace ? with your expression.' if '?' in code else str(exc).split('\n')[0])) from None
