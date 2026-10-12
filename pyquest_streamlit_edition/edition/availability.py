"""Bounded readiness checks for a trusted operator-provisioned Docker image."""
from functools import lru_cache
import shutil
import subprocess
import time


@lru_cache(maxsize=2)
def _probe(bucket):
    docker=shutil.which('docker')
    if not docker:return False
    try:
        result=subprocess.run([docker,'image','inspect','pyquest-sandbox:1','--format','{{.Id}}'],
                              capture_output=True,text=True,timeout=3,check=False)
        return result.returncode==0 and result.stdout.strip().startswith('sha256:')
    except (OSError,subprocess.TimeoutExpired):return False


def sandbox_available():
    return _probe(int(time.monotonic()//30))
