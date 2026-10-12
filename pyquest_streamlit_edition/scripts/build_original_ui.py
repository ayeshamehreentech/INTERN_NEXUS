"""Bundle the existing frontend for an inline Streamlit v2 component."""
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix='pyquest-ui-') as temporary:
    folder=Path(temporary)
    for source in (ROOT/'web').glob('*.js'):
        text=source.read_text(encoding='utf-8').replace('/assets/','/app/static/assets/')
        if source.name=='request.js':
            start=text.index('export async function requestJson(')
            end=text.index('export function handleEditorKey',start)
            text='export async function requestJson(path,data){return uiRequest(path,data);}\n'+text[end:]
        if source.name=='terminal.js':
            text=text.replace('session.draft||q.starter_code','(session.draft_saved ? session.draft : (session.draft||q.starter_code))')
        if source.name=='app.js':
            text=re.sub(r'</section><section class="panel"><h2>Recent activity</h2>.*?</section></div>\';', '</section></div>\';',text,count=1,flags=re.S)
        if source.name=='characters.js':
            text=text.replace("outfits:[{id:'outfit_01',name:'Classic',x:1080},{id:'outfit_02',name:'Explorer',x:1294}]", "outfits:[{id:'outfit_01',name:'Classic',x:1080}]")
            # Studio offers only the companions requested for this edition.
            text=text.replace("let preview=settings.companion||'byte';", "const studioCharacters=CHARACTERS.filter(c=>['byte','kai'].includes(c.id));\n let preview=studioCharacters.some(c=>c.id===settings.companion)?settings.companion:'byte';")
            text=text.replace('for(const c of CHARACTERS){','for(const c of studioCharacters){')
            text=text.replace("let outfit=outfits[preview]||'outfit_01';", "let outfit='outfit_01';")
            text=text.replace("outfit=outfits[preview]||'outfit_01';render();", "outfit='outfit_01';render();")
            # Idle is not an approved animation for Kai. Reuse the existing
            # transparent first blink frame as a static Classic fallback.
            anchor="const index=({idle:0,blink:0,happy:1,thinking:2,motivating:0})[pose]??0;"
            fallback="\n if(staticFallback&&character.id==='kai'&&outfit.id==='outfit_01'&&kind==='body')return `<img class=\"character-frame\" src=\"/app/static/assets/characters/animated/kai/blink/01.png\" alt=\"Kai, Classic, ${pose}\">`;"
            text=text.replace(anchor,anchor+fallback)
            portrait="""
 if(kind==='face'&&['byte','kai'].includes(character.id)){
  const state=character.id==='kai'&&pose==='idle'?'blink':pose;
  const frame=pose==='blink'?(character.id==='byte'?'02':'03'):'01';
  const width=character.id==='byte'?640:state==='happy'?704:543;
  const height=character.id==='byte'?768:760;
  const box=character.id==='byte'?'95 60 450 415':state==='happy'?'200 0 345 290':'135 0 345 290';
  return `<svg class="expression-portrait" viewBox="${box}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${character.name}, ${pose}"><image href="/app/static/assets/characters/animated/${character.id}/${state}/${frame}.png" width="${width}" height="${height}"/></svg>`;
 }
"""
            text=text.replace(anchor,anchor+portrait)
            # Capture failed thumbnails inside the component's shadow root.
            text=text.replace("globalThis.document?.addEventListener?.('error'", "document.addEventListener('error'")
        (folder/source.name).write_text(text,encoding='utf-8')
    destination=ROOT/'edition/ui/app.bundle.js'
    destination.parent.mkdir(parents=True,exist_ok=True)
    subprocess.run(['npx.cmd','--yes','esbuild@0.28.2',str(folder/'app.js'),'--bundle','--format=esm','--target=es2022',f'--outfile={destination}'],check=True)
print('Bundled original frontend; original source files unchanged.')
