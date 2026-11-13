# Architecture and API rule

## Purpose

Keep frontend changes aligned with the dashboard's existing data flow and keep API changes aligned with the client/server contract.

## Scope

Applies to changes in `frontend/src`, `backend/app`, and tests that exercise their interactions.

## Rules

- Trace dashboard data from the fetch in [`frontend/src/App.tsx`](../../frontend/src/App.tsx#L15) through calculations in [`frontend/src/lib/financial-utils.ts`](../../frontend/src/lib/financial-utils.ts#L21) before changing KPI or chart behavior.
- Keep API payloads and domain values aligned across FastAPI/Pydantic definitions in [`backend/app/routes.py`](../../backend/app/routes.py#L11) and TypeScript definitions in [`frontend/src/lib/financial-types.ts`](../../frontend/src/lib/financial-types.ts#L1). If a response shape or domain value changes, update the affected client types and relevant tests in the same change.
- Preserve the relative `/api` request path used by the frontend and the Vite proxy to the Compose backend service ([Vite config](../../frontend/vite.config.ts#L9)); do not bake a machine-specific backend host into frontend code.
- Keep displayed period labels consistent with the data returned by the API. The current label is hard-coded while mock-data years are relative to the current date ([label](../../frontend/src/App.tsx#L49), [date generation](../../backend/app/routes.py#L65)).
- Treat the current backend records as generated mock data, not persisted business data ([generator](../../backend/app/routes.py#L94)).

## Rationale

The page currently fetches movement records and calculates its KPI/chart data in the browser, while the API also offers additional aggregation routes. The two sides have parallel domain types, and the development proxy connects them. These facts make tracing the actual active path and checking both sides of any contract change more reliable than assuming every API endpoint is used by the page ([frontend data flow](../../frontend/src/App.tsx#L15), [API routes](../../backend/app/routes.py#L248)).
