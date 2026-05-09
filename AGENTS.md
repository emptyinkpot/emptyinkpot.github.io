# MyBlog Agent Rules

This repo inherits the global policy core at `C:\Users\ASUS-KL\.codex\policy\index.md`.

## Frontend Documentation Freshness

- Any change to `apps/web/` frontend UI, interaction, reader behavior, visual system, homepage information architecture, or frontend runtime must also update the relevant Architecture Codex entry.
- The project canonical Architecture Codex source is `apps/web/src/data/architectureCodex.ts`; public pages are `/codex/` and `/codex/[slug]/`.
- `README.md` keeps the project contract and Codex truth layer. Do not let README and `/codex/` drift.
- Before editing frontend files, state in commentary what is being changed, why it is being changed, and which Codex entry or README section will be refreshed.
- If a frontend change genuinely does not affect the Codex, state that reason explicitly before editing.

## Workspace Capability Governance

- MyBlog supports multiple workspaces and AI worktrees; workspace existence is not authority.
- Before deploying, run `npm run deploy:site` or at minimum `npm run check:workspace`; do not hand-run `scp` from an unchecked worktree.
- The machine-readable workspace authority source is `workspace.manifest.json`.
- Workspaces under `C:\Users\ASUS-KL\.codex-runtime\worktrees\*` are experimental by default: they may prototype UI, feed, drawer, visual and animation changes, but must not deploy, modify PWA authority, runtime schema or OpenList authority unless their manifest explicitly grants that capability and the guard passes.
- The current deploy-authoritative workspace is `/srv/myblog/repo`.
- Any change to workspace authority must update `README.md`, `project.json`, `workspace.manifest.json`, `workspaces/*.json` and the `runtime-federation` Architecture Codex entry together.

## Current Codex Entries

- `reader-system`
- `runtime-architecture`
- `frontend-runtime-archaeology`
- `frontend-runtime-convergence`
- `runtime-experience-layer`
- `content-pipeline`
- `composable-service-stack`
- `runtime-federation`
- `object-layer`
- `projection-clients`
- `knowledge-runtime`
- `visual-system`
- `design-language`
- `collection-stack`
