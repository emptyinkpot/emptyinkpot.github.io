# Blog Platform Reference Map

## Purpose

This document records which mature systems MyBlog borrows from, what concepts are adopted, and what is intentionally not copied.

## Reference Systems

### Ghost

- Borrow: publishing workflow, content organization, memberships/newsletters, theme layering, front-end/back-end separation
- Do not copy: Ghost's full CMS/admin stack or its server runtime
- Why: MyBlog needs stronger platform behavior without turning into a traditional CMS

### Quartz

- Borrow: Markdown-first knowledge structure, backlinks, graph thinking, digital-garden navigation, topic sense
- Do not copy: Quartz's implementation details or vault-centric runtime assumptions
- Why: MyBlog wants stronger knowledge organization and article adjacency

### Astro Blog Templates

- Borrow: content collections, static output discipline, componentized pages, simple deployment
- Do not copy: generic starter aesthetics or shallow blog defaults
- Why: Astro remains the site assembly layer and deployment baseline

### WriteFreely / Mastodon

- Borrow: public writing flow, timeline thinking, social distribution, lightweight feedback loops
- Do not copy: federated protocol implementation or a social network rewrite
- Why: MyBlog needs distribution and audience-facing publishing patterns

## MyBlog Direction

MyBlog should become:

- a content platform with stronger editorial structure
- a knowledge-oriented blog with runtime continuity
- a publication surface with social distribution affordances
- a productized front-end, not a generic blog shell

## Explicit Non-Goals

- Do not rebuild Ghost, Quartz, Mastodon, or WriteFreely in full
- Do not turn MyBlog into a CMS heavy platform
- Do not add new layers before the current reader/runtime boundary is stable
- Do not weaken the existing contracts to chase feature breadth
