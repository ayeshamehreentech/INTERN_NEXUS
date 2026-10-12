# PyQuest Streamlit Edition — interview guide

This guide describes implemented repository code. Real public hosting, OIDC
provider registration, durable-volume provisioning, and advanced live Docker
verification are external dependencies, not completed deployment claims.

## 1. Project introduction

PyQuest connects concept study to actual coding practice. The independent
Streamlit edition preserves fourteen worlds and 113 structured lessons, then
uses the existing real AI generation, execution, grading, and persistence engine.
It demonstrates how to put an LLM inside a trustworthy learning workflow without
letting it become the authority for correctness or rewards.

## 2. Problem statement

Learners often move from a reference chart to a coding task without understanding
the concept. Fixed question banks become repetitive, while LLM-only grading can
invent outcomes. A useful application needs explanations, fresh practice,
deterministic evaluation, recoverable drafts, and honest runtime limitations.

## 3. Proposed solution

Static Concept Cards provide definitions, syntax, examples, expected output,
interactive controls, mistakes, and takeaways. A LangGraph workflow routes a
challenge request to the correct specialist, calls Groq through LangChain,
validates the candidate, and stores an approved generated question. Learner code
is executed through trusted capability routing and graded against fixtures.
Only the backend updates XP, coins, and mastery.

## 4. Target users

Beginners use worlds 1–8 for supported Python practice. More experienced learners
study data structures, algorithms, functions, and OOP in worlds 9–14; executing
those challenges requires the secure Docker backend. Interviewers can inspect
the orchestration, validation, security boundaries, and state design. Anonymous
profiles are explicitly training demos, not authenticated accounts.

## 5. Technologies used

| Layer | Actual implementation |
| --- | --- |
| Frontend | Streamlit 1.65.0, original PyQuest renderer in Custom Component v2; optional native pages |
| Language | Python 3.12.14 verified locally |
| Orchestration | LangGraph 1.2.11 StateGraph |
| LLM integration | langchain-groq 1.1.3; langchain-core 1.6.9 |
| Provider | Groq ChatGroq |
| Schema | Pydantic 2.13.5 GeneratedQuestion |
| Local data | SQLite Store |
| Graph state | Official SqliteSaver, langgraph-checkpoint-sqlite 3.1.1 |
| Execution | Bounded AST worker / isolated Docker runner |
| Cloud adapter | HTTPS HTTPX client and scoped expiring HMAC tokens |
| Optional sign-in | Native Streamlit OIDC APIs |
| QA | unittest, AppTest, Edge/Playwright browser smoke tests |

No vector store, RAG pipeline, React framework, or pretend multi-model agent
system was added. LangChain's provider/core packages supply the needed integration.

## 6. Complete architecture

`app.py` initializes safe configuration, identity, and five native pages. Pages
call `LearningService` directly in local mode. Remote mode uses `RemoteClient`
over authenticated HTTPS to an external service that owns the same backend and
durable databases. Preview mode renders static lessons without execution or
durable-completion claims. See `ARCHITECTURE.md` for the complete diagram.

Business SQLite and LangGraph checkpoints are separate files. A durable external
volume preserves both across Streamlit restarts. The remote service is a single
backend process; its locks do not pretend to provide distributed coordination.
The original checkout is never a runtime import dependency.

## 7. LangGraph workflow

`LearningEngine.__init__` builds an actual `StateGraph(LearningState)`:

START → load_learner_state → planner → supervisor → curriculum → performance
→ adaptive → selected world OR remediation → selected world → question_generator
→ question_guard → novelty_guard → persist_quest OR retry OR unavailable → END.

The supervisor selects one of fourteen specialist classes. Planner proposes a
plan; adaptation determines effective difficulty. Guard success routes to commit;
invalid candidates use bounded retries; permanent unavailability becomes a
recoverable error. The engine commits generated quest, active quest, session,
and history after graph success. State uses ordinary TypedDict replacement
semantics, not custom Annotated reducers. Runtime learner/curriculum context is
carried in state; the reused graph has no separate runtime-context schema.

