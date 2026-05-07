# Runtime Store

`packages/runtime-store` is the store authority contract for MyBlog runtime UI.

It does not own server truth. It must not replace MySQL reader memory, OpenList
file truth, Directus metadata targets, Meilisearch targets, or Immich media
runtime.

## Current Status

P0 contract only. `zustand` is installed in `apps/web`, but no active runtime
owner has migrated into a store yet.

## Store Order

1. `overlayStore`: active overlay stack, focus restore and escape ordering.
2. `commandStore`: command palette open state and selected command action.
3. `readerStore`: shell state only; memory/highlights stay in MySQL.
4. `graphStore`: viewport and selection only after React Flow cutover.
5. `visualStore`: projection state only after visual search authority settles.

## Hard Rules

- Feature-local stores are forbidden unless this package declares the store.
- Stores are projection state, cache or preference, not upstream truth.
- Any persisted key must be classified in Runtime Kernel storage classes.
