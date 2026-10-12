# Original PyQuest UI in Streamlit

The default presentation now reuses the original PyQuest HTML, CSS, and JavaScript
in an inline Streamlit Custom Component v2. This includes world-map pagination,
the coding terminal, Character Studio, Resources, Cheat Sheet, progress, and
settings. The original app at port 8766 is not embedded or required.

`edition/original_ui.py` translates original endpoint names to LearningService
calls and returns public results through scoped component callbacks. Learner
identity stays server-side. Request IDs are deduplicated. Grading, rewards,
purchases, Docker policy, and LangGraph checkpoints remain backend responsibilities.

`edition/ui/app.bundle.js` is checked in. To rebuild it after frontend changes,
run `python scripts/build_original_ui.py`; development rebuilding uses Node and
esbuild 0.28.2. Normal app startup needs no Node bundling. The transformations are
transport replacement, public asset URL remapping, and support for deliberately
empty saved drafts. Failed-image events are scoped to the component shadow root
so outfit thumbnails retain their original fallback. Restart Streamlit after
rebuilding the bundle. CharacterAnimator and its state priorities are unchanged.
Missing frames use the original static fallbacks; no artwork was regenerated.

Streamlit static serving is enabled for copied public artwork. Only image assets
and public JSON manifests are prepared in `static/assets`. That generated directory
and the user's requested copied `.env` are Git-ignored. Blank data paths fall
back to the edition's own data directory.

`app.py` skips UI rendering when Windows imports it as `__mp_main__` in a spawned
execution worker. This avoids unnecessary UI startup without changing execution
deadlines. Native pages remain available with `PYQUEST_FRONTEND=native`; cloud
preview uses them until the external backend is configured.

Fresh regression: 97 Python tests, 95 passed, 2 Docker-dependent skips; 69 frontend
tests passed. Browser Studio checks verified Nova/Explorer selection, expression
controls, save/return persistence, resources, and mobile layout without overflow
or JS errors. Final browser QA verified all five companions, both outfits,
expression controls, and a deliberately failed frame's stage and thumbnail
fallbacks. Full mock gameplay passed Run, Check, feedback, rewards, Review,
Continue, empty draft preservation, and Next, with no mobile overflow.

Live Groq generated a challenge, returned feedback, and preserved the draft
through review. Its subsequent Next request was blocked by HTTP 429 and displayed
the quota message. A small provider request was accepted, confirming valid
credentials. No successful final live Next is claimed. Evidence is in
`original-ui-flow-results.json`, `original-ui-browser-results.json`, and
`original-ui-live-results.json`; the sanitized operator probe is in the local
`provider-quota.log`.

All 249 audited original project source/assets remain unchanged. Docker remains
unavailable in this environment; public deployment and real OIDC sign-in remain
unverified.
