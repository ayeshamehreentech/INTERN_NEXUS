# PyQuest backend on Render

Create a Docker Web Service from INTERN_NEXUS, branch main.
Dockerfile path: pyquest_streamlit_edition/deploy/Dockerfile
Docker build context: repository root.
Health check: /healthz. Ingress listens on port 8080.

Attach a persistent disk at /var/lib/pyquest. This requires a disk-capable plan; do not use ephemeral storage for learner records.
Set PYQUEST_DATA_DIR=/var/lib/pyquest and PYQUEST_BACKEND_PORT=8770.
Set private GROQ_API_KEY and a random PYQUEST_BACKEND_SECRET of at least 32 characters.

Then set Streamlit secrets: PYQUEST_DEPLOYMENT="cloud", PYQUEST_BACKEND_MODE="remote", PYQUEST_FRONTEND="original", PYQUEST_BACKEND_URL=<public HTTPS backend URL>, PYQUEST_BACKEND_SECRET=<same signing secret>.

This Render container does not supply a nested Docker daemon. Advanced challenges requiring pyquest-sandbox:1 remain unavailable and fail closed. Full advanced gameplay requires a properly provisioned Docker-capable Linux host. No host execution fallback is enabled.

The persistent disk stores both business records and LangGraph checkpoints. Use a single service instance for SQLite. Verify persistence after restart before claiming durable gameplay.
