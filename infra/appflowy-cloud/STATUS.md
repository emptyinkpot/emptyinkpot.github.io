# AppFlowy Cloud Status

Last checked: 2026-05-07

## Server State

- Skeleton installed on server: `/srv/myblog/services/appflowy-cloud`
- Docker available: yes
- Docker Compose available: yes
- AppFlowy containers started: no
- Upstream AppFlowy-Cloud cloned: no

## Blockers

- `project.tengokukk.com` DNS does not currently resolve.
- `/srv/myblog/services/appflowy-cloud` has about 6GB free; readiness requires at least 40GB.
- `.env` on server currently contains placeholder values only and must be replaced before startup.

## Current Verdict

`target-not-deployed`.

Do not run `./install-upstream.sh` or `docker compose up -d` until `./check-readiness.sh` prints `ready`.
