# Current status

## Implemented

- The frontend fetches movement records from `/api/metrics`, computes KPI and monthly series data, and renders dashboard sections with loading and error states ([page and data flow](../frontend/src/App.tsx#L15)).
- The backend exposes movement, facet, summary, category, comparison, alert, and business-type endpoints. Its records are generated mock data with seeded random choices, while the calendar years depend on the current date ([API routes](../backend/app/routes.py#L248), [mock generator](../backend/app/routes.py#L94), [date logic](../backend/app/routes.py#L65)).
- Local development uses a Compose frontend/backend setup documented in the [README](../README.md#L39).
- A repository-specific [dashboard quality skill](../.agents/skills/dashboard-quality/SKILL.md) now records the discovery workflow for UI/API changes, accessibility checks, evidence-led performance work, and validation expectations.

## Known limitations and risks

- The dashboard period label is hard-coded as “2024 - Full Year,” while generated record dates are chosen relative to the current date. The label therefore does not guarantee that the displayed records cover 2024 ([frontend label](../frontend/src/App.tsx#L49), [backend date logic](../backend/app/routes.py#L65)).
- The current page consumes the raw movement endpoint and calculates aggregates in the frontend; additional aggregation endpoints exist but are not used by this page ([frontend request](../frontend/src/App.tsx#L15), [backend summary route](../backend/app/routes.py#L268)).
- Frontend tests cover calculation/formatting helpers, not the page's network lifecycle. Backend tests exercise route behavior ([frontend tests](../frontend/src/lib/financial-utils.test.ts#L1), [backend tests](../backend/tests/test_routes.py#L1)).
- CORS allows all origins while credentials are enabled; review this configuration before non-local exposure ([CORS setup](../backend/app/main.py#L7)).

## Validation snapshot

In the current workspace, the Compose frontend and backend started and their frontend/API-docs HTTP probes returned 200. Frontend tests (5), lint, and production build passed; backend tests (15) passed. The build reported a JavaScript chunk above Vite's 500 kB advisory threshold, and pytest emitted one Starlette/httpx deprecation warning. Full command details are in the [verification report](../verification.md#rule-to-finding-mapping-and-validation).

## Skills discovery notes

- **Initial discovery:** The repository contained `AGENTS.md`, three project rules under `.agents/rules/`, and the memory bank, but no `.agents/skills/` directory or custom skill at the start of the skills stage.
- **Convention source:** `AGENTS.md` explicitly directs contributors to look for available skills under `./.agents/skills`; the README describes the expected `.agents/skills/<skill-name>/SKILL.md` structure.
- **Added artifact:** `.agents/skills/dashboard-quality/SKILL.md` was written as a project-specific workflow skill. It directs future agents to trace the live UI-to-API path, verify backend behavior rather than assume route usage, and include accessible UI states and evidence-backed performance checks.
- **Scope and validation:** This skills-stage change adds guidance only; it does not claim any dashboard implementation or accessibility/performance improvement. Those require a separately scoped product-code change and evidence.

## Evidence-backed recommendations (not an approved roadmap)

1. Make the displayed period agree with the date range returned by the API, then add a regression test for that behavior.
2. Add focused frontend coverage for successful fetch and API-error rendering.
3. Use a local random generator for seeded mock data to avoid changing module-global random state.
4. Narrow CORS origins before exposing the API beyond local development.
5. Consider frontend code-splitting if the dashboard bundle continues to exceed the current build advisory threshold.

These are recommendations inferred from current code and validation, not commitments or externally supplied product requirements.
