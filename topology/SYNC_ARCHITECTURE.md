# Sync Architecture

```text
Windows E:\Vaults\Obsidian
  -> Syncthing / Obsidian Sync
  -> Linux /home/vault/Obsidian
  -> Runtime projector reads /home/vault/Obsidian/docs
  -> /srv/myblog/site/runtime/content-index.json
```

## Rules

- MyBlog does not upload Vault files as a sync system.
- OpenList does not own the editable Vault.
- OpenList exposes public file identity.
- Runtime projector does not run Astro build, Pagefind or deploy.
- Shell changes deploy through `npm run deploy:site`.
