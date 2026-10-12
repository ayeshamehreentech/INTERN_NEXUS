# PYQUEST VISUAL LEARNING STUDIO REPORT

Verified 9 October 2026 in `C:\Users\mdabd\Desktop\pyquest_streamlit_edition`.

## Completed features

### Companion integration

The completed `web/companion-controller.js` is preserved. Existing request lifecycle reactions, natural blinking, approved assets and animation priorities remain in place. Repeated difficulty now uses actual recent attempt history, scoped to the current subtopic and reset by a successful attempt. After two recent failed attempts, the companion suggests tracing an example, comparing input/output, making one change, reviewing the concept or requesting a hint. Native practice also supplies a concept-specific common mistake.

The repository has no learner chat/query interface. No new chat endpoint or simulated LLM activity was introduced. The existing controller query hook remains available. Run and deterministic checking use accurate status messages; successful Run does not imply challenge correctness or award rewards.

Cross-page component disposal stops companion timers, removes document/window listeners, closes any active celebration, disables local audio, and clears pending UI requests. Stale request handlers retain the existing route-epoch guards. Browser QA verifies that the old component is disposed when entering a native page.

### Pythonist Pro-Tips Vault

A native Streamlit page in the same app contains 20 searchable, category-filtered tips:

- VS Code shortcuts, with platform differences and keymap/formatter caveats.
- Python syntax techniques with executable examples and revealable expected outputs.
- Module, package, library/lib, and framework explanations, plus the existing local toolkit animation.
- Generators, mutable default arguments, equality/identity, shallow copies, exception handling and type-hint best practices.

