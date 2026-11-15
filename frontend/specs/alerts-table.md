# Alerts table specification

**Status:** Proposal only; not implemented in the live dashboard.

## Goal

Present unusual increases in grouped outcome totals in a compact, accessible table so users can identify the period, observed amount, historical baseline, and relative increase.

## API contract

Use `GET /api/metrics/alerts` with optional `threshold` (default `0.3`), `group_by` (`day`, `week`, or `month`; default `month`), inclusive `start_date` / `end_date`, and optional `business_type` (`B2B` or `B2C`). The response is an array of `{ period, outcome_total, baseline_average, increase_ratio }`. `increase_ratio` is a fraction: `0.3` means a 30% increase. The route summarizes outcomes and compares each grouped period against the average of preceding periods in the filtered result. See [`api-types.ts`](./api-types.ts) and [`param-types.ts`](./param-types.ts).

## Proposed table

- Period
- Outcome total
- Historical baseline average
- Increase (format `increase_ratio` as a percentage for display)

Order rows by period ascending as returned by the API. Use currency formatting consistent with the dashboard's financial values, and format the period according to the selected grouping without changing the underlying key.

## Proposed behavior and states

- Default grouping is monthly and the default threshold is 30%, matching the API defaults.
- If date range or business type controls are later added, pass the same values to the alerts route so the table describes the same dashboard slice.
- Provide loading, request-error, and empty-result states. Empty means no periods exceeded the threshold; it is not an API failure.
- The backend excludes the first period because it has no preceding baseline and only emits an alert when baseline is positive and increase strictly exceeds the threshold. A UI must not imply that every outcome increase will appear.
- Preserve keyboard navigation and semantic table headers; provide an accessible caption or equivalent heading.

## Acceptance criteria for a future implementation

1. Render each returned alert with period, outcome total, baseline average, and increase percentage.
2. A `0.3` increase ratio displays as `30%`, not `0.3%`.
3. Controls/defaults map to the allowed API query values.
4. Empty, loading, and failure states are distinct and accessible.
5. Tests cover response rendering, percentage formatting, and empty/error behavior.

## Out of scope

No alert acknowledgement, severity ranking, notification delivery, threshold editing UX, or API behavior change is specified here. The current React page does not call this endpoint.
