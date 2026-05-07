# Runtime Kernel

`packages/runtime-kernel` is the frontend interaction contract for MyBlog.

It does not replace:

- `packages/runtime-contract`, which owns API transport envelopes.
- `packages/object-model`, which owns KnowledgeObject identity and relations.
- `apps/admin-next`, which owns server runtime bridges and MySQL-backed state.

The kernel exists to converge command, keyboard, overlay, drawer, focus and browser cache behavior before the current inline-script runtime splits into incompatible owners.

## Status

P0 contract only. It is dependency-free and not wired into production behavior yet.

## Boundaries

- Commands describe user intent.
- Overlays describe stackable UI layers.
- Drawers describe contextual reading/detail surfaces.
- Storage classifications describe whether browser state is a preference, cache, migration source or temporary local authority.
- The kernel is not a store, database, router or CMS.

## Migration Rule

Existing custom events remain as legacy bridges until a surface is migrated:

- `home-search-open`
- `openlist-embed-open`
- `pinterest-embed-open`
- `reader-command`
- `emptyinkpot:book-drawer-open`
- `emptyinkpot:book-drawer-close`

New runtime work should add a typed command or overlay intent here before adding another global event.
