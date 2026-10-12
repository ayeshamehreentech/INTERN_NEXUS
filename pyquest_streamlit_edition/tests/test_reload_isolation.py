import json
import subprocess
import sys
import unittest
from pathlib import Path

class ReloadIsolationTests(unittest.TestCase):
    def test_reloaded_backend_cache_keeps_drafts_and_can_spawn_worker(self):
        root=Path(__file__).resolve().parents[1]
        result=subprocess.run([sys.executable,str(root/'scripts/probe_reload.py')],cwd=root,
                              capture_output=True,text=True,timeout=30)
        self.assertEqual(result.returncode,0,result.stderr[-2000:])
        evidence=json.loads(result.stdout.strip().splitlines()[-1])
        self.assertEqual(evidence,{'service_rebuilt':True,'draft_retained':True,'generation_after_reload':True})
