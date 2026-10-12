"""Visible curriculum; archived worlds retain their data and canonical IDs."""
from app.catalog import WORLDS, TOPICS
VISIBLE_WORLDS=[world for world in WORLDS if world['id']!='W14']
VISIBLE_TOPICS={key:value for key,value in TOPICS.items() if value['world_id']!='W14'}