## 8. AI agent responsibilities

Planner and AdaptiveAgent are deterministic policies. World agents build scoped
teaching context rather than independently calling fourteen models. RemediationAgent
provides a smaller-step message. QuestionGenerationService is the model entrypoint.
QuestionGuard checks schema, scope, leakage, novelty, and reference execution.
FeedbackAgent and score/suggestion helpers are deterministic. Their separation
makes the workflow testable and prevents a model from minting rewards.

## 9. One frontend-to-backend request

Start challenge marks the concept complete without rewards, then calls `start`.
`LearningService.call` validates identity/payload and confirms completion. A
learner/topic lock protects the active-session lookup: return a saved challenge
when present, otherwise delegate to `engine.start`. The real graph uses a stable
learner/session thread. The public result excludes private solution and hidden
fixtures. Streamlit prepares the draft and navigates to the coding page.

Remote requests carry the same action through `RemoteClient.call`. The token
contains opaque learner ID, expiry, and HMAC. The backend derives identity from
that verified token and rejects a client-supplied learner field. TLS protects
the request body; redirects are not followed with credentials.

## 10. Question generation

`LLMService.generate_question` calls ChatGroq with structured output conforming
to GeneratedQuestion. Context includes canonical world/topic, allowed concepts,
specialist scope, difficulty, style, and recent history. Private reference
solutions are not supplied as model context. Structured output is only the first
boundary: QuestionGuard executes the proposed private solution against fixtures
and rejects incorrect or unsafe tasks before they become active questions.
Provider errors and invalid candidates never become disguised static questions.

## 11. Deterministic grading

ExecutionRouter selects the trusted runtime using the catalog ID. CheckAnswerService
compares outputs and required constructs, then persists authoritative evidence.
The LLM is never the final judge. Run returns execution without awarding anything.

Original independent-success rules remain: 100 XP on attempt 1, 75 on attempt 2,
50 afterward; easy/normal/hard coin awards are 2/3/5. Mastery increments by
`0.15 / attempt_count`, multiplied by 0.7 when hints were used and capped at 1.
Question reward uniqueness and ledger event IDs prevent duplicate rewards.
Revealed solutions affect eligibility. Viewing/completing a lesson affects none
of these numbers. The original mastery policy also checks evidence thresholds.

## 12. Python execution security

Beginner source is parsed and interpreted by a bounded AST worker in a spawned
process, with source/node limits and a deadline. It is a Python subset, not an
OS security sandbox; some valid Python lesson examples are outside its supported
challenge subset. Unsupported syntax is rejected explicitly.

Worlds 9–14 require Docker even when submitted code is `pass`. Containers use
non-root identity, no network, read-only root, dropped capabilities,
no-new-privileges, CPU/memory/PID/output/time limits, and no host mounts or secrets.
Missing infrastructure fails closed. Check returns before business writes on an
infrastructure failure. Public cloud preview cannot generate or grade challenges.

## 13. SQLite versus cloud persistence

SQLite fits local use and a small single-worker external learning service.
Community Cloud disk is not assumed durable. Remote mode places business data
and official SQLite graph checkpoints on an operator-provisioned external durable
volume. Restart tests recover both a draft and `graph.get_state()` from that
directory. That verifies adapter behavior; backups, TLS ingress, and storage
retention still require provisioning. Managed PostgreSQL is a future migration,
not an implemented capability claimed here.

## 14. Streamlit Session State

Session State holds selections, per-question draft buffers, current session,
feedback, and pending operation receipts. Native widget keys with
`persist_state='session'` preserve edits across page changes. Backend drafts are
saved on commit/blur and before Run, Check, Review, and Next. The additive
edition_drafts table distinguishes a saved empty draft from untouched starter
code. Session State is temporary: authenticated identity plus durable backend
records supports reconnect recovery; anonymous demos start fresh on reconnect.

## 15. LangGraph checkpoints

