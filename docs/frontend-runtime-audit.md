# Frontend Runtime Audit

This document is the first runtime archaeology map for the MyBlog frontend. It is not a component-tree explanation. It follows user behavior through DOM, events, state, hydration, network, animation, authority and mutation.

## Convergence Target

The companion execution document is `docs/frontend-runtime-convergence.md`.

The audit identifies current owners and risk. The convergence document defines the target Runtime Kernel and migration sequence. Any new global listener, custom event, overlay, drawer, keyboard chord or localStorage key must update both layers:

- Audit: what currently runs, where it runs and how a user reaches it.
- Convergence: who should own it, what typed command/event replaces ad hoc wiring and how storage is classified.

P0 kernel contract lives at `packages/runtime-kernel/`. It is dependency-free and does not change production behavior yet.

## Audit Contract

When auditing this frontend, do not stop at file structure or Astro/React component names. Trace:

```text
user behavior
-> DOM target
-> event listener
-> state owner
-> render / mutation
-> hydration boundary
-> network / storage
-> animation
-> authority
-> fallback
```

Mandatory inspection targets:

- Astro pages and layouts
- React islands with `client:*`
- inline `<script>` blocks
- `document` / `window` listeners
- `data-*` delegated event contracts
- localStorage / sessionStorage
- runtime `fetch`
- iframe / embed shells
- observers: MutationObserver, IntersectionObserver, ResizeObserver
- keyboard shortcuts and CSS-only interactions
- hidden fallback paths and static snapshot replacement

Do not assume `no import` means `not running`. Check delegated listeners, custom events, dynamic DOM lookup, inline scripts, browser observers and runtime-injected DOM.

## Page Entrypoints

| Route family | Runtime shape | Primary owners |
| --- | --- | --- |
| `/` | SSR Runtime Surface v2: mixed masonry feed + collection lens cards + large inline reader runtime + React islands + runtime API patches | `apps/web/src/pages/index.astro`, `BaseLayout.astro`, `HomeCommandPalette`, `GitHubRuntimeSync`, `RuntimeBookFeed` |
| `/books/` | SSR page + `BookshelfGrid client:load` + OpenList file scan | `apps/web/src/pages/books/index.astro`, `BookshelfGrid.tsx`, `lib/books/openlist.ts` |
| `/books/openlist/` | query-param runtime detail reader | `RuntimeBookDetail client:only="react"` |
| `/reader/openlist/` | query-param runtime book reader | `RuntimeBookReader client:only="react"` |
| `/visuals/` | SSR VisualCollection seed + inline board/sticker runtime + runtime snapshot patch | `visuals/index.astro`, `BaseLayout.astro` Pinterest shell |
| `/knowledge/` | SSR SVG graph + inline graph runtime + local storage injection | `knowledge/index.astro` |
| `/projects/[slug]/` | SSR project workbench + inline GitHub write/read runtime + `ProjectWorkbenchCommand client:idle` | `projects/[slug].astro` |
| `/search/` | Pagefind UI runtime | `search.astro`, `dist/pagefind` |
| taxonomy/content pages | Mostly SSR + Pagefind body | `posts`, `notes`, `categories`, `tags`, `series` |

## Hydration Graph

```text
BaseLayout
├─ inline build-version reload guard
├─ inline visual settings applier
├─ OpenList iframe shell runtime
├─ Pinterest shell runtime
└─ HoverPreviewSystem client:load

Home page
├─ HomeNumberTicker client:visible
├─ HomeCommandPalette client:idle
├─ RuntimeBookFeed client:load
├─ BookCover client:load
├─ inline mixed Feed Surface / Drawer / Reader Session / Search / Seal runtime
└─ GitHubRuntimeSync inline component

Books / Reader
├─ BookshelfGrid client:load
├─ RuntimeBookDetail client:only="react"
├─ RuntimeBookReader client:only="react"
└─ BookReader -> EpubReader / PdfReader

Projects
└─ ProjectWorkbenchCommand client:idle
```

Main risk: 首页 behavior is split between one large inline script and several React islands. The same keyboard chord (`Ctrl/Cmd+K`) has two possible owners: `HomeCommandPalette` if hydrated, and the inline search layer fallback if no command trigger exists.

## Frontend Authority Graph

