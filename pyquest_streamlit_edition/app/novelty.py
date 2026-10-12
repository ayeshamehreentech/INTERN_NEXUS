"""Conservative syntactic novelty, not a claim of semantic equivalence proof."""
import ast
import hashlib


def structure_fingerprint(code):
    class Normalize(ast.NodeTransformer):
        def visit_Name(self,node):
            return ast.copy_location(ast.Name(id=node.id if node.id in {'input','print','range','int','float','str','len'} else 'value',ctx=node.ctx),node)
        def visit_Constant(self,node):
            return ast.copy_location(ast.Constant(value=type(node.value).__name__),node)
    tree=Normalize().visit(ast.parse(code))
    return hashlib.sha256(ast.dump(tree,include_attributes=False).encode()).hexdigest()
