import { storyBooks } from '../fixtures/books';

export async function loadBooksIndex() {
  return {
    generatedAt: new Date('2026-05-25T00:00:00.000Z').toISOString(),
    books: storyBooks
  };
}
