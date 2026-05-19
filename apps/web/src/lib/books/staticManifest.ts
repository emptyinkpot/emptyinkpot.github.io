import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { BooksIndexManifest } from './manifest';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

export function getStaticBooksIndex(): BooksIndexManifest {
  const manifestPath = findBooksIndexPath();
  if (!manifestPath) {
    return {
      schemaVersion: 1,
      generatedAt: '',
      source: {
        type: 'openlist-index',
        canonicalPath: '/ObsidianArchive/docs/books/original',
        liveListForbidden: true
      },
      stats: {
        total: 0,
        supported: 0,
        bySourceType: {}
      },
      books: []
    };
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as BooksIndexManifest;
  if (!Array.isArray(manifest.books)) {
    return {
      ...manifest,
      books: []
    };
  }

  return manifest;
}

function findBooksIndexPath() {
  const candidates = [
    path.join(process.cwd(), 'public/public-data/books/books-index.json'),
    path.join(process.cwd(), 'apps/web/public/public-data/books/books-index.json'),
    path.join(process.cwd(), 'public-data/books/books-index.json'),
    path.join(process.cwd(), '../../public-data/books/books-index.json'),
    path.join(moduleDir, '../../../public/public-data/books/books-index.json'),
    path.join(moduleDir, '../../../../../public-data/books/books-index.json')
  ];

  return candidates.find((candidate) => fs.existsSync(candidate));
}
