# MyBlog Quartz

This repository is a native Quartz v4 workspace with MyBlog behavior added through Quartz-native components, plugins, emitters, configuration, layout, runtime data, and content projection.

Quartz is the only primary framework. MyBlog does not wrap Quartz from a separate app shell, and the old Astro shell is not part of this repository shape.

The public experience intentionally preserves the original MyBlog workbench look and interactions: mixed object feed, reader drawer, local reading memory, bookmarks, highlights, annotations, seal stamps, command/search surface, and source/runtime navigation. Those features are implemented as Quartz-native runtime components/resources, not as an Astro or Next outer shell.

## Structure

- `quartz/`: Quartz source plus MyBlog plugin code.
- `quartz/components/myblog/`: MyBlog homepage, navigation, runtime page, and runtime data components implemented as Quartz components.
- `quartz/plugins/emitters/myblogRuntimePages.tsx`: Quartz emitter for former MyBlog page entries and `static/myblog-runtime.json`.
- `quartz/plugins/transformers/myblogStyle.ts`: MyBlog runtime resource plugin for component styling, command palette, reading progress, and source metadata.
- `quartz/myblog/sync-content.mjs`: Obsidian/Vault Markdown to Quartz Markdown projection.
- `quartz/myblog/build.mjs`: build wrapper that stages generated content outside the repo before running Quartz.
- `content/`: optional local/manual sync output, ignored by git.
- `docs/`: upstream Quartz documentation retained as vendored reference.
- `apps/web/dist`: Quartz build output for existing Pages/deploy compatibility.

## Commands

```bash
npm run myblog:sync
npm run build
npm run dev
npm run check
```

`MYBLOG_VAULT_ROOT` can point at the public Obsidian docs root. By default it uses `E:/Vaults/Obsidian/docs` on Windows and `/home/vault/Obsidian/docs` on Linux.

`npm run build` writes generated Markdown to a transient sibling directory before invoking Quartz, so GitHub Pages can build a fallback homepage even when the private Vault is unavailable.

## Boundary

Obsidian/Vault Markdown remains writing truth. Quartz owns publishing, routing, layout, components, search, backlinks, graph, RSS, sitemap, runtime page emission, and static rendering.

Original MyBlog information architecture is represented by Quartz runtime channels: posts, notes, collections, series, categories, tags, knowledge, books, OpenList books, music, visuals, GitHub, projects, codex, evidence library, reader, OpenList, Pinterest, settings, search, updates, about, API keys, and edit intake.

DataBase/OpenList integrations remain runtime bridge concerns and must not direct-connect from Quartz content rendering.
