# Memory bank

## Current project state
- The backend test suite is configured under `backend/tests` and is the primary verification for API behavior.
- The frontend uses Vite + Vitest and must have its dependencies installed before running tests.
- The mock financial data model uses ISO dates and standard finance categories: `sales`, `suppliers`, `operational`, `administrative`, and `others`.

## Commands used
- Backend: `pytest backend/tests -q`
- Frontend: `cd frontend && npm install && npm test -- --run`
- Local app: `docker compose up --build`

## Notes
- Dependencies must be installed in the frontend before running Vitest.
- Backend dependencies are installed via `backend/requirements.txt`.
