"""Launch the standalone PyQuest Streamlit Edition from the student dashboard."""

import os
from urllib.parse import urlparse

import streamlit as st


LOCAL_PYQUEST_URL = "http://127.0.0.1:8501/"


def _setting(name: str, default: str = "") -> str:
    value = os.getenv(name)
    if value:
        return value.strip()
    try:
        value = st.secrets.get(name, default)
    except Exception:
        value = default
    return str(value).strip() if value else default


def _is_hosted() -> bool:
    deployment = _setting("PYQUEST_DEPLOYMENT").lower()
    return deployment in {"cloud", "hosted", "production"}


def _is_local_url(url: str) -> bool:
    parsed = urlparse(url)
    return parsed.hostname in {"127.0.0.1", "localhost", "::1"}


def _valid_url(url: str) -> bool:
    parsed = urlparse(url)
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


def render_coding_lab() -> None:
    """Render the configured PyQuest app without coupling it to HCL auth."""
    app_url = _setting("PYQUEST_APP_URL")
    hosted = _is_hosted()

    st.title("PyQuest Coding Lab")
    st.caption("Learn the concept. Solve the challenge. Build your Python confidence.")

    if not app_url:
        if hosted:
            st.warning(
                "PyQuest is not configured for this hosted deployment. "
                "Set PYQUEST_APP_URL to the public PyQuest Streamlit URL in "
                "Streamlit Cloud secrets, then reboot InternNexus."
            )
            return
        app_url = LOCAL_PYQUEST_URL

    if not _valid_url(app_url):
        st.error("PYQUEST_APP_URL must be a complete HTTP or HTTPS URL.")
        return

    if hosted and _is_local_url(app_url):
        st.error(
            "The hosted InternNexus app cannot open a localhost PyQuest URL. "
            "Deploy PyQuest publicly and set PYQUEST_APP_URL to that HTTPS URL."
        )
        return

    embed_url = app_url + ("&" if "?" in app_url else "?") + "embed=true"
    st.iframe(embed_url, height=900)
    st.link_button("Open PyQuest", app_url, use_container_width=True)
