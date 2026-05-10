# Architecture

MyBlog is a knowledge runtime and public projection shell. It combines static Astro rendering with server-side runtime projections and controlled service integrations.

## Layers

| Layer | Path / Service | Responsibility |
| --- | --- | --- |
| Source workspace | `/srv/myblog/repo` | Remote-first editable repository workspace. |
| Public shell | `apps/web` | Astro site, reader surfaces, homepage, collections, search pages. |
| Admin/runtime API | `apps/admin-next` | Server APIs, reader memory, evidence/library runtime, GitHub/OpenList integration. |
| Runtime contracts | `contracts/`, `packages/runtime-contract`, `packages/runtime-kernel` | Machine-readable runtime and frontend authority contracts. |
| Object model | `packages/object-model` | KnowledgeObject schema and projection semantics. |
| Design system | `packages/design-system`, `FRONTEND_DESIGN_PHILOSOPHY.md` | Interaction and visual system primitives. |
| Static deploy output | `apps/web/dist` | Built site artifact before deployment. |
| Production static root | `/srv/myblog/site` | Nginx-served public static site and runtime JSON directory. |
| Vault hot mirror | `/home/vault/Obsidian` | Linux hot mirror of the authoring vault. |
| Public file access | OpenList `/openlist/Obsidian`, COS, Quark | Public file identity and cold/blob storage surfaces. |

## Runtime Flow

```text
Obsidian authoring truth
-> Linux hot mirror
-> runtime content projector
-> runtime content-index JSON
-> Astro projection shell
-> public reader/discovery surfaces
```

Code and deployment flow:

```text
/srv/myblog/repo
-> npm run check:workspace
-> npm run check / npm run build
-> apps/web/dist
-> npm run deploy:site
-> /srv/myblog/site
-> nginx / blog.tengokukk.com
```

## Active Services

- `myblog-admin-next.service`: admin/runtime API service.
- `myblog-runtime-content-projector.service`: projects Linux Vault mirror into runtime JSON.
- `myblog-runtime-sse.service`: emits runtime content-index updates.
- `nginx.service`: public reverse proxy/static server.

Known inactive/problem state:

- `syncthing@ubuntu.service` is currently failed and must be repaired before claiming hot mirror sync is healthy.
- AppFlowy, Directus, Meilisearch, Immich, and composable-stack are target/skeleton services unless separately verified.

## Authority Boundaries

- GitHub owns long-term Git history and collaboration.
- `/srv/myblog/repo` owns active edits and deploy-authoritative builds.
- `/srv/myblog/site` is runtime output, not source.
- `/srv/myblog/source` is legacy/server-side source copy and must not be treated as the canonical editable repository.
- `E:\My Project\MyBlog` is retired and must not be used as default source.