| Surface | Visual source | Runtime authority | Notes |
| --- | --- | --- | --- |
| Home mixed feed cards | Astro SSR from Runtime KnowledgeCollection metadata, runtime MarkdownObject projections and local object projections | inline drawer runtime mutates active card, filters, reader state | Default surface is mixed masonry. Collection cards are lenses that open a Reader Session drawer; `/collections/` is not the homepage owner. |
| Command button | React island | `HomeCommandPalette` state; dispatches custom events | It is the canonical global search button. |
| Home fallback search | SSR hidden layer | inline script, local `searchDocs` JSON | Opened by custom event or keyboard fallback. |
| Drawer | SSR hidden reader nodes | inline script clones/replaces drawer content | Book drawer escalates to `BookDrawerReader` via custom event. |
| Book covers | Astro/React mixed | cached OpenList cover URL | Cover should be cache/prewarm authority, not visitor-time parsing. |
| Reader memory | UI reads local cache first | MySQL via `/api/runtime/reader/*`, localStorage as fallback/legacy | Server should become truth; localStorage remains cache. |
| Visual collections | `visuals.ts` seed | `/api/runtime/visuals/snapshot` can replace/patch collections | Static manifest is fallback, not truth. |
| Pinterest shell | SSR seed board | BaseLayout fetches `/api/runtime/visuals/snapshot`; fallback to seed | It is a MyBlog mirror shell, not official Pinterest iframe. |
| OpenList shell | iframe `/openlist/` | iframe runtime + injected CSS hiding login link | Cross-origin restrictions are handled with try/catch. |
| Knowledge graph | SSR SVG | inline script injects local highlights/seals/stickers | Graph is not yet a full React Flow runtime. |
| Search page | Pagefind index | build-time Pagefind | Meilisearch target is not deployed. |
| Project workbench | SSR project snapshot | `/api/github/*` and `/api/projects/[slug]/timeline` | Writes happen server-side; no localStorage fake commits. |

## Interaction Inventory

| Interaction | Trigger | Runtime owner | State owner | Side effect | Reachable |
| --- | --- | --- | --- | --- | --- |
| Global command | click `.home-command__trigger`, `Ctrl/Cmd+K` | `HomeCommandPalette` | React state | Opens portal command layer | yes |
| Fallback home search | `home-search-open`, `Ctrl/Cmd+K` when command trigger absent | home inline script | local vars | Opens search overlay | yes, fallback |
| OpenList embed | `[data-openlist-embed-open]`, custom `openlist-embed-open` | BaseLayout inline script | DOM classes + iframe `src` | Opens modal, lazy-loads iframe, hides login links | yes |
| Pinterest shell | `[data-pinterest-embed-open]`, custom `pinterest-embed-open` | BaseLayout inline script | DOM + `hydrated` flag | Fetches runtime snapshot once, renders board | yes |
| Hover preview | pointer over `[data-hover-preview]` | `HoverPreviewSystem client:load` | React state + localStorage setting | Floating portal preview | off by default |
| Home drawer | click feed card / Enter active card / reader command | home inline script | local vars + DOM | Opens drawer, updates history/memory | yes |
| Feed filter | `[data-feed-filter]` | home inline script | DOM hidden flags | Filters cards without route change | yes |
| Feed keyboard navigation | `J`, `K`, `Enter` | home inline script | activeIndex | Moves active card / opens drawer | yes |
| Reader theme | `[data-reader-theme]` | home inline script / BookReader | localStorage + root dataset | Changes CSS theme | yes |
| Highlight selection | text selection in drawer | home inline script | localStorage + MySQL POST | Adds highlight and toolbar | yes |
| Seal/sticker | seal buttons / sticker buttons | page inline scripts | localStorage | Runtime-injected DOM | yes |
| Bookshelf sync | page load `/books/` | `BookshelfGrid` | React state | Fetches OpenList index/list and reader memory | yes |
| PDF drawer lazy pages | scroll / IntersectionObserver | `PdfReader` | React state + server page cache | Fetches cached page images and PDF ranges | yes |
| Visual board expand | click collection trigger | `visuals/index.astro` inline script | DOM hidden flags | Expands board | yes |
| Visual snapshot hydrate | page load `/visuals/` | visual inline script | in-memory collection list | Fetches `/api/runtime/visuals/snapshot`, fallback to seed | yes |
| Knowledge graph focus | hover/focus/click/Enter | `knowledge/index.astro` inline script | DOM + localStorage injected nodes | Focuses node, updates panel, navigates if href | yes |
| Project sync | click sync | project inline script | DOM | Fetches GitHub API and patches workbench | yes |
| Project write | save wiki/timeline | project inline script | GitHub/server API | Commits through backend | yes when API configured |
| Pagefind search | type in search page | Pagefind UI | Pagefind runtime | Reads static index | yes |

## Runtime State Graph

```text
Browser localStorage
├─ emptyinkpot-build-version
├─ emptyinkpot-visual-settings
├─ emptyinkpot-book-settings
├─ emptyinkpot-reader-theme
├─ emptyinkpot-home-sidebar-collapsed
├─ emptyinkpot-reading-history
├─ emptyinkpot-reader-bookmarks
├─ emptyinkpot-reader-highlights
├─ emptyinkpot-reader-annotations
├─ emptyinkpot-reader-seals
├─ emptyinkpot-seal-definitions
└─ emptyinkpot-stickers

Server runtime
├─ /api/runtime/reader/memory
├─ /api/runtime/reader/highlights
├─ /api/runtime/visuals/snapshot
├─ /api/openlist/*
└─ /api/github/* / /api/projects/*

Build-time static
├─ Astro content collections
├─ apps/web/src/data/books.ts seed / overlay
├─ apps/web/src/data/visuals.ts seed
├─ public-data/visual-sources/visual-manifest.json fallback
└─ Pagefind index
```

