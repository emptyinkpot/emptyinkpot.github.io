import type { BookmarkRecord, HighlightRecord, ReadingHistoryItem } from './types';
import { sealDefinitionStorageKey } from './seals';

export const knowledgeStorageKeys = {
  readingHistory: 'emptyinkpot-reading-history',
  bookmarks: 'emptyinkpot-reader-bookmarks',
  highlights: 'emptyinkpot-reader-highlights',
  annotations: 'emptyinkpot-reader-annotations',
  seals: 'emptyinkpot-reader-seals',
  sealDefinitions: sealDefinitionStorageKey,
  readerTheme: 'emptyinkpot-reader-theme'
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
