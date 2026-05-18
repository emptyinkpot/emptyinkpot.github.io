# MyBlog

MyBlog is a knowledge runtime surface and public projection shell. It presents Obsidian/Vault file truth, runtime projections, reader state, visual surfaces, and deployment authority without becoming a separate CMS, search engine, sync engine, or database owner.

This README is the only human documentation entrypoint for the repository. Machine-readable truth stays in `project.json`, `workspace.manifest.json`, `workspaces/*.json`, `contracts/*.json`, `project.frontend-runtime-contract.json`, and the public Architecture Codex source at `apps/web/src/data/architectureCodex.ts`.

## Runtime Identity

- Primary model: Knowledge Runtime Surface.
- Collection is context. Drawer is reading. Homepage is discovery.
- Everything stays alive.
- Do not turn collections into standalone CMS pages.
- Do not replace the homepage mixed-object masonry stream with collection grids.
- Do not make topic collections prerender into static collection pages.
- Do not make feed tabs route navigation.
- Do not put card walls inside reader drawers.
- topic collection 只作为 metadata / search / Graph 维度，不生成静态 topic collection 页面。
- Static Nginx route semantics must stay explicit: `try_files $uri $uri/index.html =404`; this is not a SPA catch-all fallback.

## Source And Runtime

- GitHub repository: `https://github.com/emptyinkpot/emptyinkpot.github.io`.
- Canonical production source workspace: `/srv/myblog/repo`.
- Production static root: `/srv/myblog/site`.
- Local Windows checkout policy: mirror/delivery fallback only unless the user explicitly scopes work to this checkout.
- Active article projection: `public-data/runtime/content-index.json`.
- Generated production projection: `/srv/myblog/site/runtime/content-index.json`.
- Windows Obsidian authoring truth: `E:\Vaults\Obsidian`.
- Linux runtime hot mirror: `/home/vault/Obsidian`.
- OpenList content control plane: `/openlist/Obsidian`.
- OpenList 本地挂载：`/Obsidian -> /home/vault/Obsidian`.
- OpenList public roots include `/Obsidian`, `/腾讯云COS`, and `/夸克网盘`.

## Repository Shape

- `apps/web`: Astro public shell and frontend runtime.
- `apps/admin-next`: runtime/admin APIs, reader memory, visual runtime, GitHub/OpenList/DataBase bridges.
- `apps/android-shell`: TWA shell contract.
- `packages/*`: runtime, object model, design token, and contract packages.
- `contracts/*`: machine-readable runtime authority and behavior contracts.
- `tools/*`: canonical validators, projectors, importers, and deploy guards.
- `public-data/*`: static public data projections and editable data sidecars.
- `infra/*`: service definitions and skeleton infrastructure.
- `workspaces/*` plus `workspace.manifest.json`: workspace authority.

Documentation markdown outside this README is intentionally avoided unless it is public content data. Long-lived facts belong in README, contracts, project JSON, or executable code.

## DataBase Gateway Boundary

MyBlog integrates DataBase through `apps/admin-next/lib/database-gateway-client.mjs`. The adapter is SDK-first: when `@emptyinkpot/database-gateway-generated-client` is installed in the runtime, MyBlog uses the generated OpenAPI client. When the package is absent, the adapter keeps the same Gateway HTTP contract as a fallback so production builds do not depend on an unpublished package.

MyBlog must not direct-connect to DataBase MySQL. Canonical Markdown projection writes go through `POST /writes/project-obsidian-markdown`; reader memory, highlights, visual runtime, and OpenList target access go through DataBase Gateway routes exposed by the generated client contract.

Obsidian/Vault remains Markdown file truth. DataBase owns structured identity, blocks, assets, relations, semantic context, and future cross-product queries. MyBlog is only a projection client and public rendering shell.

## OpenList Storage Boundary

OpenList/COS/Quark are cold archive, blob backend, public browse, and content address surfaces. They are not an ext4/system disk replacement, system disk, hot runtime disk, runtime build system, projection authority, database, Pagefind store, Astro dist store, Syncthing hot mirror, or `node_modules` location.

The re-generable reader file cache is `openlist-files`. It may be audited or pruned through:

```bash
npm run server:openlist-storage
npm run server:openlist-storage -- --prune-openlist-file-cache --apply
```

## Runtime Database

MyBlog runtime DB is Tencent Cloud CynosDB MySQL through `apps/admin-next`. It owns dynamic state only: reader memory, reader highlights, visual sources, visual pins, visual sync runs, and the explicit plaintext personal information table.

Runtime DB must not store article Markdown bodies, EPUB/PDF/image/video blobs, OpenList files, Tencent COS objects, Quark files, Astro dist, Pagefind output, or Syncthing hot mirror data.

## Content Infrastructure Reduction

Content Infrastructure Reduction is active. MyBlog must not keep growing into a bespoke CMS/search/sync/deploy engine or a giant runtime JSON system.

Mature replacement / substrate lanes:

- Syncthing owns Windows Vault to Linux hot mirror file sync.
- Quartz is a digital garden / Obsidian publishing substrate candidate.
- Contentlayer is a typed content pipeline candidate.
- Meilisearch is the future dynamic search target; 上线前 Pagefind 只叫静态 archive 搜索，不叫全站统一搜索。
- Coolify is a deployment platform candidate.
- Immich is the media runtime candidate.
- Payload / Directus is the object and metadata admin replacement lane.

Current stabilization priority:

1. Syncthing / Linux Vault readiness.
2. MarkdownObject schema and validation.
3. Quartz / Flowershow evaluation.

AppFlowy 只保留 `infra/appflowy-cloud/` skeleton during stabilization and must not be started as an active runtime before readiness evidence.

## Frontend Runtime

- `apps/web/src/data/architectureCodex.ts` is the public Architecture Codex source.
- Frontend runtime changes must update the relevant Codex entry or state why the Codex is unaffected.
- `packages/runtime-kernel` owns frontend command, keyboard, overlay, drawer, focus, navigation, and storage classification contracts.
- `packages/design-system` owns runtime experience tokens.
- Local storage is preference/cache/legacy migration only, not runtime truth.
- Homepage remains the mixed object discovery surface.

## Deployment

Deploy only from a workspace with deployment authority after guard checks:

```bash
cd /srv/myblog/repo
npm run check:workspace
npm run check:governance
npm run check
npm run deploy:site
```

Acceptance commands:

```bash
npm run check:vault-sync
npm run check:workspace
npm run check:governance
npm run check:frontend-contract
```
