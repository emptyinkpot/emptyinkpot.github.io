# System Topology

```text
GitHub emptyinkpot/emptyinkpot.github.io
  <-> /srv/myblog/repo
  -> apps/web Astro build
  -> /srv/myblog/site
  -> Nginx / blog.tengokukk.com

Obsidian Vault
  -> Syncthing hot mirror
  -> Runtime MarkdownObject compiler
  -> content-index.json + article detail JSON
  -> Astro Projection Shell
  -> Home / Drawer / Collections / Search / Graph

OpenList
  -> public file access
  -> COS / Quark cold blob mounts

apps/admin-next + MySQL
  -> runtime state
  -> reader memory
  -> highlights
  -> dynamic APIs
```

## Active Authorities

- Source workspace: `/srv/myblog/repo`
- Authoring: `E:\Vaults\Obsidian`
- Server mirror: `/home/vault/Obsidian`
- Article projection: `public-data/runtime/content-index.json`
- Static shell: `apps/web/dist`
- Server shell: `/srv/myblog/site`
- Runtime state: MySQL through `apps/admin-next`
- File access: OpenList routes under `/openlist/`

## Boundary

Astro is the presentation shell. It does not own the Vault, object storage, runtime state, or semantic truth.
