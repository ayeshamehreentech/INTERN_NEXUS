# PyQuest Streamlit Edition

An independent Python learning application built around the existing tested
PyQuest engine. Fourteen canonical worlds, 113 static Concept Cards, real
LangGraph/Groq generation, bounded beginner execution, deterministic grading,
SQLite progress, drafts, coin purchases, and checkpoint isolation.

The default interface reuses the original PyQuest V2 frontend inside a Streamlit
Custom Component v2: world maps, coding terminal, Character Studio, Resources,
Cheat Sheet, progress, settings, and the existing character animator. Its actions
call this edition's Python backend through scoped callbacks. Port 8766 and the
original checkout are not runtime dependencies. Public artwork is prepared in
`static/assets`; private configuration is never served.

Set `PYQUEST_FRONTEND=native` for the native-widget alternative. Cloud preview
uses that alternative until a secure external backend is configured. At the
user's explicit request, the working configuration is in the Git-ignored `.env`.

## Local run

Python 3.12 was verified. From this directory:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
# Set GROQ_API_KEY in a private .env or .streamlit/secrets.toml.
.\.venv\Scripts\python.exe -m streamlit run app.py --server.address=127.0.0.1 --server.port=8501
```

Open http://127.0.0.1:8501/. Without a Groq key, all lessons remain readable;
generation fails with an accurate retry message instead of a static exercise.
Normal operation never imports a mock provider. A clearly labeled, isolated QA
server can be started with:

```powershell
.\.venv\Scripts\python.exe scripts/verify_streamlit.py --mock --port 8502
```

Local anonymous use is a training demo, not login. A random profile is scoped to
the browser connection. Its records/drafts are persisted in SQLite and survive
reruns/service restarts, but a new browser connection gets a new profile. Configure
OIDC for durable identity across reconnects; no original learner database is imported.

## Learning flow

Home → World/subtopic → Concept → Start challenge → Python editor → Run → Check
→ Feedback → Review concept → Continue challenge. A code draft, including an
intentionally empty draft, survives reruns and review. Start resumes an active
question; Next explicitly requests a new generated question. Lesson completion
never awards XP/coins/mastery. Solution purchases require confirmation and use
the original idempotent ledger and difficulty price.

## Execution and storage

Worlds 1–8 use the original bounded AST interpreter. This is a supported Python
subset, not an OS sandbox. Worlds 9–14 require the existing isolated Docker
runner; there is no host Python fallback. If Docker is available, build only the
supplied sandbox context:

```powershell
docker build --pull -t pyquest-sandbox:1 sandbox
```

Local files: `data/pyquest.db` and `data/pyquest.db.checkpoints.sqlite`.
Both are ignored by Git. Execution failure does not award rewards or create a
graded attempt. The frontend never determines correctness or computes rewards.

## Cloud deployment

Community Cloud's filesystem is ephemeral. Use remote mode: an authenticated
external learning service owns **both** the learner SQLite database and official
LangGraph SQLite checkpoints on a durable cloud volume. The Streamlit process
only sends scoped authenticated actions and renders public results. Public/default
bindings without configuration render a restricted lesson preview. Explicit cloud
configuration cannot enable the local execution path.

See [deployment instructions](docs/DEPLOYMENT.md). Real OIDC support uses
`st.login`, `st.user`, and `st.logout`; a provider registration and secrets are
required. No public deployment or configured OIDC account is claimed.

## Tests

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests -p '*.py'
npm test -- --test-reporter=spec
# Only when Docker and the sandbox image are available:
$env:PYQUEST_LIVE_SANDBOX_TESTS = '1'
.\.venv\Scripts\python.exe -m unittest discover -s tests -p '*.py'
```

Inherited Python/frontend regression fixtures remain under `tests/`, `web/`,
`main.py`, and `tools/validate-character-assets.mjs`. The Streamlit interface uses
`app.py`, `app_pages/`, and `edition/`, rather than the copied JavaScript UI.
AppTest covers all 113 native lesson views. `scripts/browser-smoke.cjs` verifies
real desktop/mobile rendering with the operator's bundled Playwright and Edge;
replace its machine-specific require path if running on another machine.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Interview guide](docs/PYQUEST_STREAMLIT_INTERVIEW_GUIDE.md)
- [Verified final report](docs/PYQUEST_STREAMLIT_FINAL_REPORT.md)

The original `pyquest_v2` source is not modified. `scripts/check-original.py`
compares its audited public source/assets against the pre-build hash snapshot.
