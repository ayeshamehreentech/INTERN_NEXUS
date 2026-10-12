from streamlit.testing.v1 import AppTest
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import os
import tempfile
with tempfile.TemporaryDirectory() as directory:
    os.environ.update(PYQUEST_DATA_DIR=directory,PYQUEST_VERIFICATION_MODE='1',PYQUEST_DEPLOYMENT='local',PYQUEST_BACKEND_MODE='local')
    at=AppTest.from_file(str(Path(__file__).resolve().parents[1]/'app.py'),default_timeout=30).run()
    at.switch_page('app_pages/learn.py').run()
    at.selectbox(key='topic_choice').select('W01_INPUT').run()
    at.button(key='start_challenge').click().run()
    print('START',[(button.label,button.key) for button in at.button],[e.value for e in at.error],[e.message for e in at.exception])
    code=next(widget for widget in at.text_area if widget.label=='Python code')
    code.set_value('name=input()\nprint("Welcome",name)').run()
    print('EDIT',[(button.label,button.key) for button in at.button],[e.value for e in at.error],[e.message for e in at.exception])
    print('session',at.session_state['current_session'])
