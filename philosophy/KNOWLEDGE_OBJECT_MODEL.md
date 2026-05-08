# Knowledge Object Model

KnowledgeObject is the unit of meaning.

Files, Markdown, JSON, OpenList paths, MySQL rows and static pages are carriers or projections. They are not the conceptual center.

## Current Object Families

- MarkdownObject
- BookObject
- VisualObject
- ProjectObject
- MusicObject
- GitHubObject
- KnowledgeCollection

## Projection Rule

One object can project into many surfaces:

- home feed card
- drawer reader
- full article route
- search result
- graph node
- collection member
- RSS item

The projection may change shape. The object identity must remain stable.

## Authority Rule

Object existence must come from the active authority map, not from UI convenience:

- Articles: Runtime MarkdownObject index
- Books: OpenList file index plus metadata overlay
- Visuals: current manifest/runtime snapshot until Immich is deployed
- Runtime state: MySQL
- Files: Vault/OpenList/COS/Quark according to storage boundary
