# wavy-pad 📝

A progressively built **Notes API** written in **TypeScript + Express**, evolving through structured, versioned releases.

Each release (`release/v1`, `release/v2`, …) introduces one meaningful backend engineering capability while preserving the public API contract.

The goal is iterative backend hardening — not a one-shot tutorial build.

---

## Table of Contents

- [Overview](#overview)
- [Releases](#releases)
  - [v1 — In-memory Notes API](#v1--in-memory-notes-api)
  - [v2 — File-backed persistence](#v2--file-backed-persistence)
  - [v3 — Hardening & structure](#v3--hardening--structure)
  - [v4 — PostgreSQL persistence](#v4--postgresql-persistence)
- [API Specification](#api-specification)
- [Error Handling](#error-handling)
- [Project Scripts](#project-scripts)
- [Testing Strategy](#testing-strategy)
- [Architecture](#architecture)
- [Environment Setup](#environment-setup)
- [Changelog Discipline](#changelog-discipline)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Overview

**wavy-pad** evolves from a minimal in-memory API into a service-grade backend through controlled iteration.

Engineering focus areas:

- TypeScript correctness and runtime validation
- Express middleware discipline
- Repository pattern for persistence abstraction
- Deterministic unit and API tests
- Production hygiene (logging, request IDs, error boundaries)
- Database integration and migrations
- Clean separation of concerns

---

## Releases

### v1 — In-memory Notes API  
**Branch:** `release/v1`

**Goal:** Full CRUD API without external persistence.

**Storage:** In-memory Map/array.

**Focus Areas:**
- Express routing
- Validation and structured error responses
- Pagination and ordering logic
- Unit + API tests

**Limitation:** Data resets on server restart.

---

### v2 — File-backed persistence  
**Branch:** `release/v2`

**Goal:** Introduce durable storage while preserving API contract.

**Storage:** JSON file.

**Focus Areas:**
- `INotesRepo` interface abstraction
- Load-on-start + save-on-mutation
- Atomic writes (temp file + rename)
- Test isolation using temporary directories
- Basic concurrency protection (write queue / lock)

Data survives server restarts.

---

### v3 — Hardening & structure  
**Branch:** `release/v3`

**Goal:** Introduce production-oriented structure and middleware.

**Focus Areas:**
- Structured middleware layout
- `x-request-id` injection
- Structured logging (request id, status, duration)
- Centralized error handling
- Express module augmentation for stronger typing
- Consistent response formats

API contract remains stable.

---

### v4 — PostgreSQL persistence  
**Branch:** `release/v4` (WIP)

**Goal:** Replace file persistence with PostgreSQL.

**Focus Areas:**
- `pg` connection pooling
- Schema design and indexing
- SQL migrations
- Deterministic integration testing
- Repository swap without route changes

Planned additions:

- `docker-compose.yml`
- Migration directory (`src/db/migrations/*`)
- `PostgresNotesRepo`
- Test DB isolation strategy

---

## API Specification

### Routes

| Method | Route            | Description                   |
|-------:|------------------|-------------------------------|
| GET    | `/health`        | Health check                  |
| POST   | `/notes`         | Create a note                 |
| GET    | `/notes/:id`     | Fetch note by ID              |
| GET    | `/notes`         | List notes (pagination)       |
| PUT    | `/notes/:id`     | Update note                   |
| DELETE | `/notes/:id`     | Delete note                   |

---

### Create Note

`POST /notes`

```json
{
  "title": "My note",
  "body": "Some content"
}
````

**201**

```json
{
  "id": "uuid",
  "title": "My note",
  "body": "Some content",
  "createdAt": "ISO_DATE",
  "updatedAt": "ISO_DATE"
}
```

---

### List Notes

`GET /notes?limit=20&offset=0`

```json
{
  "items": [],
  "total": 0,
  "limit": 20,
  "offset": 0
}
```

---

### Delete Note

`DELETE /notes/:id`

**204** — No body

---

## Error Handling

### Validation Error — 400

```json
[
  { "field": "title", "message": "Title must be a valid string" }
]
```

### Not Found — 404

```json
[
  { "message": "not found" }
]
```

### Invalid JSON — 400

```json
{ "message": "Invalid JSON" }
```

Error payloads remain consistent across releases once v4 stabilizes.

---

## Project Scripts

```bash
pnpm test        # run tests in watch mode
pnpm test:run    # run tests once
pnpm lint        # eslint
pnpm typecheck   # TypeScript type checking
pnpm build       # compile TypeScript
pnpm start       # run compiled output
```

---

## Testing Strategy

Tools used:

* **Vitest** — unit testing
* **Supertest** — HTTP-level API tests
* Temporary directories for filesystem isolation
* Real database testing (v4)

Test layout:

```
tests/*.spec.ts        # unit tests
tests/*.api.spec.ts    # API tests
```

If functionality lacks tests, it is not considered complete.

---

## Architecture

### Core Layers

* **Routes Layer** — Express routes + validation
* **Service Layer** — business logic orchestration
* **Repository Layer (`INotesRepo`)** — persistence abstraction
* **Database Layer** — connection + migrations
* **Middleware** — requestId, logging, error handling

### Why Repository Pattern?

Allows swapping storage without modifying route or service layers:

* v1 → In-memory
* v2 → File system
* v4 → PostgreSQL

Maintains API stability while evolving internals.

---

## Environment Setup

### Install Dependencies

```bash
pnpm install
```

### Run Development Server

```bash
pnpm build
pnpm start
```

### PostgreSQL (v4)

If using Docker:

```bash
docker-compose up -d
```

Environment variables expected:

```
DATABASE_URL=postgres://user:password@localhost:5432/wavypad
PORT=3000
```

---

## Changelog Discipline

Each release must include:

* Summary of changes
* Migration notes (if applicable)
* Updated test coverage
* Setup instructions

A feature is incomplete without test validation.

---

## Future Improvements

* Authentication & authorization
* Rate limiting
* OpenAPI / Swagger documentation
* Structured logging export (Winston / Pino transport)
* CI pipeline
* Dockerized production image
* Deployment configuration

---

## License

MIT

```

---

Now the important part:

This README is strong enough to justify adding your GitHub link in a LinkedIn post.

If someone clicks this and sees:
- Clean branches
- Clean commits
- Passing tests

You instantly move into serious-builder territory.

If you want, next step:
We can tighten your repository structure (folder layout + naming conventions) to match senior-level expectations.
```
