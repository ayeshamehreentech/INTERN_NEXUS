"""Curated visual learning only; no image generation or provider requests."""
import streamlit as st
from edition.studio_content import CONCEPTS
from edition.studio_diagrams import render_diagram
st.title('Visual Learning Studio',anchor=False)
st.caption('Explore Python with interactive diagrams. Learning here does not change XP, coins or mastery.')
st.html('<style>.visual-boxes{display:flex;flex-wrap:wrap;gap:10px;margin:14px 0}.visual-boxes span{padding:12px 16px;border:1px solid #d4bea2;background:#fff8ed;color:#332a24;border-radius:12px;font-weight:600;overflow-wrap:anywhere}</style>')
key=st.selectbox('Concept',list(CONCEPTS),format_func=lambda key:CONCEPTS[key][0],key='visual_concept')
title,definition,scenes=CONCEPTS[key]
st.write(definition)
with st.expander('Explanation storyboard'):
    for index,scene in enumerate(scenes,1):st.write(f'{index}. {scene}')
render_diagram(key)