PersistentGraph uses official SqliteSaver connections, compiles per operation,
and closes each connection. `learner_id + ':' + session_id` scopes the workflow.
Process-local striped locks serialize same-thread operations. Checkpoints store
orchestration state/history, not coin-ledger transactions. Different learners
cannot open each other's sessions. Multi-process scaling needs shared transactional
repositories and distributed coordination, not more claims about local locks.

## 16. Error handling

Transport retries are restricted to transient failures, with bounded backoff and
Retry-After handling. Guard regeneration is bounded separately. Pending operation
IDs survive an ambiguous network failure so retry does not duplicate the business
action. Errors do not clear the code editor. Configuration failures expose a safe
setup message rather than credentials. Callback navigation is deferred until
native pages are registered. No provider failure is presented as a successful
generated challenge.

## 17. Important functions

| Function | Responsibility |
| --- | --- |
| runtime.initialize | Safe mode, verified/demo identity, per-browser UI state |
| LearningService.call | Validated authoritative action boundary |
| public_session | Owned public question and exact draft semantics |
| remember | Restore the latest session for the same backend identity |
| action_operation | Reuse a receipt after ambiguous transport failure |
| LearningEngine.start / next | Actual graph invocation and persistence |
| question_guard | Context/leak/novelty/reference validation |
| ExecutionRouter.execute | Trusted runtime choice |
| CheckAnswerService.check_answer | Deterministic evaluation and transactions |
| rewards.transact | Idempotent coin ledger and balance protection |
| PersistentGraph._call | Official scoped checkpoints |
| client.verify_token | Expiry and constant-time scoped-token validation |
| visuals.visualize | Native interactive explanation without source execution |

## 18. Walkthrough using actual code

The adapter delegates to the existing engine rather than computing UI rewards:

```python
if action in ('run','check'):
    return self.engine.submit(identity, p['session_id'], p['question_id'], p['code'],
                              identity+':'+p['operation_id'], run=action=='run', inputs=p.get('inputs'))
```

The graph invocation uses a stable scoped thread:

```python
config={'recursion_limit':20,'configurable':{'thread_id':identity+':'+sid}}
```

The original checker gates persistence on execution availability:

```python
execution = ExecutionRouter().execute(question, code, fixtures)
if run or execution.get('status') in INFRASTRUCTURE_FAILURES or execution.get('infrastructure_failure'):
    return execution
```

Saved-draft identity is independent of whether its string is empty:

```python
saved = db.execute('SELECT 1 FROM edition_drafts WHERE learner=? AND session=?',
                   (identity, sid)).fetchone()
return dict(session_id=sid, question=q.public(), draft=row['draft'], draft_saved=bool(saved))
```

Read these in `edition/service.py`, `app/learning.py`, and
`app/check_answer_service.py`. Repository code remains the authority if this guide
is edited or the implementation changes.

## 19. Challenges and solutions

- Preserve the original: copy public source/assets independently, exclude secrets
  and learner data, then compare original hashes.
- Preserve rerun edits: stable per-question keys, a draft buffer, native widget
  persistence, and committed database drafts.
- Preserve empty drafts: explicit saved-draft metadata instead of truthiness.
- Handle replay: pending receipts plus authoritative original uniqueness/ledger rules.
- Handle cloud restart: external durable storage for both databases.
- Handle multipage callbacks: defer switches until st.navigation registers pages.
- Handle missing artwork: approved static frames/source crops, no fabricated animation.

## 20. Limitations and future improvements

Implemented: all lessons, native visual controls, real generation integration,
deterministic grading, hints/purchases/rewards, drafts, remote authenticated
transport, restart/isolation tests, OIDC configuration support, and cloud preview.

Required external services: Groq key, Docker/image for advanced execution, real
OIDC registration, durable backend host/volume, TLS ingress, and Cloud/GitHub
account configuration. Public deployment and real OIDC sign-in are not claimed
without those services. Static companion frames are intentional.

Future work: managed relational persistence/checkpoints, distributed locking,
account quotas, independent security audit, a richer editor, and more specialized
visual simulations. Those are distinct from the implemented core experience.

