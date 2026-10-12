"""Generate an original captioned motion-diagram video locally (dev: imageio-ffmpeg)."""
import json, math, subprocess, textwrap
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/learning'; OUT.mkdir(parents=True,exist_ok=True)
SCENES=[
 ('MODULE', 'One importable unit', 'A module groups related Python code. Often it is a .py file; built-in and extension modules also exist.', ['greetings.py','def hello(name):','    return "Hello, " + name'], 'import greetings → greetings.hello("Ayesha")', 'Think: one useful recipe.'),
 ('PACKAGE', 'Organize related modules', 'A package is a module that can contain submodules. A regular package usually has __init__.py; namespace packages can omit it.', ['kitchen/','  __init__.py','  breakfast.py','  dinner.py'], 'from kitchen import breakfast', 'Think: a folder of related recipes.'),
 ('LIBRARY', 'Reusable tools for your program', 'A library is reusable code, often made of modules and packages. lib is a common abbreviation, not a special Python keyword.', ['Your program','calls a reusable tool','math.sqrt(16) → 4.0'], 'import math     # from Python’s standard library', 'Think: a toolbox you choose tools from.'),
 ('FRAMEWORK', 'A structure for building an app', 'A framework supplies an application structure and runs parts of the workflow. Your code fits into that structure, for example Django views.', ['Request','Django → your view','Response'], 'Framework calls your handler when a request arrives', 'Think: a workshop with an established workflow.'),
 ('CONNECT THE IDEAS', 'Different labels, related roles', 'Modules and packages describe code organization. Libraries and frameworks describe how reusable code is used. These labels can overlap.', ['MODULE → importable unit','PACKAGE → contains submodules','LIBRARY → tools you call','FRAMEWORK → app structure + workflow'], 'Install third-party tools with pip; import names in Python.', 'Python includes its standard library. Django is installed separately.'),
]
FPS=15; LENGTH=14; WIDTH=1280; HEIGHT=720
def font(size,bold=False):
    return ImageFont.truetype('C:/Windows/Fonts/'+('segoeuib.ttf' if bold else 'segoeui.ttf'),size)
def frame(scene,t):
    label,title,body,lines,code,analogy=scene
    im=Image.new('RGB',(WIDTH,HEIGHT),'#f3ebdf'); d=ImageDraw.Draw(im)
    d.rounded_rectangle((32,28,1248,690),radius=28,fill='#fffcf7',outline='#dbcbb8',width=2)
    d.text((72,60),'PYQUEST  /  PYTHON TOOLKIT',font=font(19,True),fill='#825d46')
    d.text((72,105),label,font=font(22,True),fill='#825d46')
    d.text((72,143),title,font=font(42,True),fill='#332a24')
    d.multiline_text((72,210),'\n'.join(textwrap.wrap(body,87)),font=font(24),fill='#54463c',spacing=8)
    visible=min(len(lines),int(t/1.8)+1)
    for i,line in enumerate(lines[:visible]):
        x=72+int(18*max(0,1-(t-i*1.8)*3)); y=340+i*43
        d.rounded_rectangle((x,y,x+1110,y+37),radius=9,fill='#eee2d2')
        d.text((x+16,y+4),line,font=font(23,True),fill='#332a24')
    d.text((72,540),code,font=font(23),fill='#684b36')
    d.multiline_text((72,589),'\n'.join(textwrap.wrap(analogy,88)),font=font(22),fill='#54463c')
    index=SCENES.index(scene); progress=(index*LENGTH+t)/(LENGTH*len(SCENES))
    d.rounded_rectangle((72,660,1208,667),radius=3,fill='#eee2d2')
    d.rounded_rectangle((72,660,72+int(1136*progress)+2,667),radius=3,fill='#825d46')
    return im
writer=imageio_ffmpeg.write_frames(str(OUT/'python-toolkit.mp4'),(WIDTH,HEIGHT),fps=FPS,codec='libx264',pix_fmt_out='yuv420p',output_params=['-crf','24','-movflags','+faststart'])
writer.send(None)
for scene in SCENES:
    for n in range(LENGTH*FPS): writer.send(frame(scene,n/FPS).tobytes())
writer.close()
frame(SCENES[0],6).save(OUT/'python-toolkit-poster.png')
def stamp(seconds): return f'00:{seconds//60:02}:{seconds%60:02}.000'
captions=['WEBVTT','']
for i,scene in enumerate(SCENES):
    captions += [f'{stamp(i*LENGTH)} --> {stamp((i+1)*LENGTH)}',scene[0]+': '+scene[2],'']
(OUT/'python-toolkit.vtt').write_text('\n'.join(captions),encoding='utf-8')
(OUT/'python-toolkit-transcript.json').write_text(json.dumps([{'term':s[0],'title':s[1],'explanation':s[2],'example':s[4],'analogy':s[5]} for s in SCENES],indent=2),encoding='utf-8')
print('Generated 70-second H.264 captioned animation:',OUT/'python-toolkit.mp4')