Content is curated and deterministic. Reference buttons point to [VS Code's shortcut reference](https://code.visualstudio.com/docs/reference/default-keybindings), the [Python tutorial](https://docs.python.org/3.12/tutorial/), and relevant library documentation. Reading, searching and revealing tips award no XP, coins or mastery.

### Visual Learning Studio

A native Streamlit page offers eight areas with deterministic controls:

1. Binary integers: change a value and inspect powers-of-two contributions.
2. Bitwise operations: AND, OR, XOR and bounded shifts; Python complement semantics are explained.
3. Memory references: aliasing, mutation and rebinding using symbolic object labels rather than invented addresses.
4. Stack/queue operations: add, remove and reset; compare LIFO/FIFO behavior.
5. Sorting: inspect bubble-sort and insertion-sort snapshots, including duplicates.
6. Binary search: change a target, inspect the interval/midpoint, and handle missing values or a one-step match.
7. Recursion: factorial calls, base case and returns, bounded to small nonnegative inputs.
8. OOP: independent instance state plus inheritance, polymorphism and encapsulation explanations.

The video section loads a cached completed video when available. Without a configured provider it accurately labels generation unavailable and keeps all diagrams usable. Opening or changing a concept never submits a job.

## Integration and preservation

The pages use `st.Page` and `st.page_link` in the existing app. The original presentation remains the Adventure page; the native-widget fallback also registers both new pages. They share the same learner session, backend and draft store.

Browser QA found and fixed a blur-save/page-navigation race. `web/draft-saver.js` coalesces identical saves and serializes subsequent edits. Native page navigation waits for the latest draft save before continuing. This preserves a just-edited draft, not merely the last checked submission. A missing component registration across runtimes was fixed by registering the existing component inside its render function.

All 14 worlds and 113 concept cards remain. Byte/Kai Classic-only studio selection is preserved; the five approved character identities and assets remain. Correct-answer celebrations, grading, reward formulas, purchases, mastery, checkpointing and secure execution routing are unchanged. This feature adds no reward pathway.

## Architecture

```text
app.py
 ├─ Adventure: existing inline component + learning backend
 ├─ Pro-Tips Vault: curated content + native widgets
 └─ Visual Learning Studio
      ├─ deterministic interactive diagrams
      └─ VisualWorkflow: real LangGraph StateGraph
           ├─ VideoCache: video_cache.db
           └─ optional FalVideoProvider: server-side HTTPS queue API
```

The new media graph is separate from the existing challenge graph. Each invocation is bounded: it reads, submits at most one reserved job, or polls an existing job once. Durable job recovery comes from SQLite rows; it does not modify the challenge checkpoint database.

### LangGraph nodes and routing

```text
START → Normalize → CacheLookup → ConditionalRoute

completed cache entry → LoadVideo → END

cache miss → Validate → Storyboard → SubmitJob → PersistPending
                                                   ↓
                                             Resume/Poll → SaveCompleted → END

saved pending/poll-error job + explicit status check → Resume/Poll
unconfigured provider, read-only request, existing reservation or terminal job → END
```

Normalize accepts only the eight curated concepts and canonicalizes case, whitespace, Unicode and separators. Storyboard uses reviewed deterministic scenes. Validate requires an explicit generation action and an available provider. Cache hits make zero provider calls, including when Generate/Check flags are supplied.

## SQLite schema and persistence

Database: `video_cache.db` at the project root by default. `PYQUEST_VIDEO_CACHE_DIR` can point to a persistent directory. The database and WAL files are Git-ignored.

```sql
CREATE TABLE generated_videos (
    id INTEGER PRIMARY KEY,
    concept_key TEXT NOT NULL,
    prompt_version TEXT NOT NULL,
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    status TEXT NOT NULL,
    job_id TEXT,
    video_location TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    error_state TEXT,
    provider_data TEXT NOT NULL DEFAULT '{}',
    reservation TEXT NOT NULL,
    UNIQUE(concept_key, prompt_version, provider, model)
);
```

WAL, parameterized statements, short transactions, and `BEGIN IMMEDIATE` reservations prevent concurrent duplicate submission for the same concept/version/provider/model. The prompt version is `pyquest-visual-v1`.

Persisted statuses include `submitting`, `pending`, `poll_error`, `completed`, `failed`, `submission_error`, and `submission_unknown`. Unconfigured/read-only misses do not create a job row. Provider data stores confirmed tracking URLs, never credentials, learner code or private grading fixtures.

### Failure recovery

- Poll failures retain the job ID; **Check saved job** resumes that job, never submits another. A successful poll clears the previous error state.
- Definitively rejected submissions without a job ID require **Retry rejected submission**. Normal reruns cannot resubmit them.
- Uncertain transport outcomes or a crash around submission remain reserved. There is no automatic lease expiry or blind resubmission that could create a second paid job.
- `scripts/reconcile_video_job.py` attaches a confirmed provider submit response from its dashboard without generating a job. It can also release an uncertain reservation for explicit retry after an operator stops in-flight requests and independently confirms that no job was accepted.
- Terminal failed jobs are not automatically recreated. A genuinely new reviewed prompt version is a separate cache identity.

Example reconciliation, using actual confirmed provider data:

```powershell
.\.venv\Scripts\python.exe scripts\reconcile_video_job.py `
  --database video_cache.db --concept binary_integer `
  --response-file confirmed-fal-submit-response.json
```

## Provider integration status

The optional adapter uses fal's documented asynchronous queue API, with the reviewed `fal-ai/kling-video/v3/standard/text-to-video` model, a 15-second duration, 16:9 aspect ratio and audio disabled. Submission returns a job ID and tracking URLs; the adapter polls status and fetches the result only after completion. Queue URLs are restricted to fal's HTTPS queue host; completed media locations are restricted to approved HTTPS media hosts. Credentials stay server-side. See the [fal queue documentation](https://fal.ai/docs/documentation/model-apis/inference/queue) and [model API schema](https://fal.ai/models/fal-ai/kling-video/v3/standard/text-to-video/api).

Enable optional local generation through private server configuration:

```dotenv
PYQUEST_VIDEO_PROVIDER=fal
FAL_KEY=your_private_fal_key
```

Do not commit credentials. Generation starts only through the explicit Generate button and may incur provider charges; it never spends PyQuest coins.

**Current verified configuration: no video provider configured. No paid video job was submitted and no provider-generated completed video is claimed.** HTTP request/response handling was tested with mock transports. Live video generation and generated-video educational quality remain unverified until credentials are configured and a real job completes. Remote/cloud learning modes keep paid generation disabled; persistent hosting would need an appropriate storage volume and server-side provider integration.

The cache stores the provider's completed video location, not a downloaded permanent copy. CDN retention/expiry can affect later playback. Provider-generated explanations should be reviewed for factual and visual accuracy; the curated diagrams are the deterministic reference.

## Actual test results

| Check | Result |
|---|---|
| Full Python regression | 120 tests: **118 passed, 2 Docker-dependent skips, 0 failures** |
| Final focused workflow/provider/content checks | **15 passed**, including recovery/error clearing; subset of the Python suite |
| Frontend regression | **79 passed, 0 failed, 0 skipped**; all previous 76 tests preserved |
| Curated examples | All tip examples with expected output executed and matched |
| Concurrency | 16 simultaneous requests across 8 workers submitted one job |
| Cache hit | Zero submit/poll calls; completed entries readable without credentials |
| Restart | A new cache/workflow/provider instance resumed the stored pending job with zero new submissions |
| Failure recovery | Poll error recovery, explicit rejected-submission retry, ambiguous/crashed-submission duplicate prevention |
| Native page tests | Search/empty states, all eight diagrams, one-step binary search, object independence and unchanged progress |
| Browser | Desktop and 390×844 mobile; search, reveal, empty state, all eight diagrams, stack/queue behavior and object independence passed |
| Fresh draft navigation | A new edit immediately before page navigation was saved and restored after both native pages |
| Companion | Natural blink/return, syntax motivation, successful Run reaction and recorded repeated difficulty passed |
| Cleanup | Previous component disposed; pending UI requests cleared when entering native pages |
| Rewards/celebration | Reading changes no rewards; repeated Check adds neither rewards nor modal; correct celebration, Escape/focus/background blocking and Continue-once regression passed |
| Kai/reduced motion | Approved static fallback and reduced-motion regression passed |
| Original repository | 249 public source/asset hashes checked; **no changes** |
| Local app health | HTTP **200**, body **ok** at port 8501 |

Browser gameplay uses an explicitly isolated mock question provider with actual execution, grading and reward services. Video-provider tests use fake jobs/mock HTTP; they do not demonstrate a real generated video. Live Groq generation was not rerun for this phase.

Logs/evidence: `visual-studio-python.log`, `visual-studio-frontend.log`, `visual-studio-focused.log`, `docs/visual-studio-browser-results.json`, `companion-foundation-browser-results.json`, `success-celebration-browser-results.json`, and `success-kai-browser-results.json`.

## Screenshots

- [Pro-Tips Vault desktop](../qa-artifacts/pro-tips-desktop.png)
- [Pro-Tips Vault mobile](../qa-artifacts/pro-tips-mobile.png)
- [Visual Learning Studio desktop](../qa-artifacts/visual-studio-desktop.png)
- [Visual Learning Studio mobile](../qa-artifacts/visual-studio-mobile.png)

## Remaining limitations and local URL

Docker is unavailable: the `dockerDesktopLinuxEngine` named pipe cannot be reached. The sandbox image and advanced live Docker tests remain unverified; the security policy still fails closed. The two Docker skips are environmental limitations, not application failures.

Live video-provider verification is pending credentials and a completed job. Anonymous demo profiles retain their existing per-session lifecycle; authenticated deployment and permanent video archiving are separate concerns. The requested local deterministic Vault/Studio experience and video-job workflow are implemented and verified.

Run from the existing project:

```powershell
.\.venv\Scripts\python.exe -m streamlit run app.py --server.address=127.0.0.1 --server.port=8501
```

[PyQuest](http://127.0.0.1:8501/) · [Pro-Tips Vault](http://127.0.0.1:8501/tips) · [Visual Learning Studio](http://127.0.0.1:8501/visual-studio)
