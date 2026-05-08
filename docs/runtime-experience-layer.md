# Runtime Experience Layer

This document defines the interaction quality layer for MyBlog. It sits above visual style and below feature implementation.

The goal is not more components. The goal is one coherent runtime experience across Feed, Drawer, Reader, Visuals, Graph, Command, OpenList shell and Pinterest shell.

## Thesis

MyBlog already has enough surfaces to feel like a system:

- Runtime Kernel
- Object graph
- Drawer runtime
- Reader runtime
- Visual collections
- Command palette
- OpenList shell
- Pinterest shell

The gap is interaction quality and runtime coherence. The site must stop feeling like independent runtime patches and start feeling like one living workspace.

## Target Feel

```text
Linear discipline
+ Arc spatial layers
+ Cosmos visual browsing
+ Immich gallery runtime
+ MyBlog reading atmosphere
```

Do not optimize for generic blog polish. Optimize for runtime surfaces:

| Current language | Target language |
| --- | --- |
| Drawer | Spatial Layer |
| Modal | Runtime Overlay |
| Card | Interactive Object |
| Search | Command Runtime |
| Reader | Continuous Surface |
| Visuals | Infinite Semantic Canvas |

## Active Stack

| Tool | Status | Role |
| --- | --- | --- |
| `cmdk` | active | Command runtime foundation |
| `motion` | active | Motion and object continuity foundation |
| `@floating-ui/react` | active | Floating preview / anchored surface foundation |
| `lucide-react` | active | Icon language |

## Target Stack

| Tool | Status | Rule |
| --- | --- | --- |
| shadcn/ui | target convention | Adopt as component assembly convention when a concrete surface migrates; component directory is not initialized yet. |
| Radix UI | installed / not migrated | Dialog, popover, tabs, tooltip, separator and context-menu primitives are available; no active overlay owner has migrated yet. |
| Vaul | installed / not migrated | Drawer/spatial layer candidate is available; current drawers still use existing runtime. |
| Zustand | installed / not migrated | Store dependency is available; no runtime owner has moved out of inline script yet. |
| React Flow | installed / not migrated | Graph runtime candidate is available; current graph remains unchanged until object/search contracts stabilize. |
| tldraw | reference | Consider for future infinite canvas and annotation work, not current Graph replacement. |

Installed libraries do not count as active experience owners until a migrated surface has browser evidence.

## Current Authority Boundary

The Runtime Experience Layer currently has no separate cutover manifest. The
active overlay/drawer owner remains the legacy inline runtime plus existing
React islands. Radix, Vaul, Zustand and React Flow are installed history, not
active surface owners.

The boundary prevents the common failure mode:

```text
dependency installed
=
fake migration
```

The first real visual/runtime migration may still be the Book Drawer shell, but
only after the active owner, browser evidence and rollback path are implemented
in code. Until then, the legacy drawer runtime is the truth.

## Reference Systems

| Reference | Learn |
| --- | --- |
| Linear | command, keyboard, overlay discipline |
| Arc Browser | spatial layers and object continuity |
| Cosmos | visual browsing and collection atmosphere |
| Immich Web | timeline, gallery, virtualization, media runtime |
| AFFiNE | workspace/object runtime |
| Raycast | command-first actions |

Aceternity UI, Magic UI and React Bits are technique references only. They may inspire micro-interactions, but MyBlog must not import generic glowing, particle, orb, bokeh or marketing hero effects that fight the reading product direction.

## Experience Primitives

### Spatial Layer

A spatial layer keeps the previous context alive while opening the next one.

Rules:

- Opening a drawer should compress or quiet the background, not feel like a separate page.
- Escape and focus restore must be deterministic.
- Overlay stacking must come from Runtime Kernel rules, not per-component z-index guesses.
- OpenList, Pinterest, Command, Search and Reader layers must share depth tokens.

### Interactive Object

Cards are not decorative cards. They are objects with continuity.

Rules:

- Hover is a small affordance, not a dramatic lift.
- The object identity should persist from card -> drawer -> reader.
- Motion should communicate continuity, not spectacle.
- Book, visual and article objects must use the same focus and active-state language.

### Continuous Surface

Reader, visuals and graph should feel navigable without hard resets.

Rules:

- Reader opens should avoid blank loading states where prefetch/cache exists.
- Visual browsing should prefer stable infinite or partitioned surfaces over disjoint card pages.
- Graph movement should preserve orientation.

### Command Runtime

Search is not just a search box.

Rules:

- `Ctrl/Cmd+K` has one canonical owner.
- Commands can open books, visuals, graph focus, reader targets and runtime shells.
- Command results should describe object identity and action, not just page links.

## Token Contract

Reusable tokens live in `packages/design-system/src/runtimeExperienceTokens.ts` and CSS variables in `apps/web/src/styles/global.css`.

The token groups are:

- `motion`: fast/base/slow/continuity timings and standard/spring easing.
- `depth`: canvas, surface, raised, floating, overlay and immersive z-index levels.
- `elevation`: surface, floating, overlay and active shadows.
- `focus`: ring color, width and offset.
- `surface`: backdrop, border and blur for runtime layers.

## Migration Order

P0:

- Document Runtime Experience Layer.
- Add design-system token package.
- Add CSS variables without changing behavior.

P1:

- Make Command Runtime the single `Ctrl/Cmd+K` owner.
- Apply shared focus/depth/motion tokens to command layers.

Current status:

- Home Command Palette sets `data-home-command-ready="true"` after hydration.
- The inline home fallback search only catches `Ctrl/Cmd+K` before the command palette is ready.
- Home command and fallback search layers now consume runtime depth, surface, elevation and motion CSS variables.
- `zustand`, Radix primitives, Vaul and React Flow are installed in `apps/web`, but no drawer, overlay, store or graph surface has migrated to them yet.

P2:

- Converge Drawer/Search/OpenList/Pinterest into one overlay stack.
- Evaluate Vaul/Radix only when migrating real drawer/overlay code.

P3:

- Add object continuity motion from Book Card -> Drawer -> Reader.
- Move graph toward React Flow only after KnowledgeObject and search authority stabilize.

P4:

- Explore infinite semantic canvas for visuals/knowledge using tldraw or a dedicated graph/canvas runtime.

## Hard Rules

- No new component library without a named surface migration.
- No generic animated hero, particle field, glow blob, decorative orb or one-off magic effect.
- No new z-index number outside the depth scale unless documented.
- No new animation timing outside the motion scale unless documented.
- No new overlay without Runtime Kernel ownership.
- No interaction should hide whether it changes visual state, local cache, server runtime or content/file truth.
