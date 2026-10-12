import streamlit as st
from app.catalog import TOPICS
from edition.runtime import call, accept_session, save_draft, report_error, action_operation
from edition.companions import show

ss=st.session_state
st.header('Coding workspace',icon=':material/terminal:')
if not ss.current_session:
    st.info('Choose a subtopic and study its Concept Card to start your first challenge.')
    if st.button('Explore concepts',type='primary'):st.switch_page('app_pages/learn.py')
    st.stop()
try:value=call('session',{'session_id':ss.current_session})
except Exception as exc:report_error(exc);st.error(ss.error);st.stop()
buffer_key=accept_session(value);q=value['question'];sid=value['session_id'];qid=q['question_id']
if q['world_id']=='W14':
    st.info('This level is no longer available. Saved progress is retained.')
    st.page_link('app_pages/learn.py',label='Choose another world')
    st.stop()
code_key='code_'+buffer_key;inputs_key='inputs_'+buffer_key
ss.setdefault(code_key,ss.drafts[buffer_key]);ss.setdefault(inputs_key,'\n'.join(q['example']['inputs']))
stats=ss.get('_stats') or {}
with st.container(horizontal=True):
    st.badge(TOPICS[q['subtopic_id']]['name'],color='blue');st.badge(q['difficulty'],color='gray')
    if stats:st.caption(f"{stats['xp']} XP · {stats['coins']} coins · mastery {round(stats['mastery'].get(q['subtopic_id'],0)*100)}%")
with st.container(border=True):
    st.subheader(q['title']);st.text(q['prompt']);st.caption(q['learning_objective'])
    for requirement in q['requirements']:st.text('• '+requirement)
    with st.expander('Example input / output',expanded=True):
        cols=st.columns(2)
        with cols[0]:st.caption('Input');st.code('\n'.join(q['example']['inputs']) or '(none)',language=None,wrap_lines=True)
        with cols[1]:st.caption('Output');st.code(q['example']['expected'],language=None,wrap_lines=True)

def persist():
    ss.error=''
    ss.drafts[buffer_key]=ss[code_key]
    try:save_draft(sid,qid,ss[code_key])
    except Exception as exc:report_error(exc)

def review():
    persist()
    # Only leave the editor if durable saving succeeded.
    if ss.error:return
    ss.review_session=sid;ss.world_choice=q['world_id'];ss.topic_choice=q['subtopic_id']
    ss.selected_world=q['world_id'];ss.selected_topic=q['subtopic_id']
    ss['_navigate_to']='app_pages/learn.py'

def perform(action):
    code=ss[code_key];inputs=ss[inputs_key].splitlines()
    ss.drafts[buffer_key]=code;ss.error=''
    try:
        with st.spinner({'run':'Running code…','check':'Checking deterministic fixtures…','hint':'Preparing a hint…','next':'Generating the next challenge…'}[action]):
            save_draft(sid,qid,code)
            fingerprint,operation=action_operation(action,sid,qid,code,inputs)
            payload=dict(session_id=sid,question_id=qid,operation_id=operation)
            if action in ('run','check'):payload.update(code=code,inputs=inputs)
            result=call(action,payload)
            ss.pending_operations.pop(fingerprint,None)
            if action=='next':accept_session(result)
            elif action=='hint':ss.hints[buffer_key]=result['hint']
            elif action=='run':ss.outputs[buffer_key]=result
            else:
                ss.feedback[buffer_key]=result;ss.outputs[buffer_key]=result
                event_id=sid+':'+qid
                seen=ss.setdefault('_native_success_seen',set())
                if result.get('correct') is True and event_id not in seen:
                    seen.add(event_id)
                    ss['_native_success_pending']={'id':event_id,'sid':sid,'qid':qid,'result':result}
    except Exception as exc:report_error(exc)

