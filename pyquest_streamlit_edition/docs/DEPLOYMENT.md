# Streamlit Community Cloud deployment

No public app or backend has been deployed. These steps prepare an actual secure
deployment; service/account credentials and a durable backend host are required.

## 1. Provision the external backend

Use one Linux service process with a persistent volume, for example mounted at
`/var/lib/pyquest`. This volume holds both `pyquest.db` and its `.checkpoints.sqlite`
file. Do not use an ephemeral container directory or a shared/network SQLite file
across multiple workers. Configure private environment variables:

```text
PYQUEST_DATA_DIR=/var/lib/pyquest
PYQUEST_BACKEND_SECRET=<cryptographically random secret of at least 32 characters>
PYQUEST_BACKEND_PORT=8770
GROQ_API_KEY=<private key>
GROQ_MODEL=openai/gpt-oss-120b
```

Install the pinned dependencies, then start:

```bash
python -m edition.remote_server
```

It listens on **loopback**; expose it only through an HTTPS reverse proxy that
applies appropriate access controls, body limits, rate limits, and timeouts.
`GET /healthz` reveals only status. `POST /v1/action` requires a valid expiring
learner-scoped HMAC token. The browser never calls this API directly.

On a supported backend host, build `pyquest-sandbox:1` from `sandbox/` and verify
Docker restrictions before enabling advanced demos. Docker is never built or
pulled on demand. Missing Docker/image fails closed. Beginner AST execution stays
bounded; advanced source never falls back to the host interpreter. Host hardening
and actual public ingress security have not been audited/deployed here.

Back up both databases consistently while requests are paused, or implement an
SQLite-aware backup procedure. Restart the service and verify the same authenticated
learner's draft/progress and graph checkpoint before treating storage as durable.

## 2. Configure real identity

Register the Streamlit app with an OIDC provider. Set the redirect URL to
`https://<your-app>.streamlit.app/oauth2callback`. Use the provider's actual client
ID/secret and discovery URL. `st.login` validates identity; no homemade password
gate is used. A subject is namespaced by issuer so different providers cannot
collide. Generate a separate stable `PYQUEST_IDENTITY_SECRET`; changing it changes
derived profile identities.

## 3. Prepare GitHub

Review `.gitignore` and confirm `.env`, secrets.toml, data files, QA output, and
`.venv` are excluded. The local Git repository is initialized, but no commit,
remote push, or account connection is assumed. Push only after inspecting what
will be published. No original private learner data is included.

## 4. Community Cloud configuration

Select this repository, Python 3.12, and entrypoint **app.py**. Set Cloud secrets:

```toml
PYQUEST_DEPLOYMENT = "cloud"
PYQUEST_BACKEND_MODE = "remote"
PYQUEST_BACKEND_URL = "https://your-real-backend.example"
PYQUEST_BACKEND_SECRET = "same-secret-as-backend-at-least-32-random-characters"
PYQUEST_REQUIRE_AUTH = "true"
PYQUEST_IDENTITY_SECRET = "separate-stable-random-secret-at-least-32-characters"

[auth]
redirect_uri = "https://your-app.streamlit.app/oauth2callback"
cookie_secret = "separate-long-random-cookie-secret"
client_id = "your-provider-client-id"
client_secret = "your-provider-client-secret"
server_metadata_url = "https://accounts.google.com/.well-known/openid-configuration"
```

Keep Groq credentials on the external backend, not the cloud frontend. The normal
remote client requires HTTPS, validates certificates, and rejects redirect-based
credential forwarding. Explicit cloud mode refuses local backend execution.
Without a connected backend, preview mode displays static lessons and disables
completion/challenge actions rather than claiming durable progress.

Anonymous remote demo mode is available when `PYQUEST_REQUIRE_AUTH=false`; it
uses fresh random per-connection training identities, not private signed-in user
records. It is clearly labeled and cannot resume an authenticated profile.

## 5. Verify after deployment

Verify the actual URL, real OIDC sign-in/logout, token authorization/isolation,
Concept → Run → Check → Review → Continue, reward replay, purchases, and mobile
layout. Restart the Streamlit frontend and the backend independently; confirm
authenticated learner records and checkpoints survive. If secure execution fails,
confirm there are no graded attempts/rewards. This project does not report a
verified public URL until those deployment actions actually happen.
