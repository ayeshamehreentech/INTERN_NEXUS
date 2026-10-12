import streamlit as st
from edition.curriculum import VISIBLE_WORLDS as WORLDS, VISIBLE_TOPICS as TOPICS

st.header('Your learning progress',icon=':material/insights:')
stats=st.session_state.get('_stats')
if not stats:
    st.info('Progress is unavailable until the learning backend is connected.');st.stop()
with st.container(horizontal=True):
    st.metric('Coins',stats['coins'],border=True)
    st.metric('Completed challenges',stats['correct'],border=True);st.metric('Attempts',stats['attempts'],border=True)
st.caption('Concept completion is tracked separately. Mastery reflects verified independent practice.')
st.dataframe([{'World':w['name'],'Concepts':len(w['topics']),'Mastery (%)':round(stats['worlds'][w['id']]*100)} for w in WORLDS],hide_index=True,alt='Mastery and concept count for all visible worlds')
