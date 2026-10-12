import streamlit as st
from edition.runtime import call, report_error
from edition.companions import NAMES, show

st.header('Your companion',icon=':material/person:')
st.caption('All companions and outfits are free. Original approved artwork only; static display keeps the learning workspace reliable.')
settings=(st.session_state.get('_stats') or {}).get('settings',{})
studio_names={key:NAMES[key] for key in ('byte','kai')}
with st.form('companion_preferences'):
    companion=st.selectbox('Companion',list(studio_names),format_func=studio_names.get,index=list(studio_names).index(settings.get('selected_character')) if settings.get('selected_character') in studio_names else 0)
    st.caption('Classic outfit')
    outfit='Classic'
    save=st.form_submit_button('Save companion',type='primary',disabled=st.session_state['_client'] is None)
if save:
    try:
        call('settings',{'settings':{'selected_character':companion,'character_outfits':settings.get('character_outfits',{})|{companion:'outfit_01' if outfit=='Classic' else 'outfit_02'}}})
        st.session_state.error='';st.rerun()
    except Exception as exc:report_error(exc);st.error(st.session_state.error)
show(settings,'idle')
