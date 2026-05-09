# System Topology

```text
GitHub emptyinkpot/emptyinkpot.github.io
        <->
/srv/myblog/repo          (remote-first source workspace)
        -> npm checks/build/deploy guard
/srv/myblog/site          (Nginx static runtime root)
        -> blog.tengokukk.com

Windows E:\Vaults\Obsidian
        -> Syncthing / mirror path
/home/vault/Obsidian     (Linux hot mirror)
        -> runtime projector
/srv/myblog/site/runtime/content-index.json
        -> reader/home/search projection

apps/admin-next + MySQL
        -> runtime APIs, reader memory, evidence library, GitHub/OpenList bridges
```

## Source And Runtime Roots

| Surface | Root | Status |
| --- | --- | --- |
| Remote source workspace | `ubuntu@124.220.233.126:/srv/myblog/repo` | Canonical editable source. |
| GitHub repository | `https://github.com/emptyinkpot/emptyinkpot.github.io` | Long-term Git truth and branch collaboration. |
| Static production root | `/srv/myblog/site` | Runtime output served by Nginx. |
| Legacy source copy | `/srv/myblog/source` | Non-canonical; do not edit as source truth. |
| Retired local checkout | `E:\My Project\MyBlog` | Deleted/retired; future local clones are mirrors only. |
| Vault authoring truth | `E:\Vaults\Obsidian` | Human writing truth. |
| Linux Vault mirror | `/home/vault/Obsidian` | Server hot mirror; sync health must be verified. |

## Public Surfaces

- `https://blog.tengokukk.com/`: public site.
- `https://blog.tengokukk.com/openlist/`: public OpenList file access.
- `https://blog.tengokukk.com/api/*`: proxied admin/runtime API routes.
- `https://blog.tengokukk.com/runtime/events`: runtime SSE when enabled through Nginx.

## Channel/Service Boundary

MyBlog is the public projection shell. It may integrate GitHub, OpenList, runtime DB, and future mature services, but it should not become a bespoke CMS/search/sync engine when mature substrate services are available.
