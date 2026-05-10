# Runtime Contract

`packages/runtime-contract` is the shared API contract workspace for MyBlog projections.

Web, PWA/TWA, Android Native, Search, CLI, and AI agents must consume these contracts instead of inventing per-client data shapes.

## Target APIs

- `/api/feed`
- `/api/books`
- `/api/visuals`
- `/api/search`
- `/api/graph`
- `/api/runtime/*`

## Rules

- Contracts define transport shape and versioning.
- Contracts do not own source data.
- Clients may cache responses, but caches are runtime mirrors only.
