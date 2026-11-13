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

## Phase commit trail

Each major phase was committed separately:

1. Phase 1 — verified summary and setup trail: `ad3cdd2` (`docs: add verified project summary and setup trail`).
2. Phase 2 — categorized engineering findings: `ab54424` (`docs: document evidence-based engineering findings`).
3. Phase 3 — actionable rules and workflow validation: `227877f` (`docs: add actionable repository agent rules`).
4. Phase 4 — product, stack, and status memory bank: `892ac82` (`docs: add product and technical memory bank`).

## Final verification

After the four deliverable phases were committed, both Compose services remained running. The frontend, backend `/health`, and API docs returned HTTP 200; `GET /api/metrics` returned 360 chronologically ordered movements.

The agent's commits and checks do not substitute for the student's required review. The student should inspect the linked source claims and generated artifacts, confirm the local/fork setup, and decide whether to accept the recommendations before treating the work as validated.

## Recommendations beyond the minimum

These are evidence-backed suggestions, not changes made as part of the context-building task:

1. **Resolve the period/data mismatch before presenting the dashboard as a particular year.** Derive the label from the data or make the API data range match the selected label; add a regression test for the chosen behavior.
2. **Add an `App`-level test for successful loading and API failure.** Existing frontend coverage tests calculations but not the page's network and error-state behavior.
3. **Isolate seeded randomness.** Use a local random generator so deterministic mock generation does not reset module-global random state.
4. **Review CORS for any non-local deployment.** Replace the wildcard origin with the intended trusted frontend origins if credentials are needed.
