import type { BookItem } from '../../lib/books/types';

export function buildCachedBookCoverUrl(book: BookItem) {
  const title = encodeURIComponent(book.title);
  return `https://placehold.co/360x520/f3efe7/201b16?text=${title}`;
}

export async function getOpenListFile() {
  return {
    name: 'Storybook Runtime Book.pdf',
    path: '/Obsidian/books/storybook-book.pdf',
    size: 1024,
    modified: new Date('2026-05-25T00:00:00.000Z').toISOString(),
    thumb: buildCachedBookCoverUrl({
      id: 'storybook-runtime-book',
      title: 'Storybook Runtime Book',
      author: 'Storybook',
      status: 'planned',
      statusLabel: '待读',
      note: '',
      category: 'Fixture',
      tags: [],
      sourceType: 'pdf',
      openlistPath: '/Obsidian/books/storybook-book.pdf',
      cover: ''
    })
  };
}

export function buildCachedBookRawUrl(book: BookItem) {
  return `/storybook-fixtures/${encodeURIComponent(book.id)}.${book.sourceType === 'epub' ? 'epub' : 'pdf'}`;
}

export function buildCachedBookPageUrl(book: BookItem, _settings: unknown, pageNumber: number) {
  const title = encodeURIComponent(`${book.title} p.${pageNumber}`);
  return `https://placehold.co/760x1040/f8f3e8/201b16?text=${title}`;
}
