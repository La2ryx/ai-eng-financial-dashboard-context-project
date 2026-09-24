# Project workflow rules

## Core expectations
- Validate the backend and frontend separately before claiming the project is ready.
- Prefer small, test-driven changes that address one root cause at a time.
- Keep the API and the UI aligned with the same financial data model.
- Document any environment or setup requirements in the project memory bank.

## Verification
- Run backend tests with `pytest backend/tests -q`.
- Run frontend tests with `npm test -- --run` from the `frontend` directory.
- If a package is missing, install the declared dependencies before debugging code behavior.

## Change hygiene
- Update tests when behavior changes intentionally.
- Preserve deterministic behavior for generated mock financial data.
- Keep calculations consistent with the data schema in the TypeScript and Python layers.
