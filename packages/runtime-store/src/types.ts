export type RuntimeStoreName =
  | 'overlayStore'
  | 'commandStore'
  | 'readerStore'
  | 'graphStore'
  | 'visualStore';

export type RuntimeStoreStatus = 'contract-only' | 'installed-not-migrated' | 'active';

export type RuntimeStoreAuthority = {
  name: RuntimeStoreName;
  status: RuntimeStoreStatus;
  owns: string[];
  forbiddenTruths: string[];
  persistence: 'none' | 'preference' | 'cache' | 'temporary-local-authority';
};

export const runtimeStoreOrder: RuntimeStoreName[] = [
  'overlayStore',
  'commandStore',
  'readerStore',
  'graphStore',
  'visualStore'
];
