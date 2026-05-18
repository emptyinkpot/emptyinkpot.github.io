# MyBlog Quartz

This repository is a native Quartz v4 workspace with MyBlog behavior added as Quartz plugins, configuration, layout, and content projection.

Quartz is the primary framework. MyBlog does not wrap Quartz from a separate app shell.

## Structure

- `quartz/`: Quartz source plus MyBlog plugin code.
- `quartz/plugins/transformers/myblogStyle.ts`: MyBlog visual/runtime plugin.
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

Obsidian/Vault Markdown remains writing truth. Quartz owns publishing, routing, search, backlinks, graph, RSS, and static rendering. MyBlog style and source metadata are injected through `Plugin.MyBlogStyle()`.

DataBase integration remains a separate runtime concern and must not direct-connect from Quartz content rendering.
