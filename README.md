# MyBlog

MyBlog is a knowledge runtime surface and public projection shell. The canonical editable source workspace is `/srv/myblog/repo`; production output is `/srv/myblog/site`; deploys must go through `npm run deploy:site`.

## Runtime Identity

- Primary model: Knowledge Runtime Surface.
- Collection is context. Drawer is reading. Homepage is discovery.
- topic collection 只作为 metadata / search / Graph 维度，不生成静态 topic collection 页面。
- Static Nginx route semantics must stay explicit: `try_files $uri $uri/index.html =404`; this is not a SPA catch-all fallback.

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

OpenList remains a content control plane and cold/blob/public access layer, not a runtime build system, projection authority, database, Pagefind store, Astro dist store, Syncthing hot mirror, node_modules location, system disk, or hot runtime disk.

## Stabilization Sprint

Current stabilization priority:

1. Syncthing / Linux Vault readiness.
2. MarkdownObject schema and validation.
3. Quartz / Flowershow evaluation.

AppFlowy 只保留 `infra/appflowy-cloud/` skeleton during stabilization and must not be started as an active runtime before readiness evidence.

Acceptance commands:

- `npm run check:vault-sync` verifies Syncthing/Linux Vault acceptance.
- `npm run check:workspace` verifies workspace deployment authority.
- `npm run check:governance` verifies repository governance.

## Source Of Truth

- Windows Obsidian authoring truth: `E:\Vaults\Obsidian`.
- Linux runtime hot mirror: `/home/vault/Obsidian`.
- OpenList content control plane: `/openlist/Obsidian`.
- OpenList 本地挂载：`/Obsidian -> /home/vault/Obsidian`.
- OpenList public roots include `/Obsidian`, `/腾讯云COS`, and `/夸克网盘`.
- `/腾讯云COS` is the Tencent COS OpenList cold/blob mount.
- `/夸克网盘` is the Quark OpenList cold/legacy mount.

## OpenList Storage Boundary

OpenList/COS/Quark are cold archive, blob backend, public browse, and content address surfaces. They are not an ext4/system disk replacement and must not be used as the server system disk or hot runtime disk.

The re-generable reader file cache is `openlist-files`. It may be audited or pruned through:

```bash
npm run server:openlist-storage
npm run server:openlist-storage -- --prune-openlist-file-cache --apply
```

## Deployment

Deploy only from the canonical workspace after guard checks:

```bash
cd /srv/myblog/repo
npm run check:workspace
npm run check:governance
npm run check
npm run deploy:site
```
