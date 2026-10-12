import logging
from app.catalog import TOPICS
from app.agents.world_agents.world_01_io import IOHarborAgent
from app.agents.world_agents.world_02_variables_types import VariableValleyAgent
from app.agents.world_agents.world_03_type_forge import TypeForgeAgent
from app.agents.world_agents.world_04_operators import OperatorCityAgent
from app.agents.world_agents.world_05_decisions import DecisionForestAgent
from app.agents.world_agents.world_06_loops import LoopGalaxyAgent
from app.agents.world_agents.world_07_strings import StringKingdomAgent
from app.agents.world_agents.world_08_data_structures import DataStructureLandAgent
from app.agents.world_agents.world_09_ds_quest import DSQuestAgent
from app.agents.world_agents.world_10_sorting import SortingSummitAgent
from app.agents.world_agents.world_11_search import SearchIslandAgent
from app.agents.world_agents.world_12_functions import FunctionFallsAgent
from app.agents.world_agents.world_13_oop import OOPWorldAgent
from app.agents.world_agents.world_14_projects import ProjectPlanetAgent
AGENTS = {'W01':IOHarborAgent(),'W02':VariableValleyAgent(),'W03':TypeForgeAgent(),'W04':OperatorCityAgent(),'W05':DecisionForestAgent(),'W06':LoopGalaxyAgent(),'W07':StringKingdomAgent(),'W08':DataStructureLandAgent(),'W09':DSQuestAgent(),'W10':SortingSummitAgent(),'W11':SearchIslandAgent(),'W12':FunctionFallsAgent(),'W13':OOPWorldAgent(),'W14':ProjectPlanetAgent()}
def supervisor(state):
    topic=TOPICS.get(state['subtopic_id'])
    if not topic or state.get('world_id',topic['world_id'])!=topic['world_id']:
        raise ValueError('Invalid world/topic selection')
    world=topic['world_id']
    logging.info('supervisor_route world_id=%s agent=%s',world,type(AGENTS[world]).__name__)
    return {'world_id':world,'retries':0}
