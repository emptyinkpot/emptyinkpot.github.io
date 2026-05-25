# MyBlog Agent Rules

This repo inherits the global policy core at `C:\Users\ASUS-KL\.codex\policy\index.md`.


## Required Read Order

Before editing this repository, read:

1. `README.md`
2. `project.json`
3. `workspace.manifest.json`
4. `apps/web/src/data/architectureCodex.ts`

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
- The current deploy-authoritative source workspace is `E:\My Project\MyBlog`; GitHub `main` is the delivery surface and GitHub Actions deploys static output to `/srv/myblog/site`.
- Any change to workspace authority must update `README.md`, `project.json`, `workspace.manifest.json`, `workspaces/*.json` and the `runtime-federation` Architecture Codex entry together.

## Local Source / GitHub Delivery Rule

- Default production edit root: `E:\My Project\MyBlog`.
- Default deploy target: `ubuntu@124.220.233.126:/srv/myblog/site`.
- Do not edit MyBlog source on the server. The server keeps deploy artifacts, runtime data, OpenList/Vault mirrors, services and Nginx only.
- `/srv/myblog/repo` is retired and must not be recreated as an editable source checkout.
- Push local source to GitHub `main`; GitHub Actions is responsible for building and deploying to `/srv/myblog/site`.

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

## Delivery Closure Gate

- Any implementation turn that modifies MyBlog source, docs, contracts, or frontend runtime must end in one of these states:
  - verified, committed, and pushed to the appropriate remote branch
  - explicitly blocked with the failing command, dirty files, and reason it cannot be pushed
- Do not stop after code edits with an uncommitted worktree unless a blocker has been reported.
- For deployable frontend changes, run the repository verification command before commit. If the change is intended for production, continue through the repository delivery path that triggers CI/CD or the guarded production deploy script instead of leaving changes only in a remote workspace.
- If CI/CD or production deployment is branch-gated, state the branch gate and whether the pushed branch does or does not trigger deployment.
