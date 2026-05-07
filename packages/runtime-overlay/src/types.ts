export type RuntimeOverlaySurface =
  | 'command'
  | 'search'
  | 'book-drawer'
  | 'article-drawer'
  | 'visual-drawer'
  | 'project-drawer'
  | 'openlist-shell'
  | 'pinterest-shell'
  | 'modal'
  | 'tooltip'
  | 'popover'
  | 'context-menu';

export type RuntimeOverlayLibrary = 'legacy-inline' | 'radix' | 'vaul' | 'cmdk' | 'motion';

export type RuntimeOverlayAuthority = {
  surface: RuntimeOverlaySurface;
  currentOwner: string;
  targetOwner: string;
  library: RuntimeOverlayLibrary;
  migrated: boolean;
  focusOwner: string;
  escapeOwner: string;
  rollback: string;
};

export type RuntimeOverlayStackEntry = {
  id: string;
  surface: RuntimeOverlaySurface;
  objectId?: string;
  openedAt: string;
  restoreFocusSelector?: string;
};
