# PYQUEST AI VISUAL EXPLANATION REPORT

**Retired on 11 October 2026 at the user's request.** AI image generation, its question form, provider controls, production image cache, adapters, dedicated tooling and Vault entry points have been removed. The studio now provides curated interactive diagrams only. Character artwork, concept cards, coding, Groq challenge generation and rewards remain intact. The implementation records below are historical. Removal QA: four native page tests and all 79 frontend tests passed; actual desktop/mobile browser checks passed all eight diagrams, draft preservation, navigation and unchanged rewards.

Verified locally on 11 October 2026. Project: `C:\Users\mdabd\Desktop\pyquest_streamlit_edition`. Original `pyquest_v2` remains read-only.

## Current update — Cloudflare integration

Cloudflare Workers AI is now selected when the provided `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are configured; explicit `PYQUEST_IMAGE_PROVIDER=cloudflare` can also select it. Hugging Face remains available only through explicit selection, with its original cached data retained. There is no automatic fallback between providers.

`edition/cloudflare_images.py` uses the documented `@cf/black-forest-labs/flux-1-schnell` REST model route, one POST with four steps, a 60-second timeout, bounded response size, strict Base64 decoding and Pillow validation. The model's documented parameters do not include width/height, so those are not invented or sent. Cloudflare images have separate cache identities from Hugging Face images.

Live status: Cloudflare token verification returned active (HTTP 200). One real FLUX request returned HTTP 401; a subsequent read-only Workers AI model-list request returned HTTP 403, error code 10000, for the configured account. Token policy inspection was also forbidden, so the exact missing scope/account mismatch could not be established. Check Account → Workers AI → Read and that the token's selected account matches `CLOUDFLARE_ACCOUNT_ID`. One Groq explanation was successfully prepared and saved. No Cloudflare image success is claimed, no image retry occurred, and no paid-provider fallback occurred. `docs/live-image-verification.json` now records the Cloudflare attempt; the preceding Hugging Face HTTP 402 is historical evidence described below.

Fresh regressions: **154 Python tests run — 152 passed, two Docker skips, zero failures; 79 frontend tests passed.** Actual desktop/mobile browser QA confirmed Cloudflare selection, persisted authorization error, explanation preservation, no Hugging Face charge checkbox, mobile layout fit, and zero JavaScript errors. The browser made zero generation requests. Evidence: `docs/cloudflare-browser-results.json`; screenshots: `qa-artifacts/cloudflare-desktop.png`, `qa-artifacts/cloudflare-mobile.png`.

Cloudflare includes a daily free allowance on its Free plan; paid accounts may incur charges beyond their allowance. The app does not claim unlimited free generation or verify the account's billing plan. Keep the Cloudflare account on its Free plan for a hard provider quota stop. The existing ten-new-requests/hour local limit remains in place. Official references: [model API](https://developers.cloudflare.com/workers-ai/models/flux-1-schnell/), [pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/), [token permissions](https://developers.cloudflare.com/workers-ai/get-started/rest-api/).

Original snapshot check: 248 of 249 files match; `README.md` differs from the historical snapshot and has a modification time predating this Cloudflare implementation. Original source code and assets match. No original-project file was edited or reverted by this integration.

## Implemented

- Integrated AI Visual Learning Studio, with arbitrary programming questions, suggestions, structured Groq explanations, exact labels rendered separately from imagery, zoom, image download, and follow-up preparation.
- Exact requested model: `black-forest-labs/FLUX.1-schnell`. Official Hugging Face SDK; explicit Nscale route by default. No automatic alternate model.
- Cache-first real LangGraph workflow, SQLite persistence, UUID image filenames, validated Pillow responses, atomic PNG writes, concurrent reservation deduplication, saved explanations on inference failure, explicit regeneration and interrupted-request reconciliation.
- Vault “Explain Visually” prefills the studio without submitting a request.
- All eight deterministic interactive diagrams retained. Toolkit questions also show curated definitions explaining overlapping module/package/library/framework roles, including namespace packages.
- Native studio reuses the unchanged `CompanionController` through an inline Streamlit v2 component. Timers and observers are disposed on removal. Actual requests trigger Thinking; completed requests trigger Happy; failures trigger Motivating. Approved assets and state priorities remain unchanged.
- New generation limited to ten reservations per hour across the local cache, persisted across restarts. Cache reads do not consume this budget. Provider costs require acknowledgement. Paid generation remains disabled for cloud/remote sessions.

## Retired video generation

The active page no longer imports the video workflow/provider or offers submission and polling buttons. `video_cache.db` and its records were not deleted. Legacy `edition/video_*.py`, reconciliation tooling and tests remain isolated for historical data compatibility. The independently curated local toolkit animation remains educational content; it is not provider-generated video. The previous visual-studio report describes the superseded video implementation.

## Architecture and graph

`edition/image_learning.py` owns the Pydantic schema, cache, planner, provider adapter and separate StateGraph. The challenge generator and grading/reward engine are unchanged.

```text
START → ValidateQuestion → NormalizeQuestion → CheckImageCache
Hit → LoadCachedImage → RenderResult → END
Miss → AnalyzeQuestionWithGroq → ValidateExplanation → BuildVisualPrompt
     → GenerateImageWithHuggingFace → ValidateImage → SaveImage
     → SaveCacheRecord → RenderResult → END
