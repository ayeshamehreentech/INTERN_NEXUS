"""Explicit mock UI server, with temporary storage and a visible test banner."""
import argparse
import os
import subprocess
import sys
import tempfile
from pathlib import Path

parser=argparse.ArgumentParser()
parser.add_argument('--mock',action='store_true',required=True)
parser.add_argument('--port',type=int,default=8502)
args=parser.parse_args()
with tempfile.TemporaryDirectory(prefix='pyquest-streamlit-qa-') as directory:
    env=dict(os.environ,PYQUEST_VERIFICATION_MODE='1',PYQUEST_DATA_DIR=directory,PYQUEST_DEPLOYMENT='local',PYQUEST_BACKEND_MODE='local',PYQUEST_REQUIRE_AUTH='false')
    raise SystemExit(subprocess.call([sys.executable,'-m','streamlit','run','app.py','--server.address=127.0.0.1','--server.port='+str(args.port)],cwd=Path(__file__).resolve().parents[1],env=env))
