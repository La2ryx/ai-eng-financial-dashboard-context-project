# Project summary and verification

## AI-generated project summary (checked against the repository)

This repository contains a financial metrics dashboard with a React and TypeScript frontend and a FastAPI backend ([README](./README.md#L18)). The frontend is mounted from `frontend/src/main.tsx`; `frontend/src/App.tsx` fetches financial movements from `/api/metrics`, calculates KPI and monthly chart data, and renders dashboard components ([entry point](./frontend/src/main.tsx#L1), [app](./frontend/src/App.tsx#L11)). The backend application is created in `backend/app/main.py` and includes its routes from `backend/app/routes.py` ([application](./backend/app/main.py#L1)).

The backend currently generates mock movements rather than reading a persistent store. It seeds generation for API responses, creates 30 movements for each of 12 months, and has a test that checks the generated 360 records and chronological ordering ([generator](./backend/app/routes.py#L94), [test](./backend/tests/test_routes.py#L12)). Its routes provide raw movements, facets, grouped summaries, top categories, period comparisons, alerts, and B2B/B2C-specific movements ([routes](./backend/app/routes.py#L243)).

Local development is configured with Docker Compose: the frontend is a Vite development server, the backend runs FastAPI under Uvicorn with debugpy, and Vite proxies `/api` requests to the backend service ([Compose](./docker-compose.yml#L1), [frontend Dockerfile](./frontend/Dockerfile#L1), [backend Dockerfile](./backend/Dockerfile#L1), [Vite config](./frontend/vite.config.ts#L9)). The documented startup command is `docker compose up --build`; the README lists the frontend, backend, and API-docs addresses ([run instructions](./README.md#L39)).

## Repository map and entry points

| Area | Entry point or evidence | Responsibility |
| --- | --- | --- |
| Frontend bootstrap | [`frontend/src/main.tsx`](./frontend/src/main.tsx#L1) | Mounts the React application. |
| Dashboard page | [`frontend/src/App.tsx`](./frontend/src/App.tsx#L23) | Loads API movements, derives KPIs/monthly data, and composes dashboard sections. |
| Frontend calculations | [`frontend/src/lib/financial-utils.ts`](./frontend/src/lib/financial-utils.ts#L1) | Calculates KPI totals, monthly chart points, and display formatting. |
| Backend application | [`backend/app/main.py`](./backend/app/main.py#L1) | Creates the FastAPI application and registers the router. |
| API and mock-data logic | [`backend/app/routes.py`](./backend/app/routes.py#L1) | Defines movement models, mock generation, filtering, summaries, and endpoints. |
| Frontend tests | [`frontend/src/lib/financial-utils.test.ts`](./frontend/src/lib/financial-utils.test.ts#L1) | Vitest coverage for KPI/monthly calculations and formatting. |
| Backend tests | [`backend/tests/test_routes.py`](./backend/tests/test_routes.py#L1) | Pytest/TestClient checks for generated data and API behavior. |
| Local services | [`docker-compose.yml`](./docker-compose.yml#L1) | Builds and connects the frontend and backend containers. |

## Run path and checks performed

Repository evidence was used to select the run path: the README documents `docker compose up --build`, Compose defines both services, and their Dockerfiles define the frontend and backend commands ([README](./README.md#L39), [Compose](./docker-compose.yml#L1)).

In this workspace, `docker compose up --build -d` completed successfully. The frontend at `http://localhost:5173/` and backend API documentation at `http://localhost:8000/docs` both returned HTTP 200, and `docker compose ps` showed both services running. These checks confirm this workspace's startup path; they do not prove an independent student setup or spot-check.

## Claim verification trail

| Claim | Status | Evidence and correction |
| --- | --- | --- |
| The project is a React/TypeScript frontend with a FastAPI backend. | ✅ Verified | The README states the stack; the frontend package and FastAPI application corroborate it ([README](./README.md#L18), [package](./frontend/package.json#L1), [backend app](./backend/app/main.py#L1)). |
| The documented local run path uses Docker Compose for both services. | ✅ Verified | README command and service definitions agree; this workspace's Compose startup and HTTP probes succeeded ([README](./README.md#L39), [Compose](./docker-compose.yml#L1)). |
| The dashboard's “2024 - Full Year” label proves the API returns 2024-only data. | ❌ Incorrect claim; corrected | The label is hard-coded in the frontend ([App](./frontend/src/App.tsx#L49)), but the API generator chooses years relative to `date.today()` ([date logic](./backend/app/routes.py#L65), [generator](./backend/app/routes.py#L94)). The displayed label is not evidence that the underlying dataset is limited to 2024. |
| The student independently reviewed the generated summary and setup. | ❓ Unverified | An agent can provide evidence and a reproducible run, but cannot claim the student's independent spot-check. The student should compare the claims with the linked files and confirm the environment-specific setup. |

## Checklist status at initial inspection

The application and local run path existed, but there were no `.agents/rules/` files or `memory-bank/` directory at the start of this work. Those deliverables and their validation evidence are tracked in the task's later phases; this statement records the initial state, not the final submission status.

## Engineering findings

### Architecture and data flow

- **Observed convention:** The current dashboard fetches movement records from `/api/metrics` when the page loads, then derives KPI values and monthly chart points in the frontend. The backend also exposes facets, grouped summaries, top-category, comparison, alert, and business-type routes, but the current page does not call those routes ([frontend data flow](./frontend/src/App.tsx#L15), [frontend calculations](./frontend/src/lib/financial-utils.ts#L21), [additional API routes](./backend/app/routes.py#L262)).
- **Observed convention:** Metric route handlers declare Pydantic response models and commonly begin from seeded mock movements ([API model](./backend/app/routes.py#L22), [movement endpoint](./backend/app/routes.py#L248)).
- **Risk / limitation:** The header's period is a fixed string, while mock-data years are computed relative to the current date. The display can therefore misrepresent the data period ([header usage](./frontend/src/App.tsx#L49), [date selection](./backend/app/routes.py#L65)).
- **Risk / limitation:** `generate_mock_movements(seed=...)` calls module-level `random.seed`, changing the process-wide random generator state. If other code later relies on random state, isolate the generator with a local `random.Random(seed)` ([generator](./backend/app/routes.py#L94)).

### Domain naming and contracts

- **Observed convention:** The backend uses constrained `Literal` types for operation, category, business type, and grouping query values; the frontend defines corresponding TypeScript unions and movement fields ([backend types](./backend/app/routes.py#L11), [frontend types](./frontend/src/lib/financial-types.ts#L1)).
- **Validation implication:** When changing a domain value or response shape, check both language-level definitions and route tests so the client/server contract remains aligned ([backend route tests](./backend/tests/test_routes.py#L72), [frontend movement type](./frontend/src/lib/financial-types.ts#L1)).

### Testing

- **Observed convention:** Frontend tests target pure calculation and formatting helpers, including a no-income edge case and chronological grouping across years ([frontend utility tests](./frontend/src/lib/financial-utils.test.ts#L26)).
- **Observed convention:** Backend tests use FastAPI `TestClient` and cover date/category/operation filters, grouped summaries, and response fields ([backend tests](./backend/tests/test_routes.py#L3)).
- **Gap:** The discovered frontend tests do not exercise the `App` fetch lifecycle, loading state, or error state. If changing page/API integration, add focused component-level coverage rather than relying only on utility tests ([app lifecycle](./frontend/src/App.tsx#L23), [utility test file](./frontend/src/lib/financial-utils.test.ts#L1)).
- **Available commands:** Frontend scripts include `npm test`, `npm run lint`, and `npm run build` ([package scripts](./frontend/package.json#L7)).

### Documentation and operational workflow

- **Observed convention:** The README is the repository's stated Compose startup guide, Vite forwards `/api` to the Compose backend service name, and Compose publishes the frontend/backend ports ([README](./README.md#L39), [Vite proxy](./frontend/vite.config.ts#L9), [Compose services](./docker-compose.yml#L1)).
- **Risk / limitation:** FastAPI CORS currently allows all origins while also allowing credentials. This is permissive configuration; review and narrow origins before exposing the API beyond the local development context ([CORS config](./backend/app/main.py#L7)).
- **Documentation gap at initial inspection:** The README describes an expected `.agents` layout, but the repository initially had no rules or memory bank. The new rules and memory bank should remain evidence-based and linked to this findings record.

## Rule-to-finding mapping and validation

| Rule | Concrete finding it addresses | Repository workflow used to validate it | Result |
| --- | --- | --- | --- |
| [`architecture-and-api.md`](./.agents/rules/architecture-and-api.md) | The frontend fetches `/api/metrics`, calculates chart/KPI data locally, and has parallel backend/frontend domain types. | Traced the active page-to-route contract; ran the frontend calculation tests and backend route tests. | Frontend: 5 tests passed. Backend: 15 tests passed. |
| [`testing-and-validation.md`](./.agents/rules/testing-and-validation.md) | Frontend tests cover helpers; backend tests use `TestClient` for route behavior, so relevant checks differ by layer. | Ran the documented frontend test, lint, and build scripts, plus backend pytest in the running Compose services. | All commands passed. Vite reported a bundle-size advisory; pytest reported one Starlette/httpx deprecation warning. |
| [`evidence-and-documentation.md`](./.agents/rules/evidence-and-documentation.md) | The fixed period label can be mistaken for the generated data range; initial repository context lacked the required rules/memory bank. | Applied source links and confidence labels in this report and checked local file/line links across this report and all three rules. | All local file and line links validated in four Markdown files; the inaccurate period inference is explicitly corrected above. |

Validation commands and results:

- `docker compose exec -T frontend sh -c 'npm test && npm run lint && npm run build'` — passed; Vitest reported 1 file and 5 passing tests, ESLint passed, and the production build completed. Vite emitted an advisory because the minified JavaScript chunk is about 584 kB, above its 500 kB notice threshold.
- `docker compose exec -T backend pytest -q` — 15 passed. Pytest emitted a `StarletteDeprecationWarning` about the current `httpx` integration in `TestClient`.
- Local documentation link audits — first checked `verification.md` and the three rules; the final audit checked all seven verification, rule, and memory-bank documents. All local file, line, and report-section links resolved.

### Applied documentation task: frontend/API integration

The architecture rule initially described the relative `/api` path without mentioning the supported backend-origin override. For a real documentation task, the agent traced the frontend request, Vite proxy, and README, then refined the [architecture rule](./.agents/rules/architecture-and-api.md) and updated the [tech-stack memory](./memory-bank/tech-stack.md). The default is a relative request through Vite; `VITE_API_BASE_URL` optionally supplies another origin ([request](./frontend/src/App.tsx#L13), [proxy](./frontend/vite.config.ts#L9), [README](./README.md#L44)). The override was verified in code and documentation, not exercised against a separate backend.

The testing rule was applied by running focused tests and a live integration check:

- `docker compose exec -T frontend npm test -- src/lib/financial-utils.test.ts` — 5 passed.
- `docker compose exec -T backend pytest -q tests/test_routes.py -k 'metrics_endpoint_respects_date_filters or metrics_endpoint_filters_by_category or metrics_endpoint_filters_by_operation_type'` — 3 passed, 12 deselected; the existing Starlette/httpx deprecation warning remained.
- Requests to `http://localhost:5173/api/metrics` and `http://localhost:8000/api/metrics` returned identical JSON containing 360 records. This validates the default live proxy path, not the optional override.

The evidence/documentation rule was applied to the changed memory-bank entry and this record using source links and explicit limits. This task changed documentation, not frontend or backend behavior.

## Rubric traceability

The status below tracks this work against the supplied reference checklist. ✅ marks repository-controlled items checked in this workspace; ❓ marks a student-only or otherwise unverified confirmation.

| Checklist requirement | Status | Evidence or remaining work |
| --- | --- | --- |
| Discover and verify the setup/run path from repository evidence | ✅ Workspace run verified | This document cites the README, Compose file, Dockerfiles, and successful local HTTP probes. Independent student setup remains unverified. |
| AI-generated project summary checked against repository facts | ✅ Complete | See [AI-generated project summary](#ai-generated-project-summary-checked-against-the-repository) and linked source. |
| Explicit verification trail with correction or ✅ checks | ✅ Complete | See [claim verification trail](#claim-verification-trail); it includes a corrected false inference and an unverified student-only claim. |
| Phase-separated commit history | ✅ Complete | See the four phase commits below. |
| Concrete categorized findings mapped to rules | ✅ Complete | Findings are categorized above; see the rule-to-finding mapping. |
| Project-specific `.agents/rules` files | ✅ Complete | Three rules exist under `.agents/rules/`. |
| Each rule validated against a real repository workflow | ✅ Complete | See the rule-to-finding mapping and validation results above. |
| `memory-bank` covers product, stack, and current status | ✅ Complete | See [product overview](./memory-bank/product-overview.md), [tech stack](./memory-bank/tech-stack.md), and [current status](./memory-bank/current-status.md). |
| Artifacts demonstrate verified agent-assisted stewardship | Agent artifacts complete; student review ❓ | Source links, test results, runtime probes, and phase commits are recorded. The student must still independently spot-check and accept the artifacts. |
| Frontend date range, business-type filter, and alerts view are implemented | ✅ Implemented and tested | See the live implementation follow-up below and tests under `frontend/src/lib/dashboard-api.test.ts` and `frontend/src/components/dashboard/dashboard-accessibility.test.tsx`. |

## Phase commit trail

The four deliverable phases are separate commits in the pushed `main` history (checked against `origin/main`):

1. Phase 1 — verified summary and setup trail: `ad3cdd2e1f8d082eea0b55a1ad6b3d207a8172df` (`docs: add verified project summary and setup trail`).
2. Phase 2 — categorized engineering findings: `ab54424c742c58b0b572a137c903a36593624662` (`docs: document evidence-based engineering findings`).
3. Phase 3 — actionable rules and workflow validation: `227877f49086c15c8c50606b64b4cc2a277a3616` (`docs: add actionable repository agent rules`).
4. Phase 4 — product, stack, and status memory bank: `892ac82883259262d8b2dbfc725b911ac955faaf` (`docs: add product and technical memory bank`).

These phase commits are followed on `main` by two documentation-validation commits: `944e23719725992103f34a12e25bdbfa0e80c2ce` (`docs: record final checklist verification`) and `48b5a2cb4b27176eaf7a1d7abdbdcd83609c9ae3` (`docs: validate frontend API integration guidance`). The latter was the pushed `main` tip when this trail was checked. The phase commits were not recreated or rewritten; their separate commits and ancestry on the pushed branch were verified directly.

## Final verification

After the four deliverable phases were committed, both Compose services remained running. The frontend, backend `/health`, and API docs returned HTTP 200; `GET /api/metrics` returned 360 chronologically ordered movements.

The agent's commits and checks do not substitute for the student's required review. The student should inspect the linked source claims and generated artifacts, confirm the local/fork setup, and decide whether to accept the recommendations before treating the work as validated.

## Recommendations beyond the minimum

These are evidence-backed suggestions, not changes made as part of the context-building task:

1. **Resolve the period/data mismatch before presenting the dashboard as a particular year.** Derive the label from the data or make the API data range match the selected label; add a regression test for the chosen behavior.
2. **Add an `App`-level test for successful loading and API failure.** Existing frontend coverage tests calculations but not the page's network and error-state behavior.
3. **Isolate seeded randomness.** Use a local random generator so deterministic mock generation does not reset module-global random state.
4. **Review CORS for any non-local deployment.** Replace the wildcard origin with the intended trusted frontend origins if credentials are needed.

## Dashboard quality change validation

The `feature/dashboard-quality` branch makes a dashboard-only accessibility and chart-rendering change. It adds an accessible group name for KPIs; polite loading and alert error announcements; accessible chart labels and screen-reader-only data tables containing the values shown in each chart; and disables Recharts line animations. The companion [change note](./frontend/specs/dashboard-quality-change.md) records scope and claim limits.

Validation was attempted from `frontend/`:

- `npm test` — could not run: `vitest: not found` (exit 127).
- `npm run lint` — could not run: `eslint: not found` (exit 127).
- `npm run build` — could not run: `tsc: not found` (exit 127).
- `git diff --check` — whitespace validation; outcome recorded after the final patch.

The initial frontend checks were blocked because dependencies were not installed; after authorized installation, the `vite/client` diagnostic was resolved and the syntax issue in the profit chart was fixed. Current results, including the follow-up bundle-splitting and regression-test work, supersede those initial blocked outcomes and are recorded below.

### Final dashboard quality review

The dashboard now lazy-loads both chart components while keeping the KPI/header view and default relative `/api` fetch path unchanged. The successful production build reports the main JavaScript chunk at 187.80 kB (59.89 kB gzip) and a separate Recharts `LineChart` chunk at 342.29 kB (100.53 kB gzip). The main bundle is therefore no longer above Vite's 500 kB advisory threshold; the chart chunk is loaded separately when the dashboard chart components are rendered. These are build artifact sizes, not a runtime performance benchmark.

Added server-rendered accessibility regression tests for the KPI group, both chart labels, and the tables' captions, headers, and representative formatted values.

Exact checks run from `frontend/`:

- `npm test` — passed: 2 test files, 8 tests.
- `npm run lint` — passed.
- `npm run build` — passed (TypeScript and Vite production build); no chunk-size advisory was emitted. Output sizes are listed above.
- Workspace diagnostics — no errors found.
- `git diff --check` — passed.

The tests verify accessible markup in static rendering; they are not a substitute for a manual screen-reader/keyboard audit. No runtime speedup is claimed.

### Submission follow-up and human review

The feature specifications from `origin/feature/frontend-specs` were integrated into this branch and then implemented in the live page. The implementation uses only existing backend routes; it does not alter backend behavior or add persisted financial data.

The following checks remain intentionally unclaimed because they require the student's own review or real browser/assistive-technology use:

- ❓ **Independent artifact review:** Personally inspect this report, the linked source/rules/memory-bank artifacts, and the proposal boundary in `frontend/specs/README.md`; confirm the workspace/fork is the one intended for submission and accept or amend the conclusions.
- ❓ **Manual accessibility audit:** In the target browser, use keyboard-only navigation to check logical tab order and visible focus. With the screen reader used for the course/project, inspect the KPI group, both chart labels and their data tables, and loading/error announcements. Record browser, OS, screen reader/version, observed issues, and outcome here only after performing the review. Automated static markup tests are not a substitute.
- ❓ **Runtime performance audit:** No browser-based before/after interaction or loading benchmark is available in this validation. Bundle sizes are documented above but do not establish runtime performance improvement. If the hand-in requires a performance claim, measure the same production build and representative interaction in a browser before and after the change, and record tool, environment, metric, and results; otherwise make no runtime speedup claim.


### Live filters and alerts implementation

The dashboard now initializes its date bounds from `/api/metrics/facets`; rejects malformed, impossible, or reversed dates before applying them; fetches raw all-business or dedicated B2B/B2C movements with inclusive date bounds; and requests monthly alerts using the same range/business-type selection. The page label reflects the applied dates and selection. The accessible alerts table shows period, outcome total, historical baseline, and increase percentage, and distinguishes loading, API failure, and empty results. An explicit no-movements message is shown when the selected filter returns no records. No backend changes were needed.

New frontend coverage checks invalid date handling, route/query mapping for all-business and B2B/B2C movement requests, shared filters for alerts, API failures, semantic alert headers/percentage formatting, and labeled filter controls. Final implementation checks: `npm test` — 3 files, 18 tests passed; `npm run lint` — passed; `npm run build` — passed (main JavaScript chunk 194.40 kB / 61.77 kB gzip, chart chunk 342.29 kB / 100.46 kB gzip); editor diagnostics reported no errors in the changed application, API, and UI modules. The backend suite (`docker compose exec -T backend pytest -q`) passed 15 tests with one existing Starlette/httpx deprecation warning. Compose smoke checks returned frontend HTTP 200, valid facets, 169 B2B movements all tagged B2B, and a valid array response for B2B-filtered monthly alerts. These are automated/integration checks; browser interaction, manual screen-reader checks, and runtime performance benchmarks remain unverified.
