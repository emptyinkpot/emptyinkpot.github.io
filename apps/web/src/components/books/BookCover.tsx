import { useEffect, useState } from 'react';
import type { BookItem } from '../../lib/books/types';
import { getOpenListFile, resolveRawUrl } from '../../lib/books/openlist';

const COVER_CACHE_PREFIX = 'emptyinkpot-book-cover';
const COVER_CACHE_TTL = 1000 * 60 * 60 * 24 * 90;

type Props = {
  book: BookItem;
  className?: string;
};

export default function BookCover({ book, className = '' }: Props) {
  const [coverUrl, setCoverUrl] = useState(() => book.cover || readCachedCover(book) || '');
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (book.cover || !book.openlistPath || book.sourceType === 'external') return undefined;
    const cachedCover = readCachedCover(book);
    if (cachedCover) {
      setCoverUrl(cachedCover);
      return undefined;
    }

    const element = document.querySelector(`[data-book-cover-id="${CSS.escape(book.id)}"]`);
    if (!element) {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '240px' }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [book]);

  useEffect(() => {
    if (!shouldLoad) return undefined;
    let cancelled = false;

    async function loadCover() {
      if (book.cover || !book.openlistPath || book.sourceType === 'external') return;
      const cachedCover = readCachedCover(book);
      if (cachedCover) {
        setCoverUrl(cachedCover);
        return;
      }

      try {
        const file = await getOpenListFile('/api/openlist', book.openlistPath);
        const rawUrl = resolveRawUrl(file.raw_url || '', '/api/openlist');
        const nextCover = await withTimeout(book.sourceType === 'pdf' ? createPdfCover(rawUrl) : createEpubCover(rawUrl), 12000);
        if (!nextCover || cancelled) return;
        writeCachedCover(book, nextCover);
        setCoverUrl(nextCover);
      } catch {
        if (!cancelled) setCoverUrl('');
      }
    }

    void loadCover();

    return () => {
      cancelled = true;
    };
  }, [book, shouldLoad]);

  return (
    <span className={`book-cover-render ${className}`.trim()} data-book-cover-id={book.id}>
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
  return cover ? imageUrlToDataUrl(cover) : '';
}

function withTimeout<T>(promise: Promise<T>, ms: number) {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error('cover extraction timed out')), ms);
    promise
      .then(resolve)
      .catch(reject)
      .finally(() => window.clearTimeout(timer));
  });
}

async function imageUrlToDataUrl(url: string) {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.decoding = 'async';
  image.src = url;
  await image.decode();

  const maxWidth = 420;
  const scale = Math.min(1, maxWidth / image.naturalWidth);
  const canvas = window.document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return '';

  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.82);
}

function getCoverCacheKey(book: BookItem) {
  return `${COVER_CACHE_PREFIX}:${book.openlistPath || book.id}:${book.modified || 'unknown'}:${book.size || 0}`;
}

function readCachedCover(book: BookItem) {
  if (typeof window === 'undefined') return '';

  try {
    const raw = localStorage.getItem(getCoverCacheKey(book));
    if (!raw) return '';
    const cached = JSON.parse(raw) as { value?: string; cachedAt?: number };
    if (!cached.value || !cached.cachedAt || Date.now() - cached.cachedAt > COVER_CACHE_TTL) return '';
    return cached.value;
  } catch {
    return '';
  }
}

function writeCachedCover(book: BookItem, value: string) {
  if (typeof window === 'undefined' || !value.startsWith('data:image/')) return;

  try {
    localStorage.setItem(getCoverCacheKey(book), JSON.stringify({ value, cachedAt: Date.now() }));
  } catch {
    pruneCoverCache();
    try {
      localStorage.setItem(getCoverCacheKey(book), JSON.stringify({ value, cachedAt: Date.now() }));
    } catch {
      // Ignore quota failures; fallback cover remains available.
    }
  }
}

function pruneCoverCache() {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(`${COVER_CACHE_PREFIX}:`))
      .slice(0, 20)
      .forEach((key) => localStorage.removeItem(key));
  } catch {
    // Ignore storage access failures.
  }
}
