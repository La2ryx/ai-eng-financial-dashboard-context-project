# Evidence and documentation rule

## Purpose

Keep project context useful to future agents by making claims traceable and separating observed facts from assumptions.

## Scope

Applies to project summaries, `verification.md`, `memory-bank/`, `.agents/rules/`, and agent-generated repository documentation.

## Rules

- Support claims about behavior, setup, and conventions with a repository file or a reproducible command. Link source files, and use line anchors for specific claims.
- For verification work, label material claims ✅ verified, ❌ incorrect (and provide the correction), or ❓ unverified. Never describe a student's independent review as complete unless the student confirms it.
- Derive the run path from repository documentation/configuration; record the exact command and observed result rather than assuming a port or successful startup.
- Group engineering findings by useful project categories and map each proposed rule to at least one concrete finding and source.
- In the memory bank, separate implemented behavior, known limitations, and recommendations. Do not turn a plausible improvement into an approved product roadmap.

## Rationale

The README documents a Compose run path and an expected agent-directory structure ([run instructions](../../README.md#L39), [agent structure](../../README.md#L26)). This repository also has concrete behavior that is easy to misstate, such as a fixed frontend period label over date-relative generated data ([frontend label](../../frontend/src/App.tsx#L49), [backend date logic](../../backend/app/routes.py#L65)). Explicit evidence and uncertainty markings help agents avoid repeating that mismatch as fact.
