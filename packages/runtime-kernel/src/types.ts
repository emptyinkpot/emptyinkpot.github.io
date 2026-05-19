export type RuntimeCommandKind =
  | 'command.open'
  | 'search.open'
  | 'reader.open'
  | 'reader.close'
  | 'reader.highlight'
  | 'openlist.open'
  | 'pinterest.open'
  | 'graph.focus'
  | 'settings.open';

export type RuntimeOverlayKind =
  | 'command'
  | 'search'
  | 'openlist'
  | 'pinterest'
  | 'drawer'
  | 'modal'
  | 'hover-preview';

export type RuntimeDrawerKind = 'article' | 'book' | 'visual' | 'project';

export type RuntimeAuthority =
  | 'astro-ssr'
  | 'react-island'
  | 'inline-runtime'
  | 'runtime-kernel'
  | 'admin-next-api'
  | 'mysql-runtime'
  | 'openlist-file-truth'
  | 'pagefind-static-index'
  | 'meilisearch-target'
  | 'directus-target'
  | 'immich-target';

export type RuntimeStorageClass =
  | 'preference'
  | 'cache'
  | 'legacy-migration'
  | 'temporary-local-authority'
  | 'forbidden-authority';

export type RuntimeCommand<TPayload = Record<string, unknown>> = {
  kind: RuntimeCommandKind;
  source: RuntimeAuthority | string;
  payload?: TPayload;
  issuedAt: string;
};

export type RuntimeOverlayIntent<TPayload = Record<string, unknown>> = {
  overlay: RuntimeOverlayKind;
  source: RuntimeAuthority | string;
  payload?: TPayload;
  issuedAt?: string;
};

export type RuntimeDrawerIntent<TPayload = Record<string, unknown>> = {
  drawer: RuntimeDrawerKind;
  objectId: string;
  objectType: 'post' | 'book' | 'visual' | 'project' | 'knowledge-object';
  source: RuntimeAuthority | string;
  payload?: TPayload;
  issuedAt?: string;
};

export type RuntimeKeyboardScope =
  | 'global'
  | 'home'
  | 'reader'
  | 'graph'
  | 'visuals'
  | 'project';

export type RuntimeKeyboardBinding = {
  chord: string;
  scope: RuntimeKeyboardScope;
  command: RuntimeCommandKind;
  owner: RuntimeAuthority | string;
  priority: number;
};

export type RuntimeStorageContract = {
  key: string;
  storageClass: RuntimeStorageClass;
  owner: RuntimeAuthority | string;
  migrationTarget?: string;
  notes?: string;
};
