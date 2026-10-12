import streamlit as st
from edition.studio_content import TIPS,search_tips
from edition.runtime import ROOT

st.title('Pythonist Pro-Tips Vault',anchor=False)
st.caption('Small techniques. Clear examples. Curated references. Reading tips does not change XP, coins or mastery.')
query=st.text_input('Search tips',placeholder='Try enumerate, shortcuts, module, generators…',key='tips_search')
category=st.selectbox('Category',['All']+list(dict.fromkeys(tip['category'] for tip in TIPS)),key='tips_category')
matches=search_tips(query,category)
st.caption(f'{len(matches)} matching tips')
if not matches:st.info('No matches. Try a shorter phrase or choose All categories.')
for index,tip in enumerate(matches):
    with st.container(border=True):
        st.badge(tip['category'],color='orange');st.subheader(tip['title'],anchor=False)
        st.write(tip['body'])
        if tip.get('shortcut'):st.code(tip['shortcut'],language=None)
        if tip.get('code'):
            st.code(tip['code'],language='python',line_numbers=True,wrap_lines=True)
            if 'output' in tip:
                with st.expander('Predict first, then reveal output · '+tip['title']):
                    st.code(tip['output'],language=None)
        st.link_button('Reference',tip['source'])
if category in ('All','Python toolkit') and not query:
    with st.expander('Watch the Python toolkit animation'):
        st.video(str(ROOT/'assets/learning/python-toolkit.mp4'),subtitles=str(ROOT/'assets/learning/python-toolkit.vtt'),alt='Captioned module, package, library and framework animation')
