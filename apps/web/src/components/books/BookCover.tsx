import { useEffect, useState } from 'react';
import type { BookItem } from '../../lib/books/types';
import { getOpenListFile, resolveRawUrl } from '../../lib/books/openlist';

type Props = {
  book: BookItem;
  className?: string;
};

export default function BookCover({ book, className = '' }: Props) {
  const [coverUrl, setCoverUrl] = useState(book.cover || '');

  useEffect(() => {
    let cancelled = false;
    let objectUrl = '';

    async function loadCover() {
      if (book.cover || !book.openlistPath || book.sourceType === 'external') return;

      try {
        const file = await getOpenListFile('/api/openlist', book.openlistPath);
        const rawUrl = resolveRawUrl(file.raw_url || '', '/api/openlist');
        const nextCover = book.sourceType === 'pdf' ? await createPdfCover(rawUrl) : await createEpubCover(rawUrl);
        if (!nextCover || cancelled) return;
        objectUrl = nextCover.startsWith('blob:') ? nextCover : '';
        setCoverUrl(nextCover);
      } catch {
        if (!cancelled) setCoverUrl('');
      }
    }

    void loadCover();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [book]);

  return (
    <span className={`book-cover-render ${className}`.trim()}>
      {coverUrl ? (
        <img src={coverUrl} alt={`${book.title} 封面`} />
      ) : (
        <span className="book-cover-fallback">
          <i>{book.category}</i>
          <strong>{book.title}</strong>
          <small>{book.author}</small>
        </span>
      )}
    </span>
  );
}

async function createPdfCover(url: string) {
  if (!url) return '';
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc ||= `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  const document = await pdfjs.getDocument(url).promise;
  const page = await document.getPage(1);
  const viewport = page.getViewport({ scale: 0.42 });
  const canvas = window.document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return '';

  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  await page.render({ canvasContext: context, viewport }).promise;
  return canvas.toDataURL('image/jpeg', 0.82);
}

async function createEpubCover(url: string) {
  if (!url) return '';
  const [{ default: ePub }] = await Promise.all([import('epubjs')]);
  const book = ePub(url, { openAs: 'epub' });
  await book.ready;
  const cover = await book.coverUrl();
  return cover || '';
}
