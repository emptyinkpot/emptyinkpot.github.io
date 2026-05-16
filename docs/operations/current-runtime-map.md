# Current Runtime Map

This document records where MyBlog is edited, deployed, and integrated. It is an operations map, not a secret store.

## Source Of Truth

| Surface | Value | Notes |
| --- | --- | --- |
| GitHub repository | `https://github.com/emptyinkpot/emptyinkpot.github.io` | Long-term Git truth and collaboration. |
| Active production source branch | `backup/production-myblog-source-20260510` / integration PR branch | Production source is now preserved on GitHub and must be integrated before main deploys production. |
| Local source root | none | `E:\My Project\MyBlog` is retired/deleted; future local clones are mirrors only. |
| Production source root | `ubuntu@124.220.233.126:/srv/myblog/repo` | Current production-capable source workspace. |
| Integration source root | `ubuntu@124.220.233.126:/srv/myblog/repo` | Historical integration path; production source truth is now /srv/myblog/repo on server-124. |
| Static runtime root | `/srv/myblog/site` | Nginx-served production static root. |
| Legacy source copy | `/srv/myblog/source` | Non-canonical server-side copy; do not treat as source truth. |

## Remote IDE And SSH Boundary

| Item | Value | Notes |
| --- | --- | --- |
| Production IDE / edit target | `ubuntu@124.220.233.126:/srv/myblog/repo` | Use this for production runtime/deploy work. |
| Integration IDE / edit target | `ubuntu@124.220.233.126:/srv/myblog/repo` | Use this for GitHub recovery and PR integration work. |
| Repository-local deploy key | `/home/ubuntu/.ssh/myblog_source_ed25519` | Bound through repo-local `core.sshCommand`; do not assume server-global GitHub auth. |
| Git remote URL | `git@github.com:emptyinkpot/emptyinkpot.github.io.git` | SSH remote is expected after deploy-key setup. |
| Local Windows checkout | mirror only | A local clone may inspect, diff, or recover delivery when SSH is down, but it is not source authority. |

If SSH to `124.220.233.126` fails, do not silently promote a local clone back to canonical. Record the SSH outage, use GitHub as the delivery surface if needed, and reconcile `/srv/myblog/repo` and the server-170 integration workspace as soon as SSH is restored.

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

`myblog-runtime-content-projector.service` can also project structured Markdown identity into DataBase when explicitly enabled:

```env
MYBLOG_DATABASE_CANONICAL_PROJECTION=1
MYBLOG_DATABASE_GATEWAY_URL=https://database.tengokukk.com
MYBLOG_DATABASE_GATEWAY_API_KEY=<optional when DataBase auth is disabled>
MYBLOG_DATABASE_AUTHOR_PROFILE_ID=emptyinkpot_primary_author
```

When enabled, Gateway write failures are fatal for the projector process. This keeps the DataBase projection from drifting into a silent partial-success state. When disabled, MyBlog only writes runtime JSON and does not claim canonical DataBase projection is active.

Known issue:

- `syncthing@ubuntu.service` is failed as of the current inspection. Treat Vault mirror sync as degraded until repaired and verified.

## Deployment Workflow

Preferred workflow:

```text
edit /srv/myblog/repo on 124.220.233.126
-> npm run check:workspace
-> npm run check:governance
-> npm run check or targeted checks
-> git status must be clean
-> branch must be main and HEAD must match origin/main
-> commit in /srv/myblog/repo
-> push to GitHub
-> deploy only with npm run deploy:site from the production-authorized workspace when publishing to blog.tengokukk.com
```

The deployment command replaces `/srv/myblog/site` while preserving `/srv/myblog/site/runtime`.

Do not run the full Astro/Pagefind build on the production Lighthouse host. That
host is a 4 GB runtime box and full builds can starve SSH, nginx, and the Gateway.
For production deploys, build `apps/web/dist` off-box, upload the finished dist
into `/srv/myblog/repo/apps/web/dist`, then run:

```bash
MYBLOG_DEPLOY_SKIP_BUILD=1 npm run deploy:site
```

`npm run deploy:site` deliberately refuses a full build when executed from
`/srv/myblog/repo` without `MYBLOG_DEPLOY_SKIP_BUILD=1`.

Do not deploy through manual `tar`, `scp`, or ad hoc `rsync` from unchecked worktrees. `npm run deploy:site` is the only publish path, and it now refuses dirty trees, non-main branches, and trees that are not synced to `origin/main`.

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

## DataBase Canonical Projection Boundary

DataBase, not MyBlog, owns structured content truth for cross-product use. The only MyBlog write path into that platform is:

```text
myblog-runtime-content-projector.service
-> DataBase Gateway POST /writes/project-obsidian-markdown
```

MyBlog does not direct-connect to DataBase MySQL for canonical content, does not define DataBase table schemas, and does not create a local shadow registry of content works. It sends Vault-derived source identity, frontmatter, blocks, assets, and Obsidian relations to the Gateway contract.


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

## 2026-05-10 Source Drift Incident

GitHub main temporarily lagged the production-capable source tree. The production source state from `/srv/myblog/repo` was preserved on GitHub as `backup/production-myblog-source-20260510` and PR #42. Do not deploy GitHub Pages artifacts over `/srv/myblog/site` unless the production source tree has first been integrated and verified.
