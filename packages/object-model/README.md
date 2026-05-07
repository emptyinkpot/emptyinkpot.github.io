# Object Model

`packages/object-model` is the shared KnowledgeObject model workspace.

It describes object identity and relationships for all projections. It is not a database and does not replace OpenList, MySQL, Directus, Meilisearch, or Immich.

## Rules

- Object IDs must be stable and source-aware.
- Files are sources, not objects by themselves.
- Projection clients render objects but do not own object authority.
