from app.catalog import TOPICS
import logging

class WorldAgent:
    def __call__(self,state):
        topic=TOPICS[state['subtopic_id']]
        if topic['world_id']!=self.world_id: raise ValueError('Specialist/topic mismatch')
        logging.info('world_agent_selected world_id=%s subtopic_id=%s',self.world_id,topic['id'])
        return {'specialist_context':{'agent':type(self).__name__,'world_id':self.world_id,
            'scope':self.scope,'selected_topic':topic,'difficulty':state['difficulty'],
            'mastery':state['mastery_score'],'instruction':'Stay within the selected topic. Do not substitute an unrelated task if execution support is missing.'}}
