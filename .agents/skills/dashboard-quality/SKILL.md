# Dashboard quality skill

## When to use

Use this skill before changing dashboard data presentation, interactive controls, chart/table components, or their loading and error states. It supplements (and does not replace) the repository rules in `.agents/rules/`.

## Discovery and source of truth

1. Read `AGENTS.md`, then check `.agents/rules/` and `.agents/skills/` for current repository guidance.
2. Trace the live data path from `frontend/src/App.tsx` through the active dashboard components and `frontend/src/lib/financial-utils.ts`.
3. Confirm API behavior from `backend/app/routes.py` and relevant tests in `backend/tests/test_routes.py`. Do not assume an endpoint used by the dashboard just because it exists.
4. Check the frontend API/domain types and tests before changing a payload, calculation, or displayed value.

## Required workflow

- Keep changes scoped to the requested feature. Do not silently turn a specification into an implementation or alter backend contracts without request.
- For date, currency, and financial calculations, preserve the API's date/value semantics and add or update focused tests.
- For controls, charts, tables, errors, and loading states, use semantic HTML, accessible names/headings, visible keyboard focus, and distinguish empty data from failure.
- For charts, provide a meaningful accessible label or summary; do not rely on color alone to explain a series.
- Prefer targeted performance improvements supported by evidence. Avoid premature memoization, new dependencies, or code-splitting without an identified cost/benefit.
- Run the narrow relevant test first, then `npm test`, `npm run lint`, and `npm run build` for frontend changes when dependencies are available. Report commands that could not run and why; do not install dependencies without authorization.
- Update the memory bank or feature specification when behavior or durable project knowledge changes.

## Completion checklist

- [ ] The change matches the requested scope and does not misrepresent mocked or unsupported API behavior.
- [ ] Relevant tests cover the behavior, including accessible/empty/error states where applicable.
- [ ] Lint/build checks are reported accurately.
- [ ] Accessibility and performance claims point to a concrete implementation and validation evidence.
- [ ] Documentation is updated when needed.
