import { http, HttpResponse } from 'msw';
import { storyBooks } from '../src/stories/fixtures/books';

export const mswHandlers = {
  books: [
    http.get('/public-data/books/books-index.json', () =>
      HttpResponse.json({
        schemaVersion: 1,
        generatedAt: '2026-05-25T00:00:00.000Z',
        source: {
          type: 'openlist-index',
          canonicalPath: '/Obsidian/books',
          liveListForbidden: true
        },
        stats: {
          total: storyBooks.length,
          supported: storyBooks.length,
          bySourceType: {
            pdf: 1,
            epub: 1,
            external: 1
          }
        },
        books: storyBooks
      })
    )
  ],
  reader: [
    http.get('/api/runtime/reader/memory', () =>
      HttpResponse.json({
        items: [
          {
            objectType: 'book',
            objectId: 'designing-data-intensive-applications',
            progress: 0.42,
            location: { page: 168 }
          }
        ]
      })
    ),
    http.post('/api/runtime/reader/memory', async () => HttpResponse.json({ ok: true }))
  ]
};
