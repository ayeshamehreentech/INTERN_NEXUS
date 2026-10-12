def main():
    """PyQuest Streamlit Edition — separate from the original local HTTP app."""
    import streamlit as st
    from edition.runtime import initialize, ROOT
    from dotenv import load_dotenv
    load_dotenv(ROOT/'.env')
    
    st.set_page_config(page_title='PyQuest · Streamlit Edition',page_icon=':material/code:',layout='wide',initial_sidebar_state='collapsed')
    from edition.presentation import styles
    styles()
    from edition.runtime import setting
    if setting('PYQUEST_FRONTEND','original')=='original':
        try:initialize()
        except Exception:
            st.error('Configuration is incomplete. Check backend and identity settings; credentials are never shown.')
            st.stop()
        if st.session_state['_mode']!='preview':
            navigation=st.navigation([
                st.Page('app_pages/adventure.py',title='PyQuest Adventure',icon=':material/explore:',default=True),
                st.Page('app_pages/tips.py',title='Pythonist Pro-Tips Vault',icon=':material/lightbulb:',url_path='tips'),
                st.Page('app_pages/visual_studio.py',title='Visual Learning Studio',icon=':material/schema:',url_path='visual-studio'),
            ],position='hidden')
            st.html('<style>.st-key-native_navigation{display:none!important}</style>')
            with st.container(horizontal=True,key='native_navigation'):
                st.page_link('app_pages/adventure.py',label='PyQuest Adventure',icon=':material/explore:')
                st.page_link('app_pages/tips.py',label='Pythonist Pro-Tips Vault',icon=':material/lightbulb:')
                st.page_link('app_pages/visual_studio.py',label='Visual Learning Studio',icon=':material/schema:')
            if navigation.title!='PyQuest Adventure':
                st.page_link('app_pages/adventure.py',label='← Back to PyQuest')
            navigation.run()
            st.stop()
    st.logo(str(ROOT/'assets/pyquest-logo.svg'),size='large')
    st.title('PyQuest',icon=':material/code:')
    st.caption('Learn the concept. Solve the challenge. Build your Python confidence.')
    try:initialize()
    except Exception:
        st.error('Configuration is incomplete. Check backend URL, secret, and identity-provider settings; credentials are never shown here.')
        st.stop()
    
    ss=st.session_state
    if ss['_verification']:
        st.warning('TEST SESSION · isolated mock question provider. This is not live AI.')
    elif not ss['_authenticated']:
        st.caption('DEMO PROFILE · no sign-in configured. This tab has a private random training profile. A new browser connection starts a new demo; no account authentication is implied.')
    if ss['_mode']=='preview':
        st.info('Cloud preview · lessons are available. Persistent profiles and secure challenges require the authenticated external backend.')
    if ss.error:st.error(ss.error)
    stats=ss.get('_stats')
    with st.sidebar:
        st.subheader('Your learning space')
        from edition.curriculum import VISIBLE_WORLDS,VISIBLE_TOPICS
        st.caption(f'{len(VISIBLE_WORLDS)} worlds · {len(VISIBLE_TOPICS)} concepts')
        if stats:
            st.metric('Total XP',stats['xp']);st.metric('Coins',stats['coins'])
        if ss['_authenticated'] and st.button('Sign out',icon=':material/logout:'):st.logout()
        st.caption('Backend: '+ss['_mode'])
    
    navigation=st.navigation([
        st.Page('app_pages/home.py',title='Home',icon=':material/home:',default=True),
        st.Page('app_pages/learn.py',title='Worlds & concepts',icon=':material/explore:',url_path='learn'),
        st.Page('app_pages/practice.py',title='Coding workspace',icon=':material/terminal:',url_path='practice'),
        st.Page('app_pages/progress.py',title='Progress',icon=':material/insights:',url_path='progress'),
        st.Page('app_pages/preferences.py',title='Companion',icon=':material/person:',url_path='companion'),
        st.Page('app_pages/tips.py',title='Pythonist Pro-Tips Vault',icon=':material/lightbulb:',url_path='tips'),
        st.Page('app_pages/visual_studio.py',title='Visual Learning Studio',icon=':material/schema:',url_path='visual-studio')
    ],position='top')
    pending=ss.pop('_navigate_to',None)
    if pending:st.switch_page(pending)
    navigation.run()

if __name__ != '__mp_main__':
    main()
