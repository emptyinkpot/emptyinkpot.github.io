# MyBlog Quartz Agent Rules

This repository is now a Quartz-primary workspace. Treat the repository root as the Quartz root.

## Read Order

1. `README.md`
2. `project.json`
3. `workspace.manifest.json`
4. `quartz.config.ts`
5. `quartz.layout.ts`

## Structure

- Quartz owns the framework, routing, Markdown transform, search, backlinks, graph, RSS, and static output.
- MyBlog behavior belongs inside Quartz plugins, Quartz layout/configuration, or `quartz/myblog/*`.
- Do not recreate `apps/web/src`, Astro pages, admin apps, package workspaces, contract folders, or parallel runtime registries unless the user explicitly asks to reintroduce that architecture.
- `content/` is a generated Quartz projection from the public Obsidian/Vault docs root.
- `apps/web/dist` is only the Quartz build output path kept for existing GitHub Pages/deploy compatibility.

## Verification

Use these commands before delivery:

```bash
npm run check
npm run build
```

Build warnings from KaTeX over source Markdown are acceptable if Quartz exits successfully.
