# AppFlowy Cloud Project Runtime

This directory is the deployable skeleton for the future Project Studio collaboration runtime.

It is intentionally not part of the Astro static frontend. AppFlowy Cloud should run as an independent service on `project.tengokukk.com`; MyBlog only embeds or links to a configured workspace through project frontmatter `appflowyUrl`.

## Current Contract

| Layer | Status | Role |
| --- | --- | --- |
| MyBlog `/projects/[slug]/` | active | Public projection shell and GitHub Workbench fallback |
| AppFlowy Cloud | target-not-deployed | Block editor, database, kanban, comments, realtime workspace |
| `project.tengokukk.com` | blocked | DNS must point to the server before start |
| Server storage | blocked | Root disk is too small for AppFlowy/Postgres/MinIO runtime data |

## Server Layout

```text
/srv/myblog/services/appflowy-cloud/
├─ .env
├─ check-readiness.sh
├─ nginx-project-appflowy.conf
├─ install-upstream.sh
└─ upstream/                 # official AppFlowy-Cloud clone, generated on server
   ├─ docker-compose.yml
   └─ .env                   # real AppFlowy service env, generated from upstream docs
```

## Deployment Model

Do not copy the official AppFlowy Cloud source into MyBlog. The server skeleton clones the official repo into `upstream/`, then runs its Docker Compose from there.

The official compose contains its own Nginx service. Because the host already uses Nginx on ports 80/443, bind AppFlowy internal ports to loopback via `.env`:

```text
NGINX_PORT=127.0.0.1:18080
NGINX_TLS_PORT=127.0.0.1:18443
```

Host Nginx should terminate public TLS for `project.tengokukk.com` and proxy to `127.0.0.1:18080`.

## Readiness Gate

Run before cloning large images or starting containers:

```bash
cd /srv/myblog/services/appflowy-cloud
./check-readiness.sh
```

Only when it prints `ready` may you continue:

```bash
./install-upstream.sh
cd upstream
docker compose up -d
```

## Required Before Start

- DNS: `project.tengokukk.com` resolves to `124.220.233.126`.
- Storage: mount a dedicated data disk or larger volume, then place this stack there or bind Docker volumes there.
- Secrets: copy `.env.example` to `.env`, fill passwords and JWT secrets, then mirror required AppFlowy variables into `upstream/.env`.
- Nginx: install `nginx-project-appflowy.conf` only after DNS and upstream readiness are correct.

## Forbidden

- Do not start AppFlowy on the current nearly-full root disk.
- Do not expose AppFlowy internal Nginx directly on public 80/443.
- Do not claim AppFlowy is active in MyBlog until `appflowyUrl` is configured and the workspace opens.
- Do not scrape iframe DOM for project data; use AppFlowy API/export/importer later.

References:

- AppFlowy Cloud: `https://github.com/AppFlowy-IO/AppFlowy-Cloud`
- AppFlowy deployment guide: `https://appflowy.com/docs/Step-by-step-Self-Hosting-Guide---From-Zero-to-Production`
