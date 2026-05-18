import type { BookItem } from '../../lib/books/types';

export type ReaderRuntimeComponent = typeof import('./PdfReader')['default'];

const runtimePromises: Partial<Record<BookItem['sourceType'], Promise<ReaderRuntimeComponent>>> = {};

export function preloadBookRuntime(sourceType: BookItem['sourceType']) {
  if (sourceType === 'pdf') return preloadPdfRuntime();
  if (sourceType === 'epub') return preloadEpubRuntime();
  return Promise.resolve(null);
}

export function preloadAllBookRuntimes() {
  return Promise.allSettled([preloadPdfRuntime(), preloadEpubRuntime()]);
}

export function loadBookRuntime(sourceType: BookItem['sourceType']) {
  return preloadBookRuntime(sourceType);
}

function preloadPdfRuntime() {
  runtimePromises.pdf ??= import('./PdfReader').then((module) => module.default);
  return runtimePromises.pdf;
}

function preloadEpubRuntime() {
  runtimePromises.epub ??= import('./EpubReader').then((module) => module.default as ReaderRuntimeComponent);
  return runtimePromises.epub;
}
