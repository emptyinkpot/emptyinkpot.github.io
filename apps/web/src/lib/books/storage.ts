import { RUNTIME_STORAGE_KEYS } from '../../../../../packages/runtime-kernel/src/storage';

export const BOOK_SETTINGS_STORAGE_KEY = RUNTIME_STORAGE_KEYS.bookSettings;
export const READER_THEME_STORAGE_KEY = RUNTIME_STORAGE_KEYS.readerTheme;
export const BOOK_LOCATION_PREFIX = RUNTIME_STORAGE_KEYS.bookLocationPrefix;
export const BOOK_PROGRESS_PREFIX = RUNTIME_STORAGE_KEYS.bookProgressPrefix;
export const BOOK_RECENT_STORAGE_KEY = RUNTIME_STORAGE_KEYS.bookRecent;

export type BookReaderTheme = 'light' | 'sepia' | 'dark';

export interface BookSettings {
  openlistBaseUrl: string;
  openlistBooksPath: string;
  readerTheme: BookReaderTheme;
  showRecent: boolean;
}

export const defaultBookSettings: BookSettings = {
  openlistBaseUrl: import.meta.env.PUBLIC_OPENLIST_BASE_URL || '/api/openlist',
  openlistBooksPath: '/Obsidian/docs/books/original',
  readerTheme: 'sepia',
  showRecent: true
};

export function normalizeBookSettings(input: Partial<BookSettings> = {}): BookSettings {
  const theme = ['light', 'sepia', 'dark'].includes(String(input.readerTheme))
    ? (input.readerTheme as BookReaderTheme)
    : defaultBookSettings.readerTheme;
  const rawBaseUrl = String(input.openlistBaseUrl ?? defaultBookSettings.openlistBaseUrl).trim();
  const openlistBaseUrl = ['http://127.0.0.1:5244', 'http://localhost:5244'].includes(rawBaseUrl)
    ? defaultBookSettings.openlistBaseUrl
    : rawBaseUrl;

  return {
    openlistBaseUrl,
    openlistBooksPath: normalizePath(input.openlistBooksPath || defaultBookSettings.openlistBooksPath),
    readerTheme: theme,
    showRecent: input.showRecent !== false
  };
}

export function loadBookSettings(): BookSettings {
  if (typeof window === 'undefined') return normalizeBookSettings();

  try {
    return normalizeBookSettings(JSON.parse(localStorage.getItem(BOOK_SETTINGS_STORAGE_KEY) || '{}'));
  } catch {
    return normalizeBookSettings();
  }
}

export function saveBookSettings(settings: Partial<BookSettings>) {
  const next = normalizeBookSettings(settings);
  localStorage.setItem(BOOK_SETTINGS_STORAGE_KEY, JSON.stringify(next));
  localStorage.setItem(READER_THEME_STORAGE_KEY, next.readerTheme);
  return next;
}

export function getBookProgressKey(bookId: string) {
  return `${BOOK_PROGRESS_PREFIX}:${bookId}`;
}

export function getBookLocationKey(bookId: string) {
  return `${BOOK_LOCATION_PREFIX}:${bookId}`;
}

function normalizePath(path: string) {
  const raw = String(path || '/').trim();
  return raw.startsWith('/') ? raw.replace(/\/$/, '') || '/' : `/${raw.replace(/\/$/, '')}`;
}
