# Composable Service Stack

This directory is the deployable skeleton for the mature MyBlog runtime stack.

It is intentionally not auto-started from the static frontend deploy. The current server root disk is too constrained for more containers, so Directus and Meilisearch must only be started after the readiness gate passes.

## Services

| Service | Role | Current Contract |
| --- | --- | --- |
| OpenList + Tencent COS | File truth / large object storage | Active outside this Compose stack |
| Immich | AI media runtime | Managed by `/srv/immich`, not started yet |
| Directus | Metadata overlay / curation admin | Target runtime in this Compose stack |
| Meilisearch | Dynamic search runtime | Target runtime in this Compose stack |
| Astro / MyBlog | Presentation shell | Static site deployed to `/srv/myblog/site` |

## Server Layout

```text
/srv/myblog/services/composable-stack/
├─ docker-compose.yml
├─ .env
├─ directus/
│  ├─ database/
│  └─ uploads/
└─ meilisearch/
```

`directus/database`, `directus/uploads`, and `meilisearch` should live on a dedicated data disk or larger volume, not on the current nearly full root filesystem.

## Readiness Gate

Run this on the target server before starting containers:

```bash
cd /srv/myblog/services/composable-stack
./check-readiness.sh
```

Only when it prints `ready` should you start:

```bash
docker compose up -d
```

## Environment

Copy `.env.example` to `.env` on the server and fill secrets there. Do not commit `.env`.

```bash
cp .env.example .env
chmod 600 .env
```

Required secrets:

- `DIRECTUS_KEY`
- `DIRECTUS_SECRET`
- `DIRECTUS_ADMIN_EMAIL`
- `DIRECTUS_ADMIN_PASSWORD`
- `MEILI_MASTER_KEY`

## Ports

- Directus: `127.0.0.1:8055`
- Meilisearch: `127.0.0.1:7700`

Expose them through Nginx only after authentication, TLS, and upstream health checks are configured.
