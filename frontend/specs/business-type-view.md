# B2B/B2C view specification

**Status:** Implemented as an All business/B2B/B2C filter in the live dashboard.

## Goal

Let users inspect aggregate financial metrics for all business, B2B only, or B2C only, while clearly distinguishing a business-type slice from the overall dataset.

## API contract and important limitation

`BusinessType` is `"B2B" | "B2C"`. The summary, top-categories, comparison, and alerts endpoints accept an optional `business_type` parameter. The raw `GET /api/metrics` movement endpoint does **not** accept that parameter. Dedicated `GET /api/metrics/b2b` and `GET /api/metrics/b2c` endpoints return raw movements for the respective segment and accept date, category, and operation-type filters. The facets endpoint lists available business types but does not filter by one. See [`param-types.ts`](./param-types.ts).

## Implemented interaction

- Offer three choices: All business, B2B, and B2C. “All” omits `business_type`; the other choices send the matching value to supported aggregate endpoints.
- Keep the selected business type consistent across every displayed aggregate, comparison, alert, and category request that supports the parameter.
- For a view based on raw movements, use the dedicated B2B/B2C endpoint or fetch `/api/metrics` and filter returned `business_type` values on the client. Do not pass `business_type` to `/api/metrics` and assume it is honored.
- Show the active selection in the page context so B2B/B2C values cannot be confused with all-business totals.
- Keep loading, no-data, and error states distinct when changing the selection.

## Acceptance criteria for a future implementation

1. All business omits the optional query; B2B/B2C sends only the allowed literal.
2. Aggregate requests consistently apply the same business type.
3. Raw movement requests use the dedicated segment endpoint or tested client-side filtering; they do not include an unsupported `business_type` parameter on `/api/metrics`.
4. The displayed selection is apparent and accessible.
5. Tests verify query mapping and that switching the selection updates all supported data shown in the view.

## Out of scope

This implementation does not define new business segments, change backend routes, or consume the summary/comparison/category aggregate endpoints. The live page uses the raw all-business route for All business and the dedicated segment route for B2B/B2C movements. The selected segment is shown in the dashboard period label and is also applied to alerts.
