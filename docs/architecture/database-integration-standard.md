# MyBlog Database Integration Standard

## Goal

MyBlog must treat the runtime database as a service boundary, not a blob store or an ad hoc page helper.

## Current Boundary

- Blog UI reads content from runtime projections and public runtime indexes.
- Admin/API service owns all direct MySQL access.
- Web pages never connect to MySQL directly.
- Runtime DB stores dynamic state only:
  - reader memory
  - highlights
  - visual source indexes
  - visual pins
  - visual sync runs
  - operator secret entries

## Required Data Flow

```text
Vault / OpenList / Quark / COS
  -> runtime projector
  -> public runtime index
  -> web UI projection

Browser / blog UI
  -> admin-next API
  -> runtime-db.js
  -> CynosDB MySQL
```

## Rules

1. Web UI must not open MySQL connections.
2. All schema changes must go through `apps/admin-next/lib/runtime-db.js`.
3. New database tables must be categorized before creation:
   - runtime state
   - operator secrets
   - audit/history
   - derived caches
4. Blob content must stay outside MySQL.
5. Public site data must be projected, not queried live from the browser.

## Recommended External Pattern

For a richer blog/database platform, the safest mature pattern is:

- UI layer: Astro / Next.js
- API layer: dedicated admin service
- DB layer: MySQL/Postgres service
- content projection layer: build or sync worker
- file/blob layer: OpenList / Quark / COS / local hot mirror

## Directly Cloneable Reference Systems

Use these as architectural references, not mandatory dependencies:

- NocoDB: spreadsheet-like database UI over SQL
- Directus: headless data platform with API-first schema management
- Supabase: managed Postgres + auth + storage + API layer
- PocketBase: compact backend for auth, DB, file, and admin
- Payload CMS: code-first content platform with DB-backed schemas

## MyBlog Position

MyBlog should stay:

- runtime-first
- projection-driven
- API-mediated
- file-store separated

It should not become:

- a direct browser-to-MySQL app
- a database admin panel with a blog shell
- a blob store pretending to be a CMS
