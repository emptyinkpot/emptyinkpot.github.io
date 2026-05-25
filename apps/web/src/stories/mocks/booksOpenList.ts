import type { BookItem } from '../../lib/books/types';

export function buildCachedBookCoverUrl(book: BookItem) {
  const title = encodeURIComponent(book.title);
  return `https://placehold.co/360x520/f3efe7/201b16?text=${title}`;
}

export async function getOpenListFile() {
  return {
    name: 'storybook-book.pdf',
    path: '/Obsidian/books/storybook-book.pdf',
    size: 1024,
    modified: new Date('2026-05-25T00:00:00.000Z').toISOString()
  };
}
