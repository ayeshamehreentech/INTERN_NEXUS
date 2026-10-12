"""Trusted local presentation assets; learner content never enters HTML."""
from pathlib import Path
import streamlit as st

ROOT=Path(__file__).resolve().parents[1]

def styles():
    st.html(ROOT/'assets/edition.css')

def world_image(world):
    path=ROOT/world['image'].lstrip('/')
    if path.is_file():
        st.image(str(path),width='stretch',alt=world['name']+' world landscape')
