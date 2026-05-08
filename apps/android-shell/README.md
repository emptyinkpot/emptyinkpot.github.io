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
- Digital Asset Links lives at `apps/web/public/.well-known/assetlinks.json` and must trust the package/fingerprint declared in `apps/android-shell/twa.contract.json`.
- Bubblewrap / Trusted Web Activity configuration is generated from `apps/android-shell/twa.contract.json`.
- `launcherMode` is currently `webview-shell` for device compatibility. The app loads `https://blog.tengokukk.com/` directly in a minimal Android WebView activity; the web app remains the authority and no business logic is duplicated.
- `fallbackType` is also `webview`, retained for Bubblewrap compatibility.
- `preferredTwaProviderPackage` is retained as a Chrome preference for future android-browser-helper versions, but `androidbrowserhelper:2.6.2` does not expose a launching-browser metadata field.
- Native Android (`apps/android-native`) is blocked until `/api/feed`, `/api/books`, `/api/visuals`, `/api/search`, and `/api/graph` have stable schemas.

## Automatic Build Path

```bash
npm run android:twa:validate
npm run android:twa:generate
npm run android:twa:build
npm run android:twa:build:test-signed
```

The generated Android project is `.runtime/android-twa`. It is disposable build output, not a source workspace.

Generated unsigned artifacts:

- `.runtime/android-twa/app-release-unsigned-aligned.apk`
- `.runtime/android-twa/app/build/outputs/bundle/release/app-release.aab`
- `.runtime/android-twa/app-release-signed.apk` from `android:twa:build:test-signed`

CI entrypoint:

- `.github/workflows/android-twa.yml`

Do not run Bubblewrap against production until the deployed site exposes the manifest, service worker, PWA icons, `/.well-known/assetlinks.json` and installability checks pass. If `assetlinks.json` returns the homepage HTML, Android cannot verify the TWA and the app can remain on the splash screen.

## Service Worker Boundary

The web service worker is allowed to cache static pages and build assets.

It must not cache or intercept:

- `/api/*`
- `/openlist/*`
- `/reader/openlist`
- `/books/openlist`
- HTTP Range requests for EPUB/PDF reader bytes
