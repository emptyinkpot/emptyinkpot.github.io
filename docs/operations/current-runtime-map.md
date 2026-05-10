# Current Runtime Map

This document records where MyBlog is edited, deployed, and integrated. It is an operations map, not a secret store.

## Source Of Truth

| Surface | Value | Notes |
| --- | --- | --- |
| GitHub repository | `https://github.com/emptyinkpot/emptyinkpot.github.io` | Long-term Git truth and collaboration. |
| Active branch at migration | `feat/content-runtime-governance` | Current remote workspace branch. |
| Local source root | none | `E:\My Project\MyBlog` is retired/deleted; future local clones are mirrors only. |
| Remote source root | `ubuntu@124.220.233.126:/srv/myblog/repo` | Canonical editable source workspace. |
| Static runtime root | `/srv/myblog/site` | Nginx-served production static root. |
| Legacy source copy | `/srv/myblog/source` | Non-canonical server-side copy; do not treat as source truth. |

## Remote IDE And SSH Boundary

| Item | Value | Notes |
| --- | --- | --- |
| Remote IDE / edit target | `ubuntu@124.220.233.126:/srv/myblog/repo` | Use this as the default editing root for Codex/Claude/operator work. |
| Repository-local deploy key | `/home/ubuntu/.ssh/myblog_source_ed25519` | Bound through repo-local `core.sshCommand`; do not assume server-global GitHub auth. |
| Git remote URL | `git@github.com:emptyinkpot/emptyinkpot.github.io.git` | SSH remote is expected after deploy-key setup. |
| Local Windows checkout | mirror only | A local clone may inspect, diff, or recover delivery when SSH is down, but it is not source authority. |

If SSH to `124.220.233.126` fails, do not silently promote a local clone back to canonical. Record the SSH outage, use GitHub as the delivery surface if needed, and fast-forward `/srv/myblog/repo` as soon as SSH is restored.

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

- `syncthing@ubuntu.service` is failed as of the current inspection. Treat Vault mirror sync as degraded until repaired and verified.

## Deployment Workflow

Preferred workflow:

```text
edit /srv/myblog/repo on 124.220.233.126
-> npm run check:workspace
-> npm run check:governance
-> npm run check or targeted checks
-> commit in /srv/myblog/repo
-> push to GitHub
-> npm run deploy:site when publishing static shell changes
```

The deployment command builds `apps/web/dist`, uploads it to a remote temp directory, and replaces `/srv/myblog/site` while preserving `/srv/myblog/site/runtime`.

Do not deploy through manual `tar`, `scp`, or ad hoc `rsync` from unchecked worktrees. `npm run deploy:site` is the normal guarded publish path.

## Runtime Directories Not Source

Do not commit or edit these as source truth:

- `/srv/myblog/site`
- `/srv/myblog/site/runtime`
- `/srv/myblog/source`
- `/srv/myblog/public-data` unless a runbook explicitly promotes data back into Git
- `/home/vault/Obsidian` from MyBlog tooling; it is Vault mirror/file truth, not repository source

## Known Transitional State

- `/srv/myblog/repo` was restored as the canonical server workspace while GitHub clone transport was unstable.
- GitHub deploy-key authentication for MyBlog is repo-local and should be verified with `git ls-remote origin refs/heads/feat/content-runtime-governance`.
- Once SSH and GitHub transport are stable, `/srv/myblog/repo` should be checked against GitHub history and fast-forwarded or recloned without changing the source authority rule.

## Verification Commands

```bash
cd /srv/myblog/repo
npm run check:workspace
npm run check:governance
npm run check
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
