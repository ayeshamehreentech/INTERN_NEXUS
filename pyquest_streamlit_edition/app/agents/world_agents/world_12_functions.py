from app.agents.specialist import WorldAgent

class FunctionFallsAgent(WorldAgent):
    world_id = 'W12'
    scope = 'Def, calls, parameters, return, scope, decomposition, lambda and recursion.'
