# Frontend feature specifications

This directory records the product behavior and API contracts implemented in the live dashboard. The date range, business-type selector, and alerts table are wired to the existing backend endpoints and covered by frontend tests. These features consume generated mock movements; they do not add persisted financial data or change backend behavior.

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

## Implementation status and boundary

The live page loads the available date limits from `/api/metrics/facets`, fetches all-business movements from `/api/metrics` or segment movements from `/api/metrics/b2b` and `/api/metrics/b2c`, and requests monthly alerts from `/api/metrics/alerts` using the applied dates and business type. Invalid date ranges are rejected before requests are applied. The UI distinguishes loading, API failure, and empty alert results. The API may support additional aggregation routes not consumed by the current page; do not imply those are displayed.
