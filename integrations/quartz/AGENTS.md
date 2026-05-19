# Embedded MyBlog Quartz Agent Rules

This directory is an embedded Quartz workspace under the MyBlog repository. Treat `integrations/quartz` as the Quartz root only when working inside this integration; it is not the MyBlog production frontend root.

## Read Order

1. `README.md`
2. `project.json`
3. `workspace.manifest.json`
4. `quartz.config.ts`
5. `quartz.layout.ts`

## Structure

- Quartz owns only this integration workspace's framework, routing, Markdown transform, search, backlinks, graph, RSS, and static output.
- MyBlog production behavior stays in the root `apps/web` frontend unless a deliberate, reviewed migration promotes a specific Quartz capability.
- Do not recreate root `apps/web/src`, admin apps, package workspaces, contract folders, or parallel runtime registries inside this integration.
- `content/` is a generated Quartz projection from the public Obsidian/Vault docs root.
- `apps/web/dist` is only a compatibility output path for this integration and must not be treated as production authority.

## Verification

Use these commands before delivery:

```bash
npm run check
npm run build
```

Build warnings from KaTeX over source Markdown are acceptable if Quartz exits successfully.
