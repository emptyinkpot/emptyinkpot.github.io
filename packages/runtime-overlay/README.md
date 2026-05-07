# Runtime Overlay

`packages/runtime-overlay` is the authority cutover contract for MyBlog overlays.

It is not an active component library yet. It exists to make Drawer, Dialog,
Tooltip, Popover, ContextMenu and shell layers enter the same owner model before
individual surfaces migrate to Radix or Vaul.

## Current Status

P0 contract only.

- Book Drawer still uses the existing `BookDrawerReader` and homepage runtime.
- OpenList and Pinterest shells still use the current BaseLayout shell runtime.
- Command uses `HomeCommandPalette`.
- No overlay surface may be marked migrated until `runtime-migration.json`
  records evidence.

## Target Order

1. Book Drawer shell -> Vaul through this overlay contract.
2. Command / Search -> shared overlay stack and focus restore.
3. OpenList / Pinterest shells -> shared overlay stack.
4. Article / Visual / Project drawers -> typed drawer intents.

## Hard Rules

- No new free `window.dispatchEvent(...)` overlay names.
- Escape and focus restore must have one owner per active overlay.
- A migrated overlay must declare rollback behavior.
- Reader memory and highlights remain MySQL runtime truth, not overlay state.
