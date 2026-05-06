export const BOOK_SETTINGS_STORAGE_KEY = 'emptyinkpot-book-settings';
export const READER_THEME_STORAGE_KEY = 'emptyinkpot-reader-theme';
export const BOOK_LOCATION_PREFIX = 'emptyinkpot-book-location';
export const BOOK_PROGRESS_PREFIX = 'emptyinkpot-book-progress';
export const BOOK_RECENT_STORAGE_KEY = 'emptyinkpot-book-recent';

export type BookReaderTheme = 'light' | 'sepia' | 'dark';

export interface BookSettings {
  openlistBaseUrl: string;
  openlistBooksPath: string;
  readerTheme: BookReaderTheme;
  showRecent: boolean;
}

export const defaultBookSettings: BookSettings = {
  openlistBaseUrl: import.meta.env.PUBLIC_OPENLIST_BASE_URL || '/api/openlist',
  openlistBooksPath: '/夸克网盘/obsidian/data/docs/books/original',
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
