import type { RuntimeStorageContract } from './types';
export { RUNTIME_STORAGE_KEYS } from './storage-keys.mjs';
import { RUNTIME_STORAGE_KEYS } from './storage-keys.mjs';

export const runtimeStorageRegistry: RuntimeStorageContract[] = [
  {
    key: RUNTIME_STORAGE_KEYS.visualSettings,
    storageClass: 'preference',
    owner: 'inline-runtime',
    notes: 'Visual density, preview and content presentation settings.'
  },
  {
    key: RUNTIME_STORAGE_KEYS.runtimeFolderSettings,
    storageClass: 'preference',
    owner: 'inline-runtime',
    notes: 'Runtime folder visibility lens for homepage filtering.'
  },
  {
    key: RUNTIME_STORAGE_KEYS.readingHistory,
    storageClass: 'legacy-migration',
    owner: 'inline-runtime',
    migrationTarget: 'mysql-runtime.reader_memory'
  },
  {
    key: RUNTIME_STORAGE_KEYS.readerBookmarks,
    storageClass: 'legacy-migration',
    owner: 'inline-runtime',
    migrationTarget: 'mysql-runtime.reader_memory'
  },
  {
    key: RUNTIME_STORAGE_KEYS.readerHighlights,
    storageClass: 'legacy-migration',
    owner: 'inline-runtime',
    migrationTarget: 'mysql-runtime.reader_highlights'
  },
  {
    key: RUNTIME_STORAGE_KEYS.readerAnnotations,
    storageClass: 'legacy-migration',
    owner: 'inline-runtime',
    migrationTarget: 'mysql-runtime.annotations'
  },
  {
    key: RUNTIME_STORAGE_KEYS.readerSeals,
    storageClass: 'legacy-migration',
    owner: 'inline-runtime',
    migrationTarget: 'mysql-runtime.knowledge_links'
  },
  {
    key: RUNTIME_STORAGE_KEYS.sealDefinitions,
    storageClass: 'preference',
    owner: 'inline-runtime'
  },
  {
    key: RUNTIME_STORAGE_KEYS.stickers,
    storageClass: 'legacy-migration',
    owner: 'inline-runtime',
    migrationTarget: 'mysql-runtime.knowledge_links'
  },
  {
    key: RUNTIME_STORAGE_KEYS.visualCollections,
    storageClass: 'cache',
    owner: 'inline-runtime',
    notes: 'Client-side visual manifest cache; visual source authority remains public-data and runtime APIs.'
  },
  {
    key: RUNTIME_STORAGE_KEYS.readerTheme,
    storageClass: 'preference',
    owner: 'runtime-kernel'
  },
  {
    key: RUNTIME_STORAGE_KEYS.homeSidebarCollapsed,
    storageClass: 'preference',
    owner: 'inline-runtime'
  },
  {
    key: RUNTIME_STORAGE_KEYS.bookSettings,
    storageClass: 'preference',
    owner: 'react-island'
  },
  {
    key: `${RUNTIME_STORAGE_KEYS.bookLocationPrefix}:<bookId>`,
    storageClass: 'legacy-migration',
    owner: 'react-island',
    migrationTarget: 'mysql-runtime.reader_memory'
  },
  {
    key: `${RUNTIME_STORAGE_KEYS.bookProgressPrefix}:<bookId>`,
    storageClass: 'legacy-migration',
    owner: 'react-island',
    migrationTarget: 'mysql-runtime.reader_memory'
  },
  {
    key: RUNTIME_STORAGE_KEYS.bookRecent,
    storageClass: 'cache',
    owner: 'react-island'
  },
  {
    key: RUNTIME_STORAGE_KEYS.buildVersion,
    storageClass: 'cache',
    owner: 'runtime-kernel'
  },
  {
    key: `${RUNTIME_STORAGE_KEYS.buildReloadPrefix}:<buildVersion>`,
    storageClass: 'cache',
    owner: 'runtime-kernel',
    notes: 'One-shot reload guard for build-version transitions.'
  }
];
