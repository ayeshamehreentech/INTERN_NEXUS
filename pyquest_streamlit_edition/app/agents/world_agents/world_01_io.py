from app.agents.specialist import WorldAgent

class IOHarborAgent(WorldAgent):
    world_id = 'W01'
    scope = 'Console interaction: print, input, storing input, f-strings. Avoid loops/classes.'
