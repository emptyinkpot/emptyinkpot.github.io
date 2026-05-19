import type { BookmarkRecord, HighlightRecord, ReadingHistoryItem } from './types';
import { RUNTIME_STORAGE_KEYS } from '../../../../../packages/runtime-kernel/src/storage';

export const knowledgeStorageKeys = {
  readingHistory: RUNTIME_STORAGE_KEYS.readingHistory,
  bookmarks: RUNTIME_STORAGE_KEYS.readerBookmarks,
  highlights: RUNTIME_STORAGE_KEYS.readerHighlights,
  annotations: RUNTIME_STORAGE_KEYS.readerAnnotations,
  seals: RUNTIME_STORAGE_KEYS.readerSeals,
  sealDefinitions: RUNTIME_STORAGE_KEYS.sealDefinitions,
  readerTheme: RUNTIME_STORAGE_KEYS.readerTheme
} as const;

export function dedupeHistory(items: ReadingHistoryItem[], limit = 50) {
  const seen = new Set<string>();
  const next: ReadingHistoryItem[] = [];

  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    next.push(item);
    if (next.length >= limit) break;
  }

  return next;
}

export function toggleBookmarkRecord(records: BookmarkRecord[], record: BookmarkRecord) {
  const exists = records.some((item) => item.id === record.id);
  return exists ? records.filter((item) => item.id !== record.id) : [record, ...records];
}

export function upsertHighlightRecord(records: HighlightRecord[], record: HighlightRecord) {
  return [record, ...records.filter((item) => item.id !== record.id)];
}