Any provider/validation failure → RenderResult → END
Unrequested/pending/limited request → RenderResult → END
```

Completed cache hits make zero Groq and image-generation calls. Explicit retries reuse a valid saved explanation. Missing or corrupt image files become invalid; the learner must explicitly regenerate. A synchronous request interrupted by process death remains reserved rather than silently duplicating a possible paid request. After confirming the prior request ended, an operator can run `scripts/reconcile_image_request.py --cache-dir PATH --record-id ID --confirm-request-ended`; this helper makes no provider calls.

## SQLite schema and files

Default database: project-root `image_cache.db`; images: `generated_visuals/<uuid>.png`. Both are ignored by Git. `PYQUEST_IMAGE_CACHE_DIR` can select a durable directory. Connections close explicitly, including on Windows exceptions.

`generated_images`: `id`, `normalized_question`, `concept_key`, `prompt_version`, `model`, `provider`, `image_path`, `explanation_json`, `created_at`, `updated_at`, `status`, `error_state`, `reservation`.

Unique key: `(normalized_question, prompt_version, model, provider)`. Normalization uses Unicode NFKC, case folding and whitespace folding. The concept key is a SHA-256 hash. A second `image_request_budget(started_at)` table persists the hourly request budget. Reservations use `BEGIN IMMEDIATE`. Cache output paths must resolve directly beneath the managed image directory. No question text becomes a filename, and no credential is stored in cache records.

## Provider configuration and status

Existing Groq configuration is reused; challenge prompts are untouched. Hugging Face client version: `huggingface-hub==1.33.0`. Inference requests are bounded to one 768×512 image, four steps, a 60-second client timeout and no application retry loop. Public provider mapping was successfully retrieved for the exact requested model: Nscale, fal-ai and Wavespeed reported live; Together and DeepInfra reported error. Availability is checked again before each actual image request. This metadata check is not evidence of successful image inference.

**Update, 11 October 2026: HF_TOKEN is now configured and authentication is accepted.** One real workflow request successfully obtained a Groq explanation, then the exact FLUX/Nscale image request returned HTTP 402 (Payment Required). No image was generated, no alternative model was substituted, and no automatic retry occurred. The validated explanation remains saved for an explicit retry after account billing/inference credits are resolved. Evidence: `docs/live-image-verification.json` (one Groq call, one image call). Existing server configuration:

After this live failure, the UI was updated to distinguish billing errors from rate limits and show persisted errors on cache-only page loads. All 28 image regression tests passed after the update.

```dotenv
# C:\Users\mdabd\Desktop\pyquest_streamlit_edition\.env
HF_TOKEN=your_hugging_face_token
HF_INFERENCE_PROVIDER=nscale
PYQUEST_IMAGE_MODEL=black-forest-labs/FLUX.1-schnell
```

The token has passed authentication; another token is not indicated by the HTTP 402 result. Resolve inference credits/billing in the Hugging Face account before retrying. Provider charges are not assumed free or unlimited. Successful real image generation, cache reuse of that real image and visual inspection remain pending.

Official references: [Hugging Face inference client](https://huggingface.co/docs/huggingface_hub/en/guides/inference), [provider pricing](https://huggingface.co/docs/inference-providers/pricing), [requested model](https://huggingface.co/black-forest-labs/FLUX.1-schnell).

## QA evidence

- Frontend regression: 79 passed, zero failed or skipped. Existing animator/controller priorities and celebration assertions preserved.
- Python full regression: 147 tests run, 145 passed, two Docker-dependent tests skipped, zero failures. Counts are recorded in `ai-image-python.log`. A subsequent real SDK metadata check found the provider mapping is a list in version 1.33.0; the adapter was corrected and a regression using the actual SDK mapping type added. All 27 image tests then passed. Image-specific tests include normalization, arbitrary questions, invalid Groq output, timeout/rate errors, missing key, cache hits with zero calls, one image per miss, concurrency, restart, missing files, exact-model routing, persistent request caps, and a mocked native query lifecycle without reward changes.
- Actual Edge/Playwright gameplay-to-studio QA passed: incorrect attempts and supportive feedback, correct celebration, Vault search/reveal/empty states, all eight diagrams, stack/queue ordering, independent OOP state, mobile layout, most recent code draft retained through navigation, no reading rewards, no replayed celebration/reward. Evidence: `docs/visual-studio-browser-results.json`.
- Actual image-cache browser QA passed: cache display, explicit cache-hit message, zoom, PNG download, follow-up prefill, Vault prefill without automatic generation, 390px mobile fit, zero JavaScript errors. Evidence: `docs/image-cache-browser-results.json`. This run used a conspicuously labelled isolated mock fixture, not FLUX artwork or live inference.
- Fresh companion browser QA passed: natural blink and return to Idle, syntax-error Motivation, successful Run Happy feedback without premature celebration, correct-answer celebration, Review Concept draft preservation, and zero JavaScript errors. Evidence: `docs/companion-foundation-browser-results.json`.
- Original-source integrity: 249 checked files unchanged. Evidence: `docs/original-integrity-result.json`.
- Docker daemon connection fails because `dockerDesktopLinuxEngine` named pipe is absent. Live Docker execution/image verification remains an environmental blocker. Fail-closed routing is unchanged.

## Screenshots

Desktop and mobile screenshots below are actual browser captures. Mock-cache captures are labelled test fixtures and must not be presented as real generated artwork.

![Studio desktop](C:/Users/mdabd/Desktop/pyquest_streamlit_edition/qa-artifacts/visual-studio-desktop.png)
![Studio mobile](C:/Users/mdabd/Desktop/pyquest_streamlit_edition/qa-artifacts/visual-studio-mobile.png)
![Mock cache desktop](C:/Users/mdabd/Desktop/pyquest_streamlit_edition/qa-artifacts/image-cache-desktop.png)
![Mock cache mobile](C:/Users/mdabd/Desktop/pyquest_streamlit_edition/qa-artifacts/image-cache-mobile.png)

## Local URL and remaining limitations

Production local URL: http://127.0.0.1:8501/ — health and page both verified HTTP 200. Studio: http://127.0.0.1:8501/visual-studio. Launch: `.\.venv\Scripts\python.exe -m streamlit run app.py --server.address=127.0.0.1 --server.port=8501`. Port 8503 is the isolated QA session using mock challenges and separate storage.

Pending: successful live Hugging Face generation and visual inspection after resolving HTTP 402 billing, actual credit/cost confirmation, and Docker live tests. Schema validation does not establish factual correctness of arbitrary AI-planned explanations; curated diagrams remain the deterministic reference. FLUX imagery is illustrative, with all technical labels/code outside the generated bitmap. Follow-ups prepare a new contextual question; they do not submit automatically. Anonymous profiles retain the existing session identity behavior. Public paid generation, multi-user authorization/quotas and external durable cloud storage are intentionally not enabled. Local SQLite/image files are not claimed to survive ephemeral cloud redeployments.
