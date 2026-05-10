export const RUNTIME_EVENT_NAMES = {
  command: 'runtime:command',
  overlayOpen: 'runtime:overlay-open',
  overlayClose: 'runtime:overlay-close',
  drawerOpen: 'runtime:drawer-open',
  drawerClose: 'runtime:drawer-close',
  keyboard: 'runtime:keyboard',
  focusRestore: 'runtime:focus-restore'
} as const;

export const LEGACY_RUNTIME_BRIDGES = {
  homeSearchOpen: 'home-search-open',
  openListEmbedOpen: 'openlist-embed-open',
  pinterestEmbedOpen: 'pinterest-embed-open',
  readerCommand: 'reader-command',
  bookDrawerOpen: 'emptyinkpot:book-drawer-open',
  bookDrawerClose: 'emptyinkpot:book-drawer-close'
} as const;

export type RuntimeEventName =
  (typeof RUNTIME_EVENT_NAMES)[keyof typeof RUNTIME_EVENT_NAMES];

export type LegacyRuntimeBridgeName =
  (typeof LEGACY_RUNTIME_BRIDGES)[keyof typeof LEGACY_RUNTIME_BRIDGES];
