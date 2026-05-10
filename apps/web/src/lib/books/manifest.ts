import type { BookItem } from './types';

export const BOOKS_INDEX_URL = '/public-data/books/books-index.json';

export type BooksIndexManifest = {
  schemaVersion: number;
  generatedAt: string;
  source: {
    type: 'openlist-index';
    canonicalPath: string;
    indexUrl?: string;
    liveListForbidden: true;
  };
  stats: {
    total: number;
    supported: number;
    curated?: number;
    bySourceType: Record<string, number>;
  };
  books: BookItem[];
};

export async function loadBooksIndex(): Promise<BooksIndexManifest> {
  const response = await fetch(`${BOOKS_INDEX_URL}?t=${Date.now()}`, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`books-index 请求失败：${response.status}`);
  }

  const manifest = (await response.json()) as BooksIndexManifest;
  if (!Array.isArray(manifest.books)) {
    throw new Error('books-index 缺少 books 数组');
  }

  return manifest;
}