## 21. Interview questions and answers

1. **What makes this AI engineering?** Real structured generation is integrated
   with orchestration, validation, execution, persistence, and recovery. The model
   is a constrained subsystem, not the application authority.
2. **Why Streamlit?** It keeps UI development in Python and provides native
   interaction, state, testing, and hosting integration. Backend logic stays testable.
3. **Why LangGraph?** The workflow has conditional routing, validation, retries,
   and persisted state, which benefit from explicit nodes and edges.
4. **Are all agents LLMs?** No. Most are deterministic policies/context builders.
   One generation service calls ChatGroq.
5. **What does Supervisor do?** It validates world/topic consistency and selects
   one of fourteen actual specialist classes.
6. **What does Planner do?** It recommends an action, style, objective, and
   difficulty from evidence; AdaptiveAgent determines effective difficulty later.
7. **How does generation stay on topic?** Canonical IDs, allowed concepts, world
   scope, specialist context, and guard checks constrain the candidate.
8. **Does structured output guarantee validity?** No. Pydantic checks shape;
   QuestionGuard checks scope, leakage, novelty, and executable fixture behavior.
9. **Why execute a private reference?** A model can propose wrong expected outputs.
   Reference execution verifies candidate fixtures through the trusted runtime.
10. **How is the answer hidden?** GeneratedQuestion.public excludes solution,
    hidden fixtures, and private hint seed. Reveal requires a confirmed purchase.
11. **How is novelty checked?** Prompt similarity and normalized AST fingerprints
    reject near-duplicates. This is not semantic-equivalence proof.
12. **What happens when Groq fails?** Bounded transport/guard retries end in a
    recoverable error; no static task is disguised as AI generation.
13. **Who decides correctness?** Deterministic fixture/construct evaluation,
    rather than the model or character reaction.
14. **Why not unrestricted exec?** It would expose host capabilities. Beginner
    interpretation is bounded; advanced source requires isolated Docker.
15. **Can a model select a weaker runtime?** No. Trusted catalog IDs determine
    execution capability and the guard normalizes forged provider fields.
16. **What Docker restrictions apply?** No network/host mounts/secrets, non-root
    identity, read-only root, dropped capabilities, and resource/deadline limits.
17. **What if Docker is missing?** Advanced generation or execution fails closed;
    infrastructure failure does not create a graded attempt or reward.
18. **Can Run or a lesson award coins?** No. Only the authoritative Check pipeline
    can reward verified eligible independent success.
19. **How are duplicate rewards prevented?** Question reward uniqueness,
    idempotent ledger event IDs, and cached operation receipts.
20. **Why transactions?** Evaluation evidence, progress, and ledger writes must
    agree; UI reruns cannot partially award them independently.
21. **How is a solution purchased?** The backend uses the original price map,
    confirms balance, records an idempotent purchase, and marks the reveal.
22. **How do drafts survive reruns?** Keyed native persistence plus a separate
    per-question buffer and database draft actions.
23. **Why track empty drafts explicitly?** Empty text may be intentional and must
    not be overwritten by starter code.
24. **Why isn't Session State a database?** It is per-browser and temporary.
    Durable business and graph records belong to storage.
25. **What is the thread ID?** Opaque learner ID plus session ID; stable within
    the session, distinct between learners.
26. **Are checkpoints the ledger?** No. They persist orchestration; transactional
    business tables persist purchases, rewards, drafts, and learner progress.
27. **Is Cloud local disk durable?** It is not assumed durable. The external
    backend stores both database files on a provisioned persistent volume.
28. **Is the anonymous demo a login?** No. Private profiles require real OIDC;
    anonymous training identities are random per browser connection.
29. **How is the external API authenticated?** A short-lived learner-scoped
    HMAC token is verified by the backend; production transport requires HTTPS.
30. **How would you scale it?** Migrate repositories/checkpoints and coordination
    deliberately. Current process-local locks do not support distributed replicas.
