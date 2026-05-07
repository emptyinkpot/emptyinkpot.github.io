# MyBlog Android Shell

`apps/android-shell` is the phase-1 Android projection workspace.

It is intentionally a PWA/TWA shell target, not a native Kotlin client and not a WebView fork.

## Authority

- Runtime authority stays in MyBlog Runtime API and the KnowledgeObject graph.
- This workspace may package `https://blog.tengokukk.com/` as an installable Android surface.
- It must not implement book existence, OpenList parsing, metadata authority, search ranking, graph relations, or reader memory truth.

## Target Tooling

- PWA manifest and service worker live under `apps/web`.
- Current web entries are `apps/web/public/manifest.webmanifest` and `apps/web/public/sw.js`.
- Bubblewrap / Trusted Web Activity configuration belongs here once the PWA manifest is ready.
- Native Android (`apps/android-native`) is blocked until `/api/feed`, `/api/books`, `/api/visuals`, `/api/search`, and `/api/graph` have stable schemas.

## First Build Path

```bash
bubblewrap init --manifest=https://blog.tengokukk.com/manifest.webmanifest
bubblewrap build
```

Do not run Bubblewrap against production until the deployed site exposes the manifest and installability checks pass.

## Service Worker Boundary

The web service worker is allowed to cache static pages and build assets.

It must not cache or intercept:

- `/api/*`
- `/openlist/*`
- `/reader/openlist`
- `/books/openlist`
- HTTP Range requests for EPUB/PDF reader bytes
