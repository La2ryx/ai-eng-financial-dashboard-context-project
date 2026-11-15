# Current status

## Implemented

- The frontend fetches movement records from `/api/metrics`, computes KPI and monthly series data, and renders dashboard sections with loading and error states ([page and data flow](../frontend/src/App.tsx#L15)).
- The backend exposes movement, facet, summary, category, comparison, alert, and business-type endpoints. Its records are generated mock data with seeded random choices, while the calendar years depend on the current date ([API routes](../backend/app/routes.py#L248), [mock generator](../backend/app/routes.py#L94), [date logic](../backend/app/routes.py#L65)).
- Local development uses a Compose frontend/backend setup documented in the [README](../README.md#L39).
- A repository-specific [dashboard quality skill](../.agents/skills/dashboard-quality/SKILL.md) now records the discovery workflow for UI/API changes, accessibility checks, evidence-led performance work, and validation expectations.
- Dashboard charts now include screen-reader-accessible data tables and chart labels; loading and API errors are announced, KPI collection has an accessible label, and chart line animations are disabled ([dashboard page](../frontend/src/App.tsx), [income/outcome chart](../frontend/src/components/dashboard/income-outcome-chart.tsx), [profit chart](../frontend/src/components/dashboard/profit-percent-chart.tsx), [KPI row](../frontend/src/components/dashboard/kpi-row.tsx)).
- The date-range, alerts-table, and B2B/B2C specifications and API contract types are integrated under [`frontend/specs/`](../frontend/specs/README.md), and the first implementation of all three is now live in the dashboard.
- The live dashboard now initializes date controls from `/api/metrics/facets`, applies inclusive dates to movement and alert requests, uses dedicated `/api/metrics/b2b` or `/api/metrics/b2c` routes for segment selection, and renders monthly alerts in an accessible table. Invalid ranges are rejected; movement and alert loading/error/empty states are distinguished ([page](../frontend/src/App.tsx), [API helpers](../frontend/src/lib/dashboard-api.ts), [filter controls](../frontend/src/components/dashboard/date-business-filters.tsx), [alerts table](../frontend/src/components/dashboard/alerts-table.tsx)).

## Known limitations and risks

- The dashboard period label now reflects the applied start/end dates and business-type selection, replacing the previous hard-coded 2024 label. The backend still supplies generated mock data; it is not persisted business data ([page](../frontend/src/App.tsx), [backend generator](../backend/app/routes.py#L94)).
- The current page consumes the raw movement endpoint and calculates aggregates in the frontend; additional aggregation endpoints exist but are not used by this page ([frontend request](../frontend/src/App.tsx#L15), [backend summary route](../backend/app/routes.py#L268)).
- Frontend tests cover calculation/formatting helpers, not the page's network lifecycle. Backend tests exercise route behavior ([frontend tests](../frontend/src/lib/financial-utils.test.ts#L1), [backend tests](../backend/tests/test_routes.py#L1)).
- CORS allows all origins while credentials are enabled; review this configuration before non-local exposure ([CORS setup](../backend/app/main.py#L7)).

## Validation snapshot

Earlier context-building validation included a successful Compose run, frontend tests, lint/build, and backend tests (15); the initial build reported a JavaScript chunk above Vite's 500 kB advisory threshold. The live-filter/alerts implementation now has frontend tests, lint, TypeScript/Vite build, and backend route tests. Chart components are lazy-loaded. Build sizes are recorded in the [verification report](../verification.md#dashboard-quality-change-validation); they are bundle composition measurements, not runtime speed benchmarks.

The dashboard accessibility/performance update adds semantically labeled chart regions and text equivalents for chart data, status/error announcements, disables line-chart animations, and lazy-loads chart components. Static-render accessibility regression tests check the KPI group, chart labels, and table structure/content. These checks do not claim a manual assistive-technology audit or measured runtime speedup.

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
5. The dashboard has already been code-split to keep the main JavaScript chunk below Vite's advisory threshold; any further performance work should be based on a runtime measurement rather than bundle size alone.

These are recommendations inferred from current code and validation, not commitments or externally supplied product requirements.
