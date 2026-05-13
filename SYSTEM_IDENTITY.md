---
title: MyBlog System Identity
status: canonical
owner: MyBlog
---

# MyBlog System Identity

MyBlog is the Projection Shell for the emptyinkpot content ecosystem.

It is not a workflow runtime, domain truth owner, private runtime client, or
database consumer.

## Fundamental Identity

MyBlog owns public presentation:

- reader experience
- search and navigation
- collection lenses
- public knowledge surfaces
- public evidence library surfaces
- static and runtime projection rendering
- public site build artifacts

## Consumption Boundary

MyBlog consumes public artifacts:

```text
public-content-bundle/
evidence-library/
generated-mdx/
search-index/
runtime/content-index.json
apps/web/dist/
```

These artifacts may come from DataBase projection contracts, ContentBase publish
manifests, Obsidian/Vault projection, or other explicitly public sources.

## Must Never Become

MyBlog must not become:

- a direct database client
- a DataBase schema mirror
- a ContentBase workflow runtime
- a generation or publish orchestrator
- a private runtime API dependency for public rendering
- an owner of domain truth

## Dependency Rule

MyBlog renders public projection artifacts. It must not fetch private workflow
state or infer durable domain truth from presentation data.

The cross-repo constitution is owned by DataBase at:

```text
docs/contracts/three-repo-topology-constitution.md
```
