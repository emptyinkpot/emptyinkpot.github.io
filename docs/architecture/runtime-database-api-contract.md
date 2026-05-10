# Runtime Database API Contract

## Purpose

This contract defines how MyBlog exchanges data with its runtime database boundary.
The browser talks to HTTP APIs. The API service talks to MySQL.

## Ownership

- API owner: `apps/admin-next`
- DB owner: `apps/admin-next/lib/runtime-db.js`
- SQL backend: Tencent Cloud CynosDB MySQL 8.0

## Non-Negotiable Rules

1. Browser code must never connect to MySQL directly.
2. Runtime data must go through `apps/admin-next` HTTP routes.
3. `runtime-db.js` owns schema creation and pool setup.
4. The runtime DB stores dynamic state only.
5. Blob assets, article bodies, and build output stay outside MySQL.

## Public Runtime API Surface

Base path:

```text
/api/runtime/*
```

Current routes:

- `GET /api/runtime/reader/memory`
- `POST /api/runtime/reader/memory`
- `GET /api/runtime/reader/highlights`
- `POST /api/runtime/reader/highlights`
- `GET /api/runtime/visuals/snapshot`
- `POST /api/runtime/visuals/sync`

## Payload Pattern

Every route should follow this envelope:

```json
{
  "ok": true,
  "items": [],
  "item": null
}
```

Failure responses should be JSON:

```json
{
  "ok": false,
  "error": "message"
}
```

## Reader Memory Contract

- `objectId` is required for writes.
- `objectType` defaults to `article`.
- `progress` is normalized to `0..1`.
- `location`, `scrollTop`, `lastReadAt`, `updatedAt` are optional write fields.

## Reader Highlight Contract

- `id`, `objectId`, and `text` are required for writes.
- `objectType` defaults to `article`.
- `color` defaults to `gold`.
- `anchor` is stored as JSON.

## Visual Runtime Contract

- `GET /api/runtime/visuals/snapshot` is a read-only projection surface.
- `POST /api/runtime/visuals/sync` updates the runtime projection layer.

## External Database Service Contract

If a separate `DataBase` repository exists, it should expose a similar API boundary:

```text
GET    /api/v1/health
GET    /api/v1/schema
GET    /api/v1/tables/:table
POST   /api/v1/tables/:table/query
POST   /api/v1/tables/:table/insert
PATCH  /api/v1/tables/:table/:id
DELETE /api/v1/tables/:table/:id
```

That service can be more general than MyBlog, but the browser still must talk HTTP, not SQL.

## Recommended Expansion Path

If MyBlog needs richer database integration later, add these layers in order:

1. API contract
2. auth and session boundary
3. read projection cache
4. mutation audit trail
5. database sidecar admin UI

## Suggested Sidecar Choices

- NocoDB for quick DB UI
- Directus for API-first content/data management
- PocketBase for a small all-in-one backend
- Supabase for managed database platform behavior
