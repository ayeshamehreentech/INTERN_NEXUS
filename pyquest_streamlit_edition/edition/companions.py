"""Existing approved art only. Native static display respects reduced motion."""
import json
from functools import lru_cache
from pathlib import Path
from PIL import Image
import streamlit as st

ROOT=Path(__file__).resolve().parents[1]
NAMES={'byte':'Byte','kai':'Kai','nova':'Nova','mira':'Mira','zed':'Zed'}
PRIORITIES={'idle':0,'blink':1,'thinking':3,'happy':4,'motivating':4}


@lru_cache(maxsize=20)
def artwork(character,outfit='outfit_01',state='idle'):
    if character not in NAMES or outfit not in ('outfit_01','outfit_02'):raise ValueError('Unknown companion or outfit.')
    manifest=json.loads((ROOT/'assets/characters/animated/manifest.json').read_text())['characters'][character]
    if character=='kai' and outfit=='outfit_01' and state=='idle':
        return Image.open(ROOT/'assets/characters/animated/kai/blink/01.png').copy()
    for candidate in (state,'idle'):
        config=manifest['states'].get(candidate,{})
        if outfit==manifest['outfit'] and config.get('status')=='READY' and config.get('frames'):
            url=config['frames'][0]
            if url.startswith('/assets/characters/animated/'+character+'/'):
                path=(ROOT/url.lstrip('/')).resolve()
                if path.is_relative_to(ROOT/'assets/characters/animated') and path.is_file():return Image.open(path).copy()
    extension='jpeg' if character=='zed' else 'png'
    image=Image.open(ROOT/f'assets/characters/studio-{character}.{extension}')
    # The established source-sheet outfit viewports, not regenerated art.
    x=1080 if outfit=='outfit_01' else 1294
    return image.crop((x,254,x+198,544))


def show(settings,state='idle'):
    character=settings.get('selected_character','byte')
    if character not in NAMES:character='byte'
    outfit='outfit_01'
    if outfit not in ('outfit_01','outfit_02'):outfit='outfit_01'
    try:st.image(artwork(character,outfit,state),width=120,alt=f'{NAMES[character]}, {"Classic" if outfit=="outfit_01" else "Explorer"}, {state}')
    except (OSError,ValueError):st.caption(NAMES[character]+' is here to support your learning.')
    st.caption(NAMES[character]+' · '+('Classic' if outfit=='outfit_01' else 'Explorer'))
