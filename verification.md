# Project summary and verification

## AI-generated project summary (checked against the repository)

This repository contains a financial metrics dashboard with a React and TypeScript frontend and a FastAPI backend ([README](./README.md#L18)). The frontend is mounted from `frontend/src/main.tsx`; `frontend/src/App.tsx` fetches financial movements from `/api/metrics`, calculates KPI and monthly chart data, and renders dashboard components ([entry point](./frontend/src/main.tsx#L1), [app](./frontend/src/App.tsx#L11)). The backend application is created in `backend/app/main.py` and includes its routes from `backend/app/routes.py` ([application](./backend/app/main.py#L1)).

The backend currently generates mock movements rather than reading a persistent store. It seeds generation for API responses, creates 30 movements for each of 12 months, and has a test that checks the generated 360 records and chronological ordering ([generator](./backend/app/routes.py#L94), [test](./backend/tests/test_routes.py#L12)). Its routes provide raw movements, facets, grouped summaries, top categories, period comparisons, alerts, and B2B/B2C-specific movements ([routes](./backend/app/routes.py#L243)).

Local development is configured with Docker Compose: the frontend is a Vite development server, the backend runs FastAPI under Uvicorn with debugpy, and Vite proxies `/api` requests to the backend service ([Compose](./docker-compose.yml#L1), [frontend Dockerfile](./frontend/Dockerfile#L1), [backend Dockerfile](./backend/Dockerfile#L1), [Vite config](./frontend/vite.config.ts#L9)). The documented startup command is `docker compose up --build`; the README lists the frontend, backend, and API-docs addresses ([run instructions](./README.md#L39)).

## Repository map and entry points

| Area | Entry point or evidence | Responsibility |
| --- | --- | --- |
| Frontend bootstrap | [`frontend/src/main.tsx`](./frontend/src/main.tsx#L1) | Mounts the React application. |
| Dashboard page | [`frontend/src/App.tsx`](./frontend/src/App.tsx#L23) | Loads API movements, derives KPIs/monthly data, and composes dashboard sections. |
| Frontend calculations | [`frontend/src/lib/financial-utils.ts`](./frontend/src/lib/financial-utils.ts#L1) | Calculates KPI totals, monthly chart points, and display formatting. |
| Backend application | [`backend/app/main.py`](./backend/app/main.py#L1) | Creates the FastAPI application and registers the router. |
| API and mock-data logic | [`backend/app/routes.py`](./backend/app/routes.py#L1) | Defines movement models, mock generation, filtering, summaries, and endpoints. |
| Frontend tests | [`frontend/src/lib/financial-utils.test.ts`](./frontend/src/lib/financial-utils.test.ts#L1) | Vitest coverage for KPI/monthly calculations and formatting. |
| Backend tests | [`backend/tests/test_routes.py`](./backend/tests/test_routes.py#L1) | Pytest/TestClient checks for generated data and API behavior. |
| Local services | [`docker-compose.yml`](./docker-compose.yml#L1) | Builds and connects the frontend and backend containers. |

## Run path and checks performed

Repository evidence was used to select the run path: the README documents `docker compose up --build`, Compose defines both services, and their Dockerfiles define the frontend and backend commands ([README](./README.md#L39), [Compose](./docker-compose.yml#L1)).

In this workspace, `docker compose up --build -d` completed successfully. The frontend at `http://localhost:5173/` and backend API documentation at `http://localhost:8000/docs` both returned HTTP 200, and `docker compose ps` showed both services running. These checks confirm this workspace's startup path; they do not prove an independent student setup or spot-check.

## Claim verification trail

| Claim | Status | Evidence and correction |
| --- | --- | --- |
| The project is a React/TypeScript frontend with a FastAPI backend. | ✅ Verified | The README states the stack; the frontend package and FastAPI application corroborate it ([README](./README.md#L18), [package](./frontend/package.json#L1), [backend app](./backend/app/main.py#L1)). |
| The documented local run path uses Docker Compose for both services. | ✅ Verified | README command and service definitions agree; this workspace's Compose startup and HTTP probes succeeded ([README](./README.md#L39), [Compose](./docker-compose.yml#L1)). |
| The dashboard's “2024 - Full Year” label proves the API returns 2024-only data. | ❌ Incorrect claim; corrected | The label is hard-coded in the frontend ([App](./frontend/src/App.tsx#L49)), but the API generator chooses years relative to `date.today()` ([date logic](./backend/app/routes.py#L65), [generator](./backend/app/routes.py#L94)). The displayed label is not evidence that the underlying dataset is limited to 2024. |
| The student independently reviewed the generated summary and setup. | ❓ Unverified | An agent can provide evidence and a reproducible run, but cannot claim the student's independent spot-check. The student should compare the claims with the linked files and confirm the environment-specific setup. |

## Checklist status at initial inspection

The application and local run path existed, but there were no `.agents/rules/` files or `memory-bank/` directory at the start of this work. Those deliverables and their validation evidence are tracked in the task's later phases; this statement records the initial state, not the final submission status.
