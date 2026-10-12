import subprocess
import sys
import unittest
from pathlib import Path

class WorkerEntrypointTests(unittest.TestCase):
    def test_spawned_worker_does_not_render_streamlit(self):
        root=Path(__file__).resolve().parents[1]
        result=subprocess.run([sys.executable,'-c',"import runpy,sys; runpy.run_path('app.py',run_name='__mp_main__'); assert 'streamlit' not in sys.modules; print('UI_SKIPPED')"],cwd=root,capture_output=True,text=True,timeout=10)
        self.assertEqual(result.returncode,0,result.stderr)
        self.assertEqual(result.stdout.strip(),'UI_SKIPPED')