## Event Propagation Graph

```text
HomeCommandPalette
├─ action: search -> dispatch home-search-open
├─ action: openlist -> dispatch openlist-embed-open
└─ action: pinterest -> dispatch pinterest-embed-open

BaseLayout
├─ delegated click [data-openlist-embed-open] -> open OpenList layer
├─ window openlist-embed-open -> open OpenList layer
├─ delegated click [data-pinterest-embed-open] -> open Pinterest layer
├─ window pinterest-embed-open -> open Pinterest layer
└─ Escape -> close active embed

Home inline runtime
├─ delegated feed/card/filter/search handlers
├─ window reader-command -> open article/highlight/search/graph
├─ document keydown -> command/search/drawer/feed navigation
└─ runtime POST -> reader memory/highlights

BookDrawerReader
├─ window emptyinkpot:book-drawer-open -> mount reader
├─ window emptyinkpot:book-drawer-close -> hide reader
├─ pointerenter/focusin on book cards -> warm reader pool
└─ IntersectionObserver -> prewarm nearby books
```

## Hidden / Undocumented Interactions

- `Ctrl/Cmd+K` has dual behavior: React command if available; inline search fallback if the command trigger is absent.
- `J` / `K` move the active home feed card; `Enter` opens that card's drawer.
- `Escape` is global and closes Command, fallback search, drawer, OpenList shell or Pinterest shell depending on active layer.
- Hover preview is present but disabled by default via `emptyinkpot-visual-settings.interactions.hoverPreview`.
- OpenList iframe gets runtime-injected CSS and a `MutationObserver` to hide login links.
- Pinterest shell does not iframe Pinterest. It fetches a local mirror snapshot and renders MyBlog DOM.
- Query params `?reader=...`, `?highlight=...`, `?searchTag=...` can trigger drawer/search behavior on home load.
- Knowledge graph injects local highlight/annotation/seal/sticker nodes from localStorage after SSR.
- PDF drawer uses cached page image + lazy direct PDF runtime, not just `react-pdf` page mode.

## Dead / Zombie / Legacy Risks

- `SiteHeader.astro` still exists and contains an OpenList action, but BaseLayout no longer renders the traditional global header for the main app shell. Treat it as legacy until a route proves it is mounted.
- `books.ts` still exists, but it must be seed / metadata overlay only. OpenList/COS file index is the intended existence authority.
- Pagefind is still active for static pages, but it is not the future dynamic authority for books, visual runtime, OpenList files or reader marks.
- Reader state is duplicated during migration: localStorage legacy keys and MySQL runtime APIs both exist.
- Pinterest has three layers: platform account, runtime mirror, build manifest fallback. The frontend must not imply the fallback is full live Pinterest.
- Project workbench has write UI, but actual authority is backend API and GitHub token on server; UI must not write fake success into localStorage.

## Feature Inventory

Active frontend runtime features:

- Home feed filtering
- Home drawer reader
- Reader progress and memory sync
- Highlight selection and persistence
- Seal rendering and local definitions
- Sticker overlays on visual surfaces
- Command palette
- Fallback local search overlay
- Pagefind search page
- OpenList iframe shell
- Pinterest mirror shell
- Visual collection runtime hydration
- Bookshelf OpenList sync
- PDF/EPUB readers
- GitHub live dashboard patch
- Project workbench API sync/write
- Knowledge graph local runtime injection
- Settings-driven visual and reader preferences
- Hover preview system behind setting flag

## Visual-Only vs State-Changing

Visual-only:

- Home number tickers
- Hover preview card display
- Hero parallax motion
- Feed card active class when keyboard navigating
- Most SVG graph hover focus effects

State-changing:

- Settings form writes `emptyinkpot-visual-settings`
- Book settings form writes `emptyinkpot-book-settings`
- Reader theme writes `emptyinkpot-reader-theme`
- Drawer reading writes local history and server reader memory
- Highlight writes local highlight cache and server reader highlights
- Seal/sticker writes localStorage
- Project wiki/timeline submit writes through backend API
- Runtime visual sync display reads server snapshot and mutates DOM
- OpenList iframe lazy `src` assignment starts external runtime

## Immediate Audit Gaps

- Need browser evidence pass with console checks for `/`, `/books/`, `/visuals/`, `/knowledge/`, `/projects/site-v2/`, `/search/`.
- Need machine-generated listener inventory that groups by source file and event type.
- Need a route-by-route network capture to separate build-time data from runtime API authority.
- Need a stale-path cleanup pass for `SiteHeader`, legacy book routes, legacy localStorage migration keys and duplicated search paths.
