import streamlit as st
from edition.curriculum import VISIBLE_WORLDS as WORLDS, VISIBLE_TOPICS as TOPICS
from app.concepts import LESSONS
from edition.runtime import call, accept_session, report_error
from edition.visuals import visualize
from edition.presentation import world_image

ss=st.session_state
st.header('Worlds & concepts',icon=':material/explore:')
ss.setdefault('world_choice',ss.selected_world)
if ss.world_choice not in {w['id'] for w in WORLDS}:ss.world_choice=WORLDS[0]['id']
world_id=st.selectbox('World',[world['id'] for world in WORLDS],format_func=lambda wid:next(w['name'] for w in WORLDS if w['id']==wid),key='world_choice',persist_state='session')
world=next(w for w in WORLDS if w['id']==world_id)
with st.expander('World landscape'):
    world_image(world)
topics=[topic['id'] for topic in world['topics']]
if ss.get('topic_choice') not in topics:ss.topic_choice=ss.selected_topic if ss.selected_topic in topics else topics[0]
topic_id=st.selectbox('Subtopic',topics,format_func=lambda tid:TOPICS[tid]['name'],key='topic_choice',persist_state='session')
if topic_id!=ss.selected_topic:ss.review_session=None
ss.selected_world=world_id;ss.selected_topic=topic_id
lesson=LESSONS[topic_id]
state={'lesson':lesson,'completed':False,'session_id':None}
if ss['_client']:
    try:state=call('concept',{'topic':topic_id})
    except Exception as exc:report_error(exc);st.error(ss.error)
with st.container(border=True):
    st.badge('Concept complete' if state['completed'] else 'Concept lesson',color='green' if state['completed'] else 'blue')
    st.header(lesson['title']);st.caption(lesson['learning_objective'])
    explanation,diagram=st.columns(2)
    with explanation:
        st.subheader('What it means');st.text(lesson['simple_explanation'])
        st.subheader('Why it matters');st.text(lesson['why_it_matters'])
        st.subheader('Syntax and worked example')
        for example in lesson['worked_examples']:
            st.code(example['code'],language='python',line_numbers=True,wrap_lines=True)
            st.caption('Expected output');st.code(example['output'],language=None,wrap_lines=True)
        if lesson.get('line_by_line'):
            with st.expander('Understand every line',expanded=True):
                for note in lesson['line_by_line']:st.write(note)
            st.caption(lesson['practice_reference'])
    with diagram:
        visualize(lesson)
        st.subheader('Common mistakes')
        for text in lesson['common_mistakes']:st.text('• '+text)
        st.subheader('Key takeaways')
        for text in lesson['remember']:st.text('• '+text)
    st.caption(lesson['practice_prompt'])
    with st.expander('Python toolkit explained: module, package, library & framework'):
        from edition.runtime import ROOT
        st.video(str(ROOT/'assets/learning/python-toolkit.mp4'),subtitles=str(ROOT/'assets/learning/python-toolkit.vtt'),alt='Captioned animation explaining Python modules, packages, libraries and frameworks')
        st.caption('70-second captioned animation. No sound needed; every explanation is on screen.')
    st.caption('Studying a concept does not award XP, coins, or mastery.')
    with st.container(horizontal=True):
        if st.button('Back to worlds',icon=':material/arrow_back:'):st.switch_page('app_pages/home.py')
        if st.button('Mark concept complete',disabled=ss['_client'] is None,key='complete_concept',icon=':material/check:'):
            try:call('complete',{'topic':topic_id});ss.error='';st.rerun()
            except Exception as exc:report_error(exc);st.error(ss.error)
        label='Continue challenge' if ss.review_session or state['session_id'] else 'Start challenge'
        if st.button(label,type='primary',icon=':material/play_arrow:',disabled=ss['_client'] is None,key='start_challenge'):
            try:
                with st.spinner('Preparing your challenge through the learning engine…'):
                    call('complete',{'topic':topic_id})
                    value=call('session',{'session_id':ss.review_session}) if ss.review_session else call('start',{'topic':topic_id})
                    if value['question']['subtopic_id']!=topic_id:raise ValueError('Topic mismatch.')
                    accept_session(value);ss.review_session=None
                st.switch_page('app_pages/practice.py')
            except Exception as exc:report_error(exc);st.error(ss.error)
