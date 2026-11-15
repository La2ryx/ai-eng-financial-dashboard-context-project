# Date range filter specification

**Status:** Proposal only; not implemented in the live dashboard.

## Goal

Allow a user to choose a start and end date for the dashboard period, replacing reliance on the current hard-coded “2024 - Full Year” display. The chosen period must be visibly consistent with the data being displayed.

## API contract

The raw movement route is `GET /api/metrics` with optional `start_date` and `end_date` query parameters in `YYYY-MM-DD` format. The backend applies inclusive bounds (`create_date >= start_date`, `create_date <= end_date`). It returns movements sorted chronologically. Summary, top-category, and alerts routes also accept these bounds; the facets route does not accept a date range. See [`param-types.ts`](./param-types.ts).

## Proposed behavior

- Provide start and end date inputs.
- Initialize the selected range from the available API range rather than hard-coding a year. The facets endpoint exposes `min_date` and `max_date`; if those values are used to initialize controls, fetch them and the movements consistently.
- Do not issue a request when either entered value is malformed or when start is after end. Present a clear validation message and retain the last valid data.
- On apply, send `start_date` and `end_date` to the raw movement request. Include the same range on any summary/alerts/top-category requests added by later work.
- Treat both boundaries as inclusive. Label the dashboard with the selected range, not a guessed calendar year.
- Handle an empty result as a valid state distinct from loading and request failure.

## Acceptance criteria for a future implementation

1. Requests encode selected dates as `YYYY-MM-DD` query values.
2. Start/end validation prevents reversed or invalid ranges from being applied.
3. The displayed period matches the applied range; it never claims a fixed year unsupported by the response.
4. Empty, loading, and error states are distinguishable.
5. Tests cover both date-boundary filtering and invalid range behavior (backend contract tests already cover route filtering; add focused UI/request tests for the control).

## Out of scope

This specification does not select a date-picker library, prescribe a default calendar period beyond using available data, or modify the current app/API.
