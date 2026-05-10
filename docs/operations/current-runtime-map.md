# Current Runtime Map

This document records where MyBlog is edited, deployed, and integrated. It is an operations map, not a secret store.

## Source Of Truth

| Surface | Value | Notes |
| --- | --- | --- |
| GitHub repository | `https://github.com/emptyinkpot/emptyinkpot.github.io` | Long-term Git truth and collaboration. |
| Active delivery branch | `main` | GitHub Pages deploys from main only. |
| Remote IDE / edit root | `server-170:/home/ubuntu/workspaces/MyBlog` | Canonical remote source workspace for normal edits. |
| Remote integration root | `server-170:/home/ubuntu/workspaces/MyBlog-main-integration` | Temporary main-derived integration worktree for repairing branch drift. |
| Local source root | none | `E:\My Project\MyBlog` is retired; future local checkouts are mirrors only. |
| Static runtime mirror | `ubuntu@124.220.233.126:/srv/myblog/site` | Historical/live server mirror root, not the source workspace. |
| Legacy source copy | `/srv/myblog/source` | Non-canonical server-side copy; do not treat as source truth. |

## Remote IDE And SSH Boundary

| Item | Value | Notes |
| --- | --- | --- |
| Remote IDE / edit target | `server-170:/home/ubuntu/workspaces/MyBlog` | Use this as the default editing root for Codex/Claude/operator work. |
| Git remote URL | `https://github.com/emptyinkpot/emptyinkpot.github.io.git` | Current delivery surface. |
| GitHub delivery auth | temporary askpass token when needed | Do not write GitHub tokens into repo files or remote git config. |
| Local Windows checkout | mirror only | A local clone may inspect, diff, or recover delivery when SSH is down, but it is not source authority. |

If SSH to `server-170` fails, do not silently promote a local clone back to canonical. Record the SSH outage, use GitHub as the delivery surface if needed, and reconcile `server-170:/home/ubuntu/workspaces/MyBlog` as soon as SSH returns.

## Public URLs

| Surface | URL |
| --- | --- |
| Public site | `https://blog.tengokukk.com/` |
| OpenList surface | `https://blog.tengokukk.com/openlist/` |
| Project workbench | `https://blog.tengokukk.com/projects/` |
| Evidence library | `https://blog.tengokukk.com/evidence-library/` |
| Search | `https://blog.tengokukk.com/search/` |

## Active Server Services

| Service | Current meaning |
| --- | --- |
| `nginx.service` | Public web entry and reverse proxy. |
| `myblog-admin-next.service` | Admin/runtime API service. |
| `myblog-runtime-content-projector.service` | Projects `/home/vault/Obsidian/docs` to runtime content JSON. |
| `myblog-runtime-sse.service` | SSE notifier for runtime content-index changes. |

Known issue:

- `syncthing@ubuntu.service` was previously failed during inspection. Treat Vault mirror sync as degraded until repaired and verified.

## Deployment Workflow

Preferred workflow:

```text
edit /home/ubuntu/workspaces/MyBlog on server-170
-> npm run check:workspace
-> npm run check:governance
-> npm run check or targeted checks
-> commit in /home/ubuntu/workspaces/MyBlog or a server-170 integration worktree
-> push to GitHub
-> merge/push main to trigger GitHub Pages
```

GitHub Actions builds `apps/web/dist` and deploys GitHub Pages from `main`. `/srv/myblog/site` is a historical/live mirror root, not the current source root.

Do not deploy through manual `tar`, `scp`, ad hoc `rsync`, or unchecked worktrees. `npm run check:workspace` plus GitHub Actions is the normal guarded path.

## Runtime Directories Not Source

Do not commit or edit these as source truth:

- `/srv/myblog/site`
- `/srv/myblog/site/runtime`
- `/srv/myblog/source`
- `/srv/myblog/public-data` unless a runbook explicitly promotes data back into Git
- `/home/vault/Obsidian` from MyBlog tooling; it is Vault mirror/file truth, not repository source

## Transitional State

- `server-170:/home/ubuntu/workspaces/MyBlog` is the current canonical remote IDE workspace.
- `server-170:/home/ubuntu/workspaces/MyBlog-main-integration` is an integration worktree used to repair the previous feature-branch/main drift.
- `/srv/myblog/repo` must not be revived as source authority unless `project.json`, `workspace.manifest.json`, `AGENTS.md`, and this document are changed together.
- GitHub delivery should be verified with `git ls-remote origin refs/heads/main`.

## Verification Commands

```bash
cd /home/ubuntu/workspaces/MyBlog
npm run check:workspace
npm run check:governance
npm run check
npm run build
```

Operational checks:

```bash
systemctl status myblog-admin-next.service myblog-runtime-content-projector.service myblog-runtime-sse.service nginx.service
systemctl status syncthing@ubuntu.service
```

## Runtime Database Boundary

MyBlog's active runtime database is Tencent Cloud CynosDB Serverless MySQL, not the local MariaDB service and not an OpenList/Quark/COS file store.

| Item | Value | Notes |
| --- | --- | --- |
| Runtime DB type | `CynosDB MySQL 8.0` | Serverless Tencent Cloud MySQL-compatible database. |
| Cluster id | `cynosdbmysql-no0zqua0` | Control-plane identifier. |
| Public endpoint | `124.220.245.121:22295` | Current `/etc/myblog-admin-next.env` target. |
| Database | `cloudbase-4glvyyq9f61b19cd` | Current `MYBLOG_DB_NAME`. |
| Service owner | `apps/admin-next` | Reads `MYBLOG_DB_*` from `/etc/myblog-admin-next.env`. |
| Schema owner | `apps/admin-next/lib/runtime-db.js` | Creates/checks runtime tables idempotently. |
| Local MariaDB | `127.0.0.1:3306` | Running on the server, but not the active MyBlog Runtime DB. |

Runtime DB owns dynamic state only: reader memory, highlights, visual source indexes, visual pins and visual sync runs. It must not store article bodies, EPUB/PDF/image/video blobs, OpenList files, COS objects, Quark files, Astro dist, Pagefind output, or Syncthing hot mirror data.

Current verified Runtime DB environment values, excluding secrets:

```text
MYBLOG_DB_HOST=124.220.245.121
MYBLOG_DB_PORT=22295
MYBLOG_DB_USER=openclaw
MYBLOG_DB_NAME=cloudbase-4glvyyq9f61b19cd
```

The private CynosDB endpoint `172.17.0.3:3306` was not routable from the current Lighthouse host during the 2026-05-10 check, so production currently uses the public endpoint. Revisit VPC routing before switching to the private endpoint.

## Plaintext Personal Information Store

MyBlog Runtime DB includes a dedicated plaintext personal information table by operator requirement.

| Item | Value |
| --- | --- |
| Table | `personal_secret_entries` |
| Plaintext value column | `secret_value` |
| Mode | `plaintext-by-user-requirement` |
| Database | `cloudbase-4glvyyq9f61b19cd` |

This table is intended to store personal account/password/API-key style information as readable text in MySQL. Real values must be inserted into MySQL only; do not place actual passwords, cookies, tokens, or API keys in Git, README examples, screenshots, or logs.
