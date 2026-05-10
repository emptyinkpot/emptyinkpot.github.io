# Workspace Runtime

MyBlog uses explicit workspace authority. A directory existing on disk does not mean it can deploy.

## Canonical Workspace

| Field | Value |
| --- | --- |
| Workspace id | `myblog-canonical-active` |
| Workspace type | `canonical` |
| Root | `/srv/myblog/repo` |
| Manifest | `workspace.manifest.json` |
| Profile | `workspaces/canonical.json` |
| Deployment target | `ubuntu@124.220.233.126:/srv/myblog/site` |
| Deploy command | `npm run deploy:site` |

## Guarded Workflow

```text
cd /srv/myblog/repo
npm run check:workspace
npm run check:governance
npm run check
npm run build
npm run deploy:site
```

`npm run deploy:site` must remain the normal production publish path because it runs `tools/deploy-guard.mjs` and protects `/srv/myblog/site` from unchecked worktrees.

## Remote IDE And GitHub Auth

MyBlog follows the same remote-first operating model as Mortis:

| Field | Value |
| --- | --- |
| Remote IDE / edit root | `ubuntu@124.220.233.126:/srv/myblog/repo` |
| GitHub remote | `git@github.com:emptyinkpot/emptyinkpot.github.io.git` |
| Repo-local SSH key | `/home/ubuntu/.ssh/myblog_source_ed25519` |
| Required Git setting | `core.sshCommand=ssh -i /home/ubuntu/.ssh/myblog_source_ed25519 -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new` |

Server-global Git config is not authority. If `/home/ubuntu/.gitconfig` or `~/.ssh/config` is empty, that is acceptable as long as `/srv/myblog/repo/.git/config` contains the repo-local SSH command.

## Workspace Classes

| Class | Root | Capability |
| --- | --- | --- |
| Canonical | `/srv/myblog/repo` | build, deploy, runtime, schema, PWA, OpenList authority. |
| Experimental | `C:\Users\ASUS-KL\.codex-runtime\worktrees\*` | UI/feed/drawer/visual drafts only. |
| Sandbox | disposable paths | throwaway research/demo work only. |

## Retired Local Workspace

`E:\My Project\MyBlog` is retired. It must not be used as a default edit root, deploy root, or source of truth. If a local checkout is recreated later, it is a synchronized mirror unless the authority documents are explicitly changed first.

If SSH to the server is down, a local mirror may be used only to prepare a GitHub commit. It must not run production deploy, and the next server recovery step is to fast-forward or reclone `/srv/myblog/repo` from GitHub.

## Runtime Output Directories

These are output/runtime state, not source workspaces:

- `/srv/myblog/site`
- `/srv/myblog/site/runtime`
- `/srv/myblog/public-data`
- `/srv/myblog/admin-next/.next`
- `/srv/myblog/services/*` unless a service-specific repo/runbook says otherwise
