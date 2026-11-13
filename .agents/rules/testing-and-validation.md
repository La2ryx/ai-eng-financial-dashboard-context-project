# Testing and validation rule

## Purpose

Choose validation that exercises the financial logic or API behavior affected by a change.

## Scope

Applies to frontend, backend, and local integration changes.

## Rules

- For frontend KPI, monthly aggregation, or formatting changes, extend or run the focused utility tests in [`frontend/src/lib/financial-utils.test.ts`](../../frontend/src/lib/financial-utils.test.ts#L1). The frontend scripts are `npm test`, `npm run lint`, and `npm run build` from `frontend/` ([scripts](../../frontend/package.json#L7)).
- For backend route, filter, or response changes, add or run relevant FastAPI `TestClient` tests in [`backend/tests/test_routes.py`](../../backend/tests/test_routes.py#L3). With Compose running, run `docker compose exec backend pytest -q`; alternatively, from `backend/`, run `pytest -q` when the declared requirements are installed ([backend test dependencies](../../backend/requirements.txt#L1)).
- For changes crossing the client/API boundary, validate both sides: frontend tests/build and backend route tests. A successful page load alone does not verify response shape, filtering, or calculation edge cases.
- For changes to local startup or proxy configuration, use the README-documented Compose path and verify the frontend and backend endpoints ([run instructions](../../README.md#L39), [Compose services](../../docker-compose.yml#L1)).
- Report the exact commands run and their outcomes; distinguish tests from runtime smoke checks.

## Rationale

The frontend suite currently exercises pure calculation/formatting helpers, while the backend suite uses `TestClient` to check route behavior and response values. The package scripts and backend requirements define the available validation tools ([frontend tests](../../frontend/src/lib/financial-utils.test.ts#L26), [backend tests](../../backend/tests/test_routes.py#L29), [backend requirements](../../backend/requirements.txt#L1)).
