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
npm run check
npm run build
npm run deploy:site
```

`npm run deploy:site` must remain the normal production publish path because it runs `tools/deploy-guard.mjs` and protects `/srv/myblog/site` from unchecked worktrees.

## Workspace Classes

| Class | Root | Capability |
| --- | --- | --- |
| Canonical | `/srv/myblog/repo` | build, deploy, runtime, schema, PWA, OpenList authority. |
| Experimental | `C:\Users\ASUS-KL\.codex-runtime\worktrees\*` | UI/feed/drawer/visual drafts only. |
| Sandbox | disposable paths | throwaway research/demo work only. |

## Retired Local Workspace

`E:\My Project\MyBlog` is retired. It must not be used as a default edit root, deploy root, or source of truth. If a local checkout is recreated later, it is a synchronized mirror unless the authority documents are explicitly changed first.

## Runtime Output Directories

These are output/runtime state, not source workspaces:

- `/srv/myblog/site`
- `/srv/myblog/site/runtime`
- `/srv/myblog/public-data`
- `/srv/myblog/admin-next/.next`
- `/srv/myblog/services/*` unless a service-specific repo/runbook says otherwise
