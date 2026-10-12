"""Export every existing LangGraph diagram without invoking workflow nodes."""
import sys
from pathlib import Path
from tempfile import TemporaryDirectory
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from edition.service import LearningService

def main():
    docs=ROOT/'docs';docs.mkdir(exist_ok=True)
    with TemporaryDirectory() as temp:
        learning=LearningService(Path(temp)/'learning')
        graphs={
            'pyquest-question-workflow':learning.engine.graph.builder.compile(),
        }
        for name,workflow in graphs.items():
            diagram=workflow.get_graph()
            (docs/(name+'.mmd')).write_text(diagram.draw_mermaid(),encoding='utf-8')
            (docs/(name+'.png')).write_bytes(diagram.draw_mermaid_png())
            print('Saved:',docs/(name+'.png'))
    (docs/'WORKFLOW_IMAGES.md').write_text(
        '# PyQuest LangGraph workflow images\n\n'
        'These diagrams are exported from the actual compiled graph structures. No graph nodes or provider jobs were executed.\n\n'
        '## Active question-generation workflow\n\n![Question generation](pyquest-question-workflow.png)\n\n'
        'Answer evaluation uses CheckAnswerService, a deterministic Python pipeline, and is not a LangGraph graph.\n',encoding='utf-8')
if __name__=='__main__':main()
