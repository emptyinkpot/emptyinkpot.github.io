# AI Context

Before modifying MyBlog, read this file first, then read `AGENTS.md`, `project.json`, `workspace.manifest.json`, `ARCHITECTURE.md`, `SYSTEM_TOPOLOGY.md`, `WORKSPACE_RUNTIME.md`, and `docs/operations/current-runtime-map.md`.

MyBlog is not a traditional blog, CMS admin panel, CRUD app, or generic Astro theme. MyBlog is a knowledge runtime surface: a public presentation shell over Obsidian file truth, server runtime projections, reader state, evidence/library surfaces, and controlled deployment authority.

## Remote-First Source Rule

- Default editable source root: `ubuntu@124.220.233.126:/srv/myblog/repo`.
- GitHub repository: `https://github.com/emptyinkpot/emptyinkpot.github.io`.
- Remote IDE / server-side workspace is `/srv/myblog/repo` on `124.220.233.126`.
- Server GitHub auth is repo-local through `/home/ubuntu/.ssh/myblog_source_ed25519`; do not assume global server Git credentials.
- Local Windows checkout `E:\My Project\MyBlog` is retired and must not be used as the default edit or deploy source.
- Normal workflow: edit `/srv/myblog/repo` -> validate remotely -> commit remotely -> push to GitHub -> deploy to `/srv/myblog/site` only through the guarded deployment path.
- Do not hand-run `scp` from an unchecked workspace to `/srv/myblog/site`.
- If SSH is unavailable, treat it as an infrastructure outage. A local mirror can push a corrective documentation commit to GitHub, but it does not become canonical and it must not deploy.

## Read Order For Architecture Work

1. `README.md`
2. `AI_CONTEXT.md`
3. `ARCHITECTURE.md`
4. `SYSTEM_TOPOLOGY.md`
5. `WORKSPACE_RUNTIME.md`
6. `docs/operations/current-runtime-map.md`
7. `topology/SYSTEM_TOPOLOGY.md`
8. `topology/DEPLOY_GRAPH.md`
9. `topology/SYNC_ARCHITECTURE.md`
10. `docs/frontend-runtime-audit.md`
11. `docs/frontend-runtime-convergence.md`
12. `docs/runtime-experience-layer.md`

## Core Principles

- Runtime-first: public pages are projections over content/runtime objects, not independent content islands.
- Collection-as-lens: collections are context and navigation lenses, not separate CMS silos.
- Drawer-first reading: reader flows should preserve reading continuity and avoid card-wall nesting.
- File truth stays outside MyBlog: Obsidian/Vault files are authoring truth; MyBlog projects them.
- Artifact-first deployment: builds, static dist, runtime JSON, Pagefind, and deployment logs are evidence.
- Workspace authority is explicit: `workspace.manifest.json` decides whether a workspace can deploy.

## Current Runtime Boundary

```text
GitHub repository
<-> /srv/myblog/repo remote source workspace
-> npm checks/build
-> apps/web/dist
-> /srv/myblog/site static runtime
-> nginx public routes

Windows Vault
-> Linux /home/vault/Obsidian hot mirror
-> runtime content projector
-> /srv/myblog/site/runtime/content-index.json

apps/admin-next + MySQL
-> runtime APIs / reader memory / evidence surfaces
```

## What Not To Do

- Do not restore `E:\My Project\MyBlog` as canonical source.
- Do not deploy from `.codex-runtime` or another unchecked worktree.
- Do not claim AppFlowy, Directus, Meilisearch, Immich, or composable-stack services are active unless runtime service evidence exists.
- Do not treat OpenList/COS/Quark as system disk, database disk, Syncthing hot mirror, Astro dist, or Pagefind storage.
- Do not add another bespoke sync/search/CMS engine before checking the mature-substrate policy in `project.json`.

## Executable Gates

- `npm run check:workspace` validates workspace authority.
- `npm run check:governance` validates repo governance.
- `npm run check` runs the broader static/runtime validation suite.
- `npm run deploy:site` is the guarded static deployment path.
