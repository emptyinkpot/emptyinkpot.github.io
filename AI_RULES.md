# AI_RULES

Read this before editing MyBlog.

MyBlog is a Knowledge Runtime Surface. It is not a traditional blog theme, CMS collection site, Notion clone, admin dashboard, or static article index.

## Required Reading

1. `project.frontend-runtime-contract.json`
2. `contracts/frontend-runtime-contract.json`
3. `contracts/runtime-authority-map.json`
4. `contracts/object-projection-contract.json`
5. `contracts/collection-behavior-contract.json`
6. `philosophy/FRONTEND_DESIGN_PHILOSOPHY.md`
7. `philosophy/RUNTIME_IDENTITY.md`
8. `philosophy/COLLECTION_MODEL.md`
9. `topology/SYSTEM_TOPOLOGY.md`
10. `adr/ADR-001-collections-are-lenses-not-pages.md`

## Do Not

- Do not turn collections into standalone CMS pages.
- Do not replace the homepage mixed-object masonry stream with collection grids.
- Do not make feed tabs trigger full route navigation.
- Do not put card walls inside reader drawers.
- Do not destroy feed continuity when opening a collection.
- Do not reset scroll, active filters, drawer state, or runtime context on collection open.
- Do not make `/collections/[slug]/` the primary reading path.
- Do not make topic collections prerender into static collection pages.
- Do not introduce a second article truth beside Runtime MarkdownObject.
- Do not let OpenList become CMS, database, build root, Pagefind root, or hot storage.

## Preserve

- Mixed object feed.
- Runtime overlay drawer.
- Continuous scroll context.
- Client-side filtering.
- Collection as lens.
- Drawer as reading.
- Homepage as discovery.
- Object-first projection.
- Runtime authority boundaries.

## Core Sentence

Collection is context. Drawer is reading. Homepage is discovery. Object projection is the system.
