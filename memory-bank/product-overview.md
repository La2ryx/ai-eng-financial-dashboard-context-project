# Product overview

## What this repository delivers

This repository delivers a financial metrics dashboard with a React/TypeScript frontend and FastAPI backend ([project README](../README.md#L18)). The page presents income, outcome, profit, and profit percentage KPIs alongside monthly financial charts ([dashboard composition](../frontend/src/App.tsx#L49)).

The header calls the page an “Executive metrics dashboard,” but repository documentation does not define a more specific customer, industry, or deployment audience ([dashboard header](../frontend/src/components/dashboard/dashboard-header.tsx#L16)).

## Data and API

The frontend loads movement records from `GET /api/metrics` and computes its KPI and monthly chart values in the browser ([data request](../frontend/src/App.tsx#L15), [calculations](../frontend/src/lib/financial-utils.ts#L21)). The backend also exposes facets, grouped summaries, top-category totals, comparisons, alerts, and B2B/B2C movement routes ([API routes](../backend/app/routes.py#L248)).

The backend currently generates seeded mock movements. This is demo/sample behavior, not evidence of a persistent production data source ([generator](../backend/app/routes.py#L94)).

## Related context

- See [tech stack](./tech-stack.md) for runtime and test tooling.
- See [current status](./current-status.md) for implemented scope, limitations, and recommendations.
- See the repository's [verified summary and findings](../verification.md) for the claim-by-claim evidence trail.
