# Visual Sources

This directory stores non-sensitive visual source configuration and generated bookmark manifests.

Allowed:

- source page URLs
- public image URLs
- platform preview image URLs
- titles, tags, palette placeholders, collection metadata
- generated `visual-manifest.json`

Forbidden:

- passwords
- cookies
- session storage
- local storage auth blobs
- API tokens
- Pixiv/Pinterest account secrets

The bookmark sync may use an already logged-in local browser profile, but credentials must stay inside the browser profile or OS credential store.

Current mode is `bookmark-sync`: read Pinterest / Pixiv saved items and record their source URL plus preview URL. It does not download originals. Offline thumbnail mirroring is a separate explicit future step.

Runtime mode is `bookmark-mirror`: `apps/admin-next/lib/visual-runtime.js` reads Pinterest API or an Apify scheduled dataset, upserts all paginated results into MySQL `visual_pins`, marks missing pins with `deleted_at`, and rebuilds deterministic collection partitions for `/api/runtime/visuals/snapshot`. Static `visual-manifest.json` is only the build-time seed when runtime DB is empty or unavailable.
