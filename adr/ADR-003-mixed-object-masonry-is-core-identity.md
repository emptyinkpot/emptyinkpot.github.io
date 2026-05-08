# ADR-003: Mixed Object Masonry Is Core Identity

## Status

Accepted.

## Context

MyBlog can easily regress into a traditional article list or collection-only grid.

## Decision

The homepage must remain a mixed-object masonry stream.

It should mix MarkdownObject, BookObject, VisualObject, ProjectObject, MusicObject, GitHubObject and KnowledgeCollection projections.

## Consequences

- No single object family owns the homepage.
- Collection cards can appear, but must not replace the stream.
- Search, graph and drawer should preserve mixed-object identity.
