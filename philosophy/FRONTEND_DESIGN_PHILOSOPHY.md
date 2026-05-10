# MyBlog Frontend Design Philosophy

MyBlog is not a traditional blog.

It is a Knowledge Runtime Surface.

## Core Idea

The homepage is a continuous mixed-object discovery surface.

It must preserve:

- mixed masonry feed
- feed tabs
- drawer peek
- runtime refresh
- collection lens
- search overlay
- graph projection
- spatial continuity

The user should feel they are staying inside one living surface, not jumping between CMS pages.

Everything stays alive: feed, tabs, scroll position, drawer, search and graph overlays are coexisting runtime state, not page replacements.

## Primary Ontology

KnowledgeObject is the center.

A post, note, book, visual, music item, GitHub repo, project or update is a KnowledgeObject.

Pages are only projections.

## Interaction Rule

Do not turn collections into page centers.

A collection is a lens, not a destination.

Correct:

```text
Feed Surface
-> Collection Lens
-> Reader Drawer
-> Object Switch
```

Wrong:

```text
Feed
-> Collection Page
-> Card Grid
-> Article Page
```

## Drawer Rule

The drawer is a ReaderSession.

It should show the active object first.

Collection context belongs in a compact TOC rail, top bar or bottom rail.

The drawer must not become a card wall.

## Homepage Rule

The homepage must remain a heterogeneous runtime stream.

It should mix:

- posts
- notes
- books
- visuals
- music
- GitHub objects
- projects
- collections

Collections may organize the stream, but must not replace the stream.

## Visual Grammar

Use different UI forms for different semantic roles:

| Role | UI |
| --- | --- |
| Object preview | Card |
| Reading | Prose surface |
| Collection | TOC / lens / rail |
| Search | Overlay |
| Graph | Node projection |
| Metadata | Chips |
| Runtime status | Compact signal |

Forbidden pattern:

> Everything is a card.

## Anti-Regression Rules

Do not:

- replace homepage with collection-only page
- make feed tabs full route navigation
- reset scroll when opening drawer
- make collection pages the primary reading path
- put card grids inside reader drawer
- make collection hero louder than article content
- remove mixed-object masonry identity

## Final Sentence

MyBlog is a living mixed-object runtime surface.

Collection is context.

Article/object is content.

Drawer is reading.

Homepage is discovery.