@st.dialog('Use coins for a solution')
def purchase():
    st.text(f"This solution costs {q['solution_cost']} coins. A revealed solution cannot earn independent mastery or new question rewards.")
    if st.button('Confirm purchase',type='primary'):
        try:
            result=call('reveal',dict(session_id=sid,question_id=qid,confirmed=True))
            # Dialog runs separately: update before the next full editor render.
            ss[code_key]=result['solution'];save_draft(sid,qid,result['solution']);ss.error='';st.rerun()
        except Exception as exc:report_error(exc);st.error(ss.error)

def acknowledge_success():
    ss.pop('_native_success_pending',None)

@st.dialog('Challenge completed',on_dismiss=acknowledge_success)
def success_popup(event):
    settings=dict(stats.get('settings',{}))
    if (settings.get('selected_character') or settings.get('companion')) not in ('byte','kai'):
        settings['selected_character']='byte';settings['companion']='byte'
    show(settings,'happy')
    st.subheader('HOORAY! 🎉')
    st.write('You wrote the correct Python code!')
    st.caption('Amazing work! You’ve successfully completed this challenge.')
    result=event['result']
    for name,key in [('XP','xp_awarded'),('Coins','coins_awarded')]:
        if key in result:st.badge(f"+{result[key]} {name}",color='orange')
    if st.button('Continue Adventure →',type='primary',key='success_continue'):
        acknowledge_success();perform('next');st.rerun()
    if st.button('Stay on This Question',key='success_stay'):
        acknowledge_success();st.rerun()

editor,output=st.columns([3,2])
with editor:
    st.text_area('Python code',key=code_key,height=320,max_chars=4000,persist_state='session',on_change=persist,help='Your code is saved when you leave the field or choose an action. Ctrl+Enter commits the draft.')
    with st.expander('Syntax-highlighted preview'):
        st.code(ss[code_key],language='python',line_numbers=True,wrap_lines=True)
with output:
    st.text_area('Input — one value per line',key=inputs_key,height=110,persist_state='session',max_chars=12000)
    st.subheader('Output')
    execution=ss.outputs.get(buffer_key,{})
    st.code('\n'.join(execution.get('outputs',[])) or execution.get('message') or 'Run your code to see output.',language=None,wrap_lines=True)
    feedback=ss.feedback.get(buffer_key,{})
    show(stats.get('settings',{}),'happy' if feedback.get('correct') else 'motivating' if feedback else 'idle')
with st.container(horizontal=True):
    st.button('Run code',icon=':material/play_arrow:',on_click=perform,args=('run',))
    st.button('Check answer',type='primary',icon=':material/check_circle:',on_click=perform,args=('check',))
    st.button('Hint',icon=':material/lightbulb:',on_click=perform,args=('hint',))
    if st.button('Use coins',icon=':material/payments:'):purchase()
    st.button('Review concept',icon=':material/menu_book:',on_click=review)
    st.button('Next challenge',icon=':material/arrow_forward:',on_click=perform,args=('next',))
if ss.hints.get(buffer_key):st.info(ss.hints[buffer_key],icon=':material/lightbulb:')
if ss.error:st.error(ss.error)
feedback=ss.feedback.get(buffer_key)
if feedback:
    with st.container(border=True):
        if feedback.get('correct') is True:st.success('Correct! '+feedback.get('message',''))
        elif feedback.get('correct') is False:st.warning('Try again. '+feedback.get('message',''))
        else:st.error(feedback.get('message','Secure execution is unavailable. No rewards were granted.'))
        if feedback.get('correct') is False:
            from edition.motivation import difficulty_support
            support=difficulty_support(stats.get('recent',[]),q['subtopic_id'])
            if support:st.info(support)
        if 'xp_awarded' in feedback:
            st.text(f"XP +{feedback['xp_awarded']} · Coins +{feedback['coins_awarded']} · Marks {feedback['marks_awarded']}/{feedback['marks_possible']}")
            st.progress(feedback['new_mastery'],text=f"Mastery {round(feedback['previous_mastery']*100)}% → {round(feedback['new_mastery']*100)}%")
            for suggestion in feedback.get('improvement_suggestions',[]):st.text(suggestion)
pending=ss.get('_native_success_pending')
if pending and pending['sid']==sid and pending['qid']==qid:success_popup(pending)
