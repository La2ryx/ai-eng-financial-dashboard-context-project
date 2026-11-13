# Tech stack and execution model

## Frontend

- React with TypeScript, bootstrapped by Vite ([dependencies](../frontend/package.json#L15), [entry point](../frontend/src/main.tsx#L1)).
- Tailwind CSS and Recharts are among the declared UI/chart dependencies ([frontend dependencies](../frontend/package.json#L15)).
- Vite serves the development frontend and proxies `/api` requests to the Compose backend service ([Vite config](../frontend/vite.config.ts#L9)).
- Frontend tests use Vitest; ESLint and TypeScript/Vite provide lint and production-build checks ([scripts](../frontend/package.json#L7)).

## Backend

- FastAPI application with Uvicorn; the container uses Python 3.13 and starts Uvicorn with debugpy enabled ([backend Dockerfile](../backend/Dockerfile#L1), [FastAPI app](../backend/app/main.py#L1)).
- Pydantic response models, query constraints, mock-data generation, filtering, and API routes are in `backend/app/routes.py` ([routes and models](../backend/app/routes.py#L11)).
- Pytest and FastAPI `TestClient` are used for backend tests ([requirements](../backend/requirements.txt#L1), [route tests](../backend/tests/test_routes.py#L3)).

## Local execution

Docker Compose defines separate frontend and backend services; the README documents `docker compose up --build` and the local service addresses ([Compose](../docker-compose.yml#L1), [run instructions](../README.md#L39)). The frontend container runs Vite and the backend container runs the FastAPI app ([frontend Dockerfile](../frontend/Dockerfile#L1), [backend Dockerfile](../backend/Dockerfile#L12)).

## Validation commands

- From `frontend/`: `npm test`, `npm run lint`, and `npm run build`.
- With Compose running: `docker compose exec backend pytest -q`; alternatively, from `backend/`: `pytest -q` when requirements are installed.

The commands above are defined by the frontend scripts and backend test dependencies ([frontend package](../frontend/package.json#L7), [backend requirements](../backend/requirements.txt#L1)).
