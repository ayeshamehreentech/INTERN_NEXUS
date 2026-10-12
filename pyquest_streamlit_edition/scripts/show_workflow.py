"""Display the actual PyQuest question-generation graph in VS Code Interactive."""
# %%
import sys
from pathlib import Path
from tempfile import TemporaryDirectory

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from edition.service import LearningService

with TemporaryDirectory() as folder:
    service = LearningService(folder)
    workflow = service.engine.graph.builder.compile()
    png = workflow.get_graph().draw_mermaid_png()
    destination = ROOT / "docs" / "pyquest-question-workflow.png"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(png)
    try:
        from IPython.display import Image, display
        display(Image(png))
    except ImportError:
        pass
    print(f"Workflow image saved to: {destination}")
