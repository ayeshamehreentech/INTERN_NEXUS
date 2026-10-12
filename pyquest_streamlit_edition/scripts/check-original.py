"""Read-only verification of original source against the pre-build snapshot."""
import hashlib
import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
source=Path('C:/Users/mdabd/Desktop/pyquest_v2')
snapshot=json.loads((root/'docs/original-source-integrity.json').read_text())
changed=[name for name,digest in snapshot.items() if not (source/name).is_file() or hashlib.sha256((source/name).read_bytes()).hexdigest()!=digest]
result={'files_checked':len(snapshot),'changed_files':changed,'original_source_unchanged':not changed}
(root/'docs/original-integrity-result.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result))
if changed:raise SystemExit(1)
