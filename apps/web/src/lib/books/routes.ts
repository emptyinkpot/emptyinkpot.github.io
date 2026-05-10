import type { BookItem } from './types';

export function getBookDetailHref(book: BookItem) {
  return `/books/openlist/?path=${encodeURIComponent(book.openlistPath || '')}`;
}

export function getBookReaderHref(book: BookItem) {
  return `/reader/openlist/?path=${encodeURIComponent(book.openlistPath || '')}`;
}
