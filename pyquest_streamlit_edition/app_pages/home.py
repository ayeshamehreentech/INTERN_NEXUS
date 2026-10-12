import streamlit as st
from edition.curriculum import VISIBLE_WORLDS as WORLDS, VISIBLE_TOPICS as TOPICS
from edition.runtime import open_topic
from edition.presentation import world_image

ss=st.session_state;stats=ss.get('_stats')
with st.container(border=True):
    st.header('A small lesson. A real coding challenge.')
    st.text('Explore Python through interactive concepts and fresh AI challenges. Your code is checked by deterministic tests, and progress comes from verified practice.')
    with st.container(horizontal=True):
        if st.button('Continue learning',type='primary',icon=':material/play_arrow:'):
            if ss.current_session:st.switch_page('app_pages/practice.py')
            open_topic(ss.selected_topic)
        st.badge(f'{len(WORLDS)} worlds',color='blue');st.badge(f'{len(TOPICS)} concept cards',color='green')

if stats:
    with st.container(horizontal=True):
        st.metric('Total XP',stats['xp'],border=True)
        st.metric('Coins',stats['coins'],border=True)
        st.metric('Completed challenges',stats['correct'],border=True)
        st.metric('Topics practiced',stats['topics_practiced'],border=True)
    world=next((w for w in WORLDS if w['id']==ss.selected_world),WORLDS[0])
    st.caption('Current world: '+world['name']+' · mastery '+str(round(stats['worlds'][world['id']]*100))+'%')

st.header('Choose your world',icon=':material/explore:')
st.caption('Every world is open. Start with the fundamentals or follow your own learning path.')
for offset in range(0,len(WORLDS),3):
    for column,world in zip(st.columns(3),WORLDS[offset:offset+3]):
        with column,st.container(border=True):
            world_image(world)
            st.html('<div class="pyquest-world-label">EXPLORE · LEARN · PRACTICE</div>')
            st.subheader(f"{world['number']:02} · {world['name']}")
            st.caption(str(len(world['topics']))+' concepts')
            if stats:st.progress(stats['worlds'][world['id']],text='Mastery '+str(round(stats['worlds'][world['id']]*100))+'%')
            if st.button('Explore '+world['name'],key='world_'+world['id'],width='stretch',icon=':material/arrow_forward:'):
                ss.world_choice=world['id'];ss.topic_choice=world['topics'][0]['id'];open_topic(world['topics'][0]['id'])
