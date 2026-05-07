# Frontend Runtime Convergence

This document turns the first Runtime Archaeology audit into an execution plan. MyBlog must stop adding isolated runtime layers and start converging command, keyboard, overlays, drawers, focus, navigation and client cache behavior into one explicit frontend runtime kernel.

## Problem

The current frontend is already a system-level runtime, not a normal blog template.

```text
Astro SSR
+ React islands
+ large inline scripts
+ custom window events
+ Pagefind runtime
+ OpenList shell
+ Pinterest shell
+ localStorage caches
+ admin-next Runtime APIs
```

That composition is workable only while ownership stays clear. The current risk is ownership drift:

- `index.astro` owns a large inline runtime for feed, drawer, keyboard, fallback search, reader commands, highlights, seals and local state.
- `BaseLayout.astro` owns global OpenList and Pinterest shells with delegated events.
- `HomeCommandPalette` owns the visible command palette, but the inline home search still owns a fallback `Ctrl/Cmd+K` path.
- Several features use `window.dispatchEvent(...)` and `document.addEventListener(...)` as the integration layer.
- localStorage still contains real user artifacts, settings and migration caches; some keys are cache, some are still temporary authority.

The result is Runtime Split Brain: a user gesture can have more than one possible owner, and a visual surface can be patched by SSR, a React island, an inline script, localStorage and a runtime API in the same session.

## Target

The target is a Runtime Kernel.

```text
User gesture
  -> Runtime Kernel command / overlay / drawer / navigation intent
  -> one owner updates state
  -> React island or Astro shell renders the projection
  -> runtime API or cache layer persists only through declared authority
```

The kernel is not a new backend. It is the frontend interaction contract that every runtime surface must obey.

## Kernel Responsibilities

| Responsibility | Target owner | Notes |
| --- | --- | --- |
| Command bus | Runtime Kernel + `cmdk` UI | `Ctrl/Cmd+K` must have one canonical owner. |
| Keyboard layer | Runtime Kernel | Global chords must be registered once with priority and scope. |
| Overlays | Runtime Kernel | Command, OpenList shell, Pinterest shell, search, modal and future Vaul drawers must share stack/focus rules. |
| Drawers | Runtime Kernel | Article drawer and book drawer should become drawer intents, not free custom events. |
| Focus | Runtime Kernel | Escape, restore focus and nested overlay behavior must be deterministic. |
| Runtime events | Typed kernel events | Legacy `window.dispatchEvent` names stay only as a bridge during migration. |
| Navigation/history | Runtime Kernel | Query-param commands and drawer open/close must not be duplicated per page. |
| Client cache classification | Runtime Kernel docs + runtime-contract | localStorage must be marked `preference`, `cache`, `legacy-migration` or `temporary-local-authority`. |

## Current Library Stance

| Library | Status | Use |
| --- | --- | --- |
| `cmdk` | installed / active | Command palette base. |
| `motion` | installed / active | Target animation system for transitions and object continuity. |
| `@floating-ui/react` | installed / active | Floating hover/preview positioning. |
| `zustand` | installed / not migrated | Store convergence dependency is ready; no runtime owner has moved to it yet. |
| Radix UI primitives | installed / not migrated | Dialog, popover, tabs, tooltip, separator and context-menu primitives are available; no overlay owner has migrated yet. |
| Vaul | installed / not migrated | Drawer runtime candidate is available after current drawer contract is stabilized. |
| React Flow | installed / not migrated | Knowledge graph runtime candidate is available; current graph remains SSR SVG + inline runtime. |

Installed runtime libraries do not count as active owners until a concrete surface is migrated and verified in the browser.

## Migration Rules

1. No big-bang rewrite. Migrate one interaction owner at a time.
2. Every runtime change must state current owner, target owner and fallback owner.
3. No new global `document.addEventListener` or `window.addEventListener` without adding it to the audit and convergence docs.
4. No new `window.dispatchEvent(...)` contract without adding a typed kernel command/event.
5. localStorage cannot become a new source of truth. New keys must be classified before use.
6. React islands may project runtime state, but must not silently create a second authority for the same shortcut, drawer or overlay.
7. Inline script cleanup must preserve reachable behavior until the replacement owner has browser evidence.

## Phase Plan

### P0 - Contract and Inventory

- Add `packages/runtime-kernel` as a dependency-free contract package.
- Define runtime command, overlay, drawer, keyboard and storage classifications.
- Record legacy bridge event names and the canonical replacement intent.
- Keep existing UI behavior unchanged.

### P1 - Command and Search Convergence

- Make `HomeCommandPalette` the only `Ctrl/Cmd+K` owner.
- Convert fallback home search to a kernel command, not an independent keyboard listener.
- Document `/search/` as Pagefind static search until Meilisearch is deployed.

Current status:

- `HomeCommandPalette` now marks `<html data-home-command-ready="true">` after hydration.
- Home inline runtime only handles `Ctrl/Cmd+K` before that ready marker exists; after hydration the command palette is the owner.
- `HomeCommandPalette` dispatches typed bridge event `runtime:command` with `kind: "search.open"` before the legacy `home-search-open` bridge.
- Command and fallback search layers have started using Runtime Experience depth / surface / elevation / motion tokens.

### P2 - Overlay and Drawer Convergence

- Move OpenList shell, Pinterest shell, article drawer and book drawer into one overlay stack contract.
- Replace free custom events with typed `runtime:command` / `runtime:drawer-open` bridge events.
- Add deterministic Escape and focus-restore ordering.

### P3 - Store and Graph Convergence

- Introduce Zustand or equivalent only when at least one active owner migrates.
- Migrate reader shell state, overlay stack and command state first; do not move MySQL reader truth into browser store.
- Replace static SVG graph runtime with React Flow only after graph object contracts and search authority are stable.

## Legacy Bridge Events

These names are still allowed only as compatibility bridges:

| Legacy event | Current owner | Canonical target |
| --- | --- | --- |
| `home-search-open` | home inline runtime / command palette | `runtime:command` with `kind: "search.open"` |
| `openlist-embed-open` | BaseLayout inline runtime | `runtime:overlay-open` with `overlay: "openlist"` |
| `pinterest-embed-open` | BaseLayout inline runtime | `runtime:overlay-open` with `overlay: "pinterest"` |
| `reader-command` | home inline runtime | `runtime:command` with reader payload |
| `emptyinkpot:book-drawer-open` | BookDrawerReader | `runtime:drawer-open` with `drawer: "book"` |
| `emptyinkpot:book-drawer-close` | BookDrawerReader | `runtime:drawer-close` with `drawer: "book"` |

## Storage Classification

| Class | Meaning | Examples |
| --- | --- | --- |
| `preference` | Browser-only UI preference | visual theme, reader theme, sidebar collapsed |
| `cache` | Mirror of server or build-time data | recent runtime snapshot, warmed reader metadata |
| `legacy-migration` | Old source read once, then written to server truth | old book progress keys |
| `temporary-local-authority` | P0 user artifact not yet migrated | stickers, some seals, local graph injections |
| `forbidden-authority` | Must not be introduced | article body, file existence, credentials, CMS writes |

## Done Criteria

Runtime Convergence is working when:

- Every global shortcut has one owner.
- Every overlay participates in one stack.
- Every drawer open/close has a typed intent.
- Every localStorage key is classified.
- The audit doc names every global listener and custom event bridge.
- MyBlog can explain whether a user action changes visual state, cache state, server runtime state or file/content truth.
