# ADR-001: Collections Are Lenses, Not Pages

## Status

Accepted.

## Context

AI and human contributors tend to interpret `Collection`, `Card` and `Drawer` as CMS page concepts. That causes collection grids, standalone collection pages and card walls to replace the intended runtime surface.

## Decision

Collections are lenses over KnowledgeObjects.

Folder and series collections may have generated static reading-session pages. Topic collections remain metadata/search/Graph dimensions and must not become static collection pages.

The primary collection interaction is a ReaderSession, not a CMS directory page.

## Consequences

- Homepage remains a mixed-object surface.
- Drawer remains reading-first.
- Collection context appears as compact TOC/rail.
- Topic collections do not generate `/collections/topic-*` pages.
