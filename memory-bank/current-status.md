# Current status

## Implemented

- The frontend fetches movement records from `/api/metrics`, computes KPI and monthly series data, and renders dashboard sections with loading and error states ([page and data flow](../frontend/src/App.tsx#L15)).
- The backend exposes movement, facet, summary, category, comparison, alert, and business-type endpoints. Its records are generated mock data with seeded random choices, while the calendar years depend on the current date ([API routes](../backend/app/routes.py#L248), [mock generator](../backend/app/routes.py#L94), [date logic](../backend/app/routes.py#L65)).
- Local development uses a Compose frontend/backend setup documented in the [README](../README.md#L39).
- A repository-specific [dashboard quality skill](../.agents/skills/dashboard-quality/SKILL.md) now records the discovery workflow for UI/API changes, accessibility checks, evidence-led performance work, and validation expectations.
- Dashboard charts now include screen-reader-accessible data tables and chart labels; loading and API errors are announced, KPI collection has an accessible label, and chart line animations are disabled ([dashboard page](../frontend/src/App.tsx), [income/outcome chart](../frontend/src/components/dashboard/income-outcome-chart.tsx), [profit chart](../frontend/src/components/dashboard/profit-percent-chart.tsx), [KPI row](../frontend/src/components/dashboard/kpi-row.tsx)).

## Known limitations and risks

- The dashboard retains its existing period label and default API behavior; this focused skills pass does not implement date/business filters or alerts. The backend still supplies generated mock data; it is not persisted business data ([page](../frontend/src/App.tsx), [backend generator](../backend/app/routes.py#L94)).
- The current page consumes the raw movement endpoint and calculates aggregates in the frontend; additional aggregation endpoints exist but are not used by this page ([frontend request](../frontend/src/App.tsx#L15), [backend summary route](../backend/app/routes.py#L268)).
- Frontend tests cover calculation/formatting helpers, not the page's network lifecycle. Backend tests exercise route behavior ([frontend tests](../frontend/src/lib/financial-utils.test.ts#L1), [backend tests](../backend/tests/test_routes.py#L1)).
- CORS allows all origins while credentials are enabled; review this configuration before non-local exposure ([CORS setup](../backend/app/main.py#L7)).

## Validation snapshot

Earlier context-building validation included a successful Compose run, frontend tests, lint/build, and backend tests (15); the initial build reported a JavaScript chunk above Vite's 500 kB advisory threshold. For the dashboard-quality pass, chart components are lazy-loaded, with current skill-driven checks and bundle sizes recorded in the [verification report](../verification.md#stage-three-dashboard-quality-skills-pass). Bundle sizes are composition measurements, not runtime speed benchmarks.

The dashboard accessibility/performance update adds semantically labeled chart regions and text equivalents for chart data, status/error announcements, disables line-chart animations, and lazy-loads chart components. Static-render accessibility regression tests check the KPI group, chart labels, and table structure/content. These checks do not claim a manual assistive-technology audit or measured runtime speedup.

## Skills discovery notes

- **Repository skill:** `.agents/skills/dashboard-quality/SKILL.md` gives project-specific guidance for tracing the live UI/API path, accessible UI states, validation, and evidence-backed performance changes.
- **External discovery:** `npx skills find dashboard accessibility` returned `plugin87/ux-ui-agent-skills@data-dashboard` and other candidates. `plugin87/ux-ui-agent-skills@data-dashboard` was installed and applied for the chart-accessibility review; its full kit was not installed, so its gate verdicts were not run or claimed. Details are in [verification](../verification.md#stage-three-dashboard-quality-skills-pass).
- **Scope:** The resubmitted stage-three change is limited to skill-driven dashboard-quality improvements; filters/alerts are not included.

## Evidence-backed recommendations (not an approved roadmap)

1. Make the displayed period agree with the date range returned by the API, then add a regression test for that behavior.
2. Add focused frontend coverage for successful fetch and API-error rendering.
3. Use a local random generator for seeded mock data to avoid changing module-global random state.
4. Narrow CORS origins before exposing the API beyond local development.
5. The dashboard has already been code-split to keep the main JavaScript chunk below Vite's advisory threshold; any further performance work should be based on a runtime measurement rather than bundle size alone.

These are recommendations inferred from current code and validation, not commitments or externally supplied product requirements.
