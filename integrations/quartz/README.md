# Embedded MyBlog Quartz

This directory is an embedded Quartz v4 workspace used to study and stage MyBlog-compatible Markdown, graph, search, component, plugin, emitter, and content projection ideas.

The production MyBlog frontend remains the root `apps/web` Astro runtime. This integration must not replace the public shell, create a second content truth, or claim deployment authority for `https://blog.tengokukk.com/`.

Quartz ideas can be promoted back into `apps/web` only as MyBlog-native modules: capability registries, content projections, plugin protocols, or runtime contracts that preserve the original workbench look and interactions.

## Structure

- `quartz/`: Quartz source plus MyBlog plugin code.
- `quartz/components/myblog/`: MyBlog homepage, navigation, runtime page, and runtime data components implemented as Quartz components.
- `quartz/plugins/emitters/myblogRuntimePages.tsx`: Quartz emitter for former MyBlog page entries and `static/myblog-runtime.json`.
- `quartz/plugins/transformers/myblogStyle.ts`: MyBlog runtime resource plugin for component styling, command palette, reading progress, and source metadata.
- `quartz/myblog/sync-content.mjs`: Obsidian/Vault Markdown to Quartz Markdown projection.
- `quartz/myblog/build.mjs`: build wrapper that stages generated content outside the repo before running Quartz.
- `content/`: optional local/manual sync output, ignored by git.
- `apps/web/dist`: compatibility output for this integration only.

Upstream Quartz documentation is not vendored here. Use https://quartz.jzhao.xyz/ as the canonical reference.

## Commands

```bash
npm run myblog:sync
npm run build
npm run dev
npm run check
```

`MYBLOG_VAULT_ROOT` can point at the public Obsidian docs root. By default it uses `E:/Vaults/Obsidian/docs` on Windows and `/home/vault/Obsidian/docs` on Linux.

`npm run build` writes generated Markdown to a transient sibling directory before invoking Quartz, so the deploy pipeline can build a fallback homepage even when the private Vault is unavailable.

## Boundary

Obsidian/Vault Markdown remains writing truth. Quartz owns publishing, routing, layout, components, search, backlinks, graph, RSS, sitemap, runtime page emission, and static rendering only inside this embedded workspace.

Original MyBlog information architecture is represented in production by `apps/web`; this workspace may mirror channels for evaluation, but it is not the canonical runtime surface.

DataBase/OpenList integrations remain runtime bridge concerns and must not direct-connect from Quartz content rendering.
