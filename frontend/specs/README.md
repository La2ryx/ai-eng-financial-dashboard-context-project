# Frontend feature specifications

This directory describes proposed frontend behavior and records API contracts for a later implementation. **It is specification-only:** the live React dashboard does not currently implement the date filter, alerts table, or B2B/B2C selector/views described here. No components, hooks, or application behavior are changed by these documents.

## Specs

- [Date range filter](./date-filter.md) — select an inclusive date range and apply it to supported dashboard requests.
- [Alerts table](./alerts-table.md) — display backend-detected unusual outcome periods.
- [B2B/B2C view](./business-type-view.md) — compare or filter aggregate data by business type.

## Contract references

- [API response types](./api-types.ts) mirror the Pydantic models in `backend/app/routes.py`.
- [Query parameter types](./param-types.ts) document optional and required parameters for the existing routes.
- Backend route implementations and query definitions: [`backend/app/routes.py`](../../backend/app/routes.py).
- Current page behavior: [`frontend/src/App.tsx`](../src/App.tsx).
- Existing client-side movement types: [`frontend/src/lib/financial-types.ts`](../src/lib/financial-types.ts).

The API returns dates as `YYYY-MM-DD` strings over JSON. The backend's `start_date` and `end_date` movement filters are inclusive. The raw `/api/metrics` route has no `business_type` parameter, but dedicated `/api/metrics/b2b` and `/api/metrics/b2c` movement routes do exist; aggregate routes also accept `business_type` where documented. Implementations should use the route contracts as written rather than assuming every endpoint accepts every filter.

## Status and implementation boundary

All specifications are proposals, not approved product requirements. The current live page fetches raw `/api/metrics` movements and computes KPIs/monthly chart values in the frontend. It does not call the alerts endpoint or render these proposed controls/table/views. The API may support filtering/aggregation beyond what the live dashboard consumes. Implementing any item requires a separate change, design review, and tests; do not import these spec types into production code until that work is explicitly undertaken.
