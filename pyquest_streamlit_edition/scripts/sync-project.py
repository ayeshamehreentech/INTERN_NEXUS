"""Development sync, restricted to the explicitly requested new project."""
import shutil
from pathlib import Path
source=Path('C:/Users/mdabd/Documents/Codex/pyquest-edition-build')
target=Path('C:/Users/mdabd/Desktop/pyquest_streamlit_edition')
assert target.resolve()==Path('C:/Users/mdabd/Desktop/pyquest_streamlit_edition').resolve()
for path in source.rglob('*'):
    if not path.is_file() or path.name=='bootstrap.py' or '__pycache__' in path.parts:continue
    destination=target/path.relative_to(source)
    if destination.is_file() and destination.read_bytes()==path.read_bytes():continue
    destination.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(path,destination)
print('Synced new edition files; original project untouched.')
