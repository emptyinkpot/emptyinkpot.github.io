# MyBlog Quartz

This repository is a native Quartz v4 workspace with MyBlog behavior added as Quartz plugins, configuration, layout, and content projection.

Quartz is the primary framework. MyBlog does not wrap Quartz from a separate app shell.

## Structure

- `quartz/`: Quartz source plus MyBlog plugin code.
- `quartz/plugins/transformers/myblogStyle.ts`: MyBlog visual/runtime plugin.
- `quartz/myblog/sync-content.mjs`: Obsidian/Vault Markdown to Quartz `content/` sync.
- `content/`: generated or fallback Quartz content.
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

## Boundary

Obsidian/Vault Markdown remains writing truth. Quartz owns publishing, routing, search, backlinks, graph, RSS, and static rendering. MyBlog style and source metadata are injected through `Plugin.MyBlogStyle()`.

DataBase integration remains a separate runtime concern and must not direct-connect from Quartz content rendering.
