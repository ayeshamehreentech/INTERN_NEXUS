"""Small bounded interpreter for the curriculum; no eval, exec, or arbitrary calls."""
import ast
import array
from app.runner_base import Runner, CodeError

class BreakLoop(Exception): pass
class ContinueLoop(Exception): pass

class LearningRunner(Runner):
    def __init__(self, inputs=None):
        super().__init__(inputs)
        self.steps=0
        self.stream=''
    def tick(self):
        self.steps+=1
        if self.steps>5000:raise CodeError('The loop ran too long. Check the condition or add a break.')
    def expr(self,n):
        self.tick()
        if isinstance(n,ast.BinOp) and isinstance(n.op,ast.Mod):
            left=self.expr(n.left)
            if isinstance(left,str):raise CodeError('Use bounded f-string formatting instead of percent formatting.')
            return self.bounded(left % self.expr(n.right))
        if isinstance(n,ast.JoinedStr):
            parts=[]
            for value in n.values:
                if isinstance(value,ast.FormattedValue):
                    result=self.expr(value.value)
                    if value.conversion in (114,97):result=repr(result) if value.conversion==114 else ascii(result)
                    elif value.conversion==115:result=str(result)
                    spec=self.expr(value.format_spec) if value.format_spec else ''
                    if len(spec)>12 or any(c not in '0123456789.<>^,+-%fgdes ' for c in spec):raise CodeError('Use a simple format such as .2f.')
                    import re
                    if any(int(v)>100 for v in re.findall(r'\d+',spec)):raise CodeError('Keep format widths below 100.')
                    parts.append(format(result,spec))
                else:parts.append(self.expr(value))
            return self.bounded(''.join(parts))
        if isinstance(n,ast.Subscript):return self.bounded(self.expr(n.value)[self.expr(n.slice)])
        if isinstance(n,ast.Slice):return slice(*(self.expr(x) if x else None for x in [n.lower,n.upper,n.step]))
        if isinstance(n,ast.Call):
            if isinstance(n.func,ast.Name) and n.func.id=='input':return super().expr(n)
            args=[self.expr(a) for a in n.args]
            kwargs={k.arg:self.expr(k.value) for k in n.keywords if k.arg}
            if any(k.arg is None for k in n.keywords):raise CodeError('Use named arguments without ** here.')
            if isinstance(n.func,ast.Name):
                funcs={'int':int,'float':float,'str':str,'bool':bool,'list':list,'tuple':tuple,'set':set,'dict':dict,'type':type,'len':len,'sum':sum,'min':min,'max':max,'abs':abs,'round':round,'sorted':sorted,'repr':repr,'range':range,'enumerate':lambda *a:list(enumerate(*a))}
                if n.func.id=='array':
                    if not args or args[0] not in ('i','f','d'):raise CodeError('Use array typecode i, f or d.')
                    return self.bounded(array.array(*args))
                if n.func.id in funcs:
                    if n.func.id=='range':
                        result=range(*args)
                        if len(result)>1000:raise CodeError('Keep range below 1,000 steps.')
                        return result
                    return self.bounded(funcs[n.func.id](*args,**kwargs))
            if isinstance(n.func,ast.Attribute):
                obj=self.expr(n.func.value);method=n.func.attr
                allowed={str:{'lower','upper','strip','replace','split','join','find','count','startswith','endswith','isdigit','isalpha'},list:{'append','extend','insert','remove','pop','sort','reverse','count','index','copy','clear'},dict:{'get','keys','values','items','update','pop','copy'},set:{'add','discard','remove','union','intersection','difference','clear'},tuple:{'count','index'},array.array:{'append','extend','insert','pop','remove','reverse','count','index'}}
                if method in allowed.get(type(obj),set()):
                    if method=='replace' and len(args)>1 and len(str(obj))*max(1,len(str(args[1])))>2000:raise CodeError('Keep replacement text small.')
                    result=getattr(obj,method)(*args,**kwargs);self.bounded(obj)
                    return self.bounded(result)
            raise CodeError('That call is not available in this learning playground.')
        if isinstance(n,ast.ListComp):
            if len(n.generators)!=1 or n.generators[0].is_async:raise CodeError('Use a single comprehension loop.')
            g=n.generators[0];result=[]
            for item in self.expr(g.iter):
                self.tick();self.assign(g.target,item)
                if all(self.expr(test) for test in g.ifs):result.append(self.expr(n.elt))
            return self.bounded(result)
        return super().expr(n)
    def assign(self,target,value):
        if isinstance(target,ast.Name):self.env[target.id]=value
        elif isinstance(target,(ast.List,ast.Tuple)):
            if len(value)!=len(target.elts):raise CodeError('Match the number of names and values.')
            for name,item in zip(target.elts,value):self.assign(name,item)
        elif isinstance(target,ast.Subscript):self.expr(target.value)[self.expr(target.slice)]=value
        else:raise CodeError('Use a variable or collection index for assignment.')
    def block(self,nodes):
        for n in nodes:
            self.tick()
            if isinstance(n,ast.Assign):
                value=self.expr(n.value)
                for target in n.targets:self.assign(target,value)
            elif isinstance(n,ast.AugAssign):self.assign(n.target,self.expr(ast.BinOp(left=n.target,op=n.op,right=n.value)))
            elif isinstance(n,ast.If):self.block(n.body if self.expr(n.test) else n.orelse)
            elif isinstance(n,(ast.For,ast.While)):
                iterable=self.expr(n.iter) if isinstance(n,ast.For) else None
                iterator=iter(iterable) if iterable is not None else None
                broken=False
                while True:
                    self.tick()
                    if iterator is not None:
                        try:self.assign(n.target,next(iterator))
                        except StopIteration:break
                    elif not self.expr(n.test):break
                    try:self.block(n.body)
                    except BreakLoop:broken=True;break
                    except ContinueLoop:continue
                if not broken:self.block(n.orelse)
            elif isinstance(n,ast.Break):raise BreakLoop()
            elif isinstance(n,ast.Continue):raise ContinueLoop()
            elif isinstance(n,ast.Pass):pass
            elif isinstance(n,ast.ImportFrom) and n.module=='array' and n.level==0 and all(a.name=='array' and a.asname is None for a in n.names):pass
            elif isinstance(n,ast.Expr):
                v=n.value
                if isinstance(v,ast.Call) and isinstance(v.func,ast.Name) and v.func.id=='print':
                    kwargs={k.arg:self.expr(k.value) for k in v.keywords}
                    if set(kwargs)-{'sep','end'}:raise CodeError('Only sep and end are available for print().')
                    sep=kwargs.get('sep',' ');end=kwargs.get('end','\n')
                    if not isinstance(sep,str) or not isinstance(end,str):raise CodeError('sep and end must be text.')
                    self.stream+=sep.join(str(self.expr(a)) for a in v.args)+end
                    if len(self.stream)>12000:raise CodeError('Too much output. Try a smaller loop.')
                else:self.expr(v)
            else:raise CodeError('This lesson supports expressions, assignments, conditions and bounded loops.')
    def run(self,code):
        if not isinstance(code,str) or len(code)>4000:raise CodeError('Keep your program under 4,000 characters.')
        try:
            tree=ast.parse(code)
            if len(list(ast.walk(tree)))>400:raise CodeError('Try a shorter program.')
            self.block(tree.body)
            return self.stream[:-1] if self.stream.endswith('\n') else self.stream
        except CodeError:raise
        except (SyntaxError,ValueError,TypeError,KeyError,IndexError,ZeroDivisionError,OverflowError,RecursionError,AttributeError,BreakLoop,ContinueLoop) as exc:
            raise CodeError('Check your code: '+str(exc).split('\n')[0]) from None