31. **How do you test it?** Original regressions, adapter/token/restart tests,
    all-card AppTest coverage, and actual browser rendering checks.
32. **What remains external?** Advanced live Docker runtime, public hosting,
    real OIDC registration, TLS ingress, and durable-volume provisioning.

## 22. A 60-second explanation

“PyQuest is a Python learning platform that connects concept study to actual
practice. I built an independent Streamlit edition around a tested backend,
preserving fourteen worlds and 113 lessons. Lessons are static and interactive,
so viewing one does not call a model or award points. Challenges use a real
LangGraph workflow that routes to the right world, calls Groq through LangChain,
validates structured output, and checks the private reference solution. Learner
code is graded deterministically, not by an LLM. Beginner execution is bounded;
advanced source requires Docker and fails safely if unavailable. Drafts, purchases,
rewards, and graph checkpoints have separate persistence responsibilities.
Cloud mode uses an authenticated external backend with durable storage, and
OIDC can identify returning learners. Core behavior is tested while deployment
dependencies and limitations are reported honestly.”

## 23. A three-minute technical explanation

“The product problem is that learners need both a mental model and trustworthy
practice. I kept the existing fourteen-world curriculum and 113 Concept Cards,
then built a separate Streamlit interface with home, concepts, coding, progress,
and companion pages. Native controls provide responsive layout and accessibility.
The editor is a stable keyed multiline widget with session persistence and a
durable draft buffer. Review saves the draft and returns to the exact question.

Generation uses a real StateGraph: load learner evidence, plan, route through
the supervisor and specialist, adapt difficulty, and invoke ChatGroq. A Pydantic
question object is still untrusted. The guard checks context, allowed concepts,
solution leakage, prompt/AST novelty, and executes the private reference against
fixtures. Only approved candidates become active questions. Retry edges are
bounded, and provider failures do not substitute fake static exercises. Official
checkpoints are scoped by a stable learner/session thread ID.

Answer checking is a separate deterministic pipeline. Canonical topic IDs select
the bounded beginner interpreter or advanced Docker runner. Neither learner
source nor model fields can downgrade that policy. Output and required constructs
are checked against private fixtures. Infrastructure failures return before
attempt/reward writes. Correct eligible submissions use the original XP, coin,
and mastery rules; ledger event IDs and question uniqueness prevent replayed
rewards. Buying a solution changes independent eligibility.

I separate temporary UI state, transactional learner records, and graph snapshots.
Local mode uses SQLite files. Community Cloud cannot guarantee local durability,
so remote mode calls an authenticated service whose business and checkpoint
databases are on an external durable volume. Signed short-lived tokens scope
requests to a learner; OIDC issuer and subject produce a stable opaque identity.
Anonymous mode is explicitly a fresh demo, and unconfigured cloud mode restricts
challenge actions rather than attempting unsafe execution.

Testing includes backend/security regressions, all 113 native card views, draft
preservation including empty text, reward replay, remote learner isolation, and
checkpoint recovery after service restart. Browser checks inspect desktop/mobile
rendering and beginner gameplay. Advanced Docker execution and public OIDC hosting
remain dependencies to verify on the intended deployment environment.”

## 24. Live demo script

1. Start port 8501 with the documented command and a private Groq key.
2. Show Home, all fourteen worlds, and actual profile XP/coins.
3. Open I/O Harbor → input(). Explain static concept loading versus AI generation.
4. Use the interactive walkthrough and inspect expected output.
5. Start challenge. Explain specialist routing, guard checks, and checkpoints.
6. Read the actual generated question and solve its requirements; do not assume
   every live question is the mock Welcome exercise.
7. Run with example input, then Check. Show deterministic feedback and rewards.
   Repeat Check to explain reward uniqueness.
8. Review Concept → Continue. Show the exact same code and question.
9. Show Progress and a free companion preference; neither affects correctness.
10. Explain the external durable/OIDC option and honest runtime limits. If live
    generation fails, use port 8502 only as a visibly labeled mock QA demo and
    show the real backend/provider-error implementation.
