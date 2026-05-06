import { useEffect, useState } from 'react';
import type { BookItem } from '../../lib/books/types';
import { getOpenListFile, resolveRawUrl } from '../../lib/books/openlist';

const COVER_CACHE_PREFIX = 'emptyinkpot-book-cover';
const COVER_CACHE_TTL = 1000 * 60 * 60 * 24 * 90;
const COVER_MISS_CACHE_TTL = 1000 * 60 * 60 * 24 * 7;
const COVER_EXTRACTION_TIMEOUT = 12000;
const MAX_ACTIVE_EXTRACTIONS = 1;

type CoverCacheEntry = {
  value?: string;
  status?: 'hit' | 'miss';
  cachedAt?: number;
};

const inFlightExtractions = new Map<string, Promise<string>>();
const extractionQueue: Array<() => void> = [];
let activeExtractions = 0;

type Props = {
  book: BookItem;
  className?: string;
};

export default function BookCover({ book, className = '' }: Props) {
  const posterCover = createPosterCover(book);
  const [coverUrl, setCoverUrl] = useState(() => book.cover || readCachedCover(book).value || posterCover);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    setShouldLoad(false);

    if (book.cover || !book.openlistPath || book.sourceType === 'external' || !hasOpenListVersion(book)) return undefined;
    const cachedCover = readCachedCover(book);
    if (cachedCover.status === 'miss') return undefined;
    if (cachedCover.value) {
      setCoverUrl(cachedCover.value);
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
      if (book.cover || !book.openlistPath || book.sourceType === 'external' || !hasOpenListVersion(book)) return;
      const cachedCover = readCachedCover(book);
      if (cachedCover.status === 'miss') return;
      if (cachedCover.value) {
        setCoverUrl(cachedCover.value);
        return;
      }

      try {
        const nextCover = await scheduleCoverExtraction(book, () => extractCover(book));
        if (!nextCover) {
          writeCachedCover(book, { status: 'miss', cachedAt: Date.now() });
          return;
        }
        if (cancelled) return;
        writeCachedCover(book, { status: 'hit', value: nextCover, cachedAt: Date.now() });
        setCoverUrl(nextCover);
      } catch {
        writeCachedCover(book, { status: 'miss', cachedAt: Date.now() });
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

function createPosterCover(book: BookItem) {
  if (typeof window === 'undefined') return '';

  const palette = getPosterPalette(book);
  const title = escapeSvgText(book.title);
  const author = escapeSvgText(book.author);
  const category = escapeSvgText(book.category);
  const source = book.sourceType === 'external' ? 'SOURCE' : book.sourceType.toUpperCase();
  const titleLines = wrapTitle(book.title).map((line, index) => {
    const y = 176 + index * 43;
    return `<text x="42" y="${y}" class="title">${escapeSvgText(line)}</text>`;
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="996" viewBox="0 0 720 996">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.light}"/>
      <stop offset="0.55" stop-color="${palette.mid}"/>
      <stop offset="1" stop-color="${palette.deep}"/>
    </linearGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0.08"/>
      </feComponentTransfer>
    </filter>
  </defs>
  <rect width="720" height="996" fill="url(#paper)"/>
  <rect width="720" height="996" filter="url(#grain)" opacity="0.7"/>
  <rect x="28" y="28" width="664" height="940" fill="none" stroke="${palette.ink}" stroke-opacity="0.22" stroke-width="3"/>
  <rect x="56" y="56" width="608" height="884" fill="none" stroke="${palette.ink}" stroke-opacity="0.14" stroke-width="1.5"/>
  <path d="M0 0H118V996H0Z" fill="${palette.ink}" opacity="0.13"/>
  <circle cx="592" cy="142" r="72" fill="${palette.accent}" opacity="0.28"/>
  <text x="42" y="92" class="meta">${category} / ${source}</text>
  ${titleLines.join('')}
  <line x1="42" y1="760" x2="592" y2="760" stroke="${palette.ink}" stroke-opacity="0.25" stroke-width="2"/>
  <text x="42" y="820" class="author">${author}</text>
  <text x="42" y="882" class="mark">EMPTYINKPOT BOOKSHELF</text>
  <style>
    text { fill: ${palette.ink}; font-family: Georgia, "Noto Serif SC", "Microsoft YaHei", serif; }
    .meta { font-size: 27px; font-weight: 700; letter-spacing: 5px; opacity: 0.76; }
    .title { font-size: 44px; font-weight: 800; letter-spacing: 1px; }
    .author { font-size: 28px; font-weight: 700; opacity: 0.82; }
    .mark { font-size: 19px; font-weight: 800; letter-spacing: 4px; opacity: 0.55; }
  </style>
</svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getPosterPalette(book: BookItem) {
  const palettes = [
    { light: '#f2e7d2', mid: '#d6c099', deep: '#9f7658', ink: '#2d2118', accent: '#6f2f4f' },
    { light: '#e9efe2', mid: '#bac9ad', deep: '#66856d', ink: '#17251d', accent: '#8a3d3a' },
    { light: '#ece7dc', mid: '#c6bca9', deep: '#786f64', ink: '#201d1a', accent: '#3d5a80' },
    { light: '#e4ebef', mid: '#aebfca', deep: '#526f86', ink: '#15202a', accent: '#ad6a42' },
    { light: '#efe2df', mid: '#d0aaa5', deep: '#884f58', ink: '#261619', accent: '#2f5f5f' },
    { light: '#eee9d8', mid: '#c7c09a', deep: '#6f7355', ink: '#202315', accent: '#744f8a' }
  ];
  return palettes[hashText(`${book.category}:${book.title}`) % palettes.length];
}

function wrapTitle(title: string) {
  const normalized = title.replace(/\s+/g, ' ').trim();
  const lines: string[] = [];
  let current = '';
  const maxLength = /[\u4e00-\u9fa5]/.test(normalized) ? 9 : 17;

  Array.from(normalized).forEach((char) => {
    if (current.length >= maxLength && lines.length < 4) {
      lines.push(current);
      current = '';
    }
    current += char;
  });

  if (current && lines.length < 4) lines.push(current);
  if (lines.length === 4 && normalized.length > lines.join('').length) {
    lines[3] = `${lines[3].slice(0, Math.max(1, maxLength - 1))}…`;
  }

  return lines.length ? lines : ['Untitled'];
}

function hashText(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function escapeSvgText(value: string) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function hasOpenListVersion(book: BookItem) {
  return Boolean(book.modified && book.size && book.size > 0);
}

async function extractCover(book: BookItem) {
  if (!book.openlistPath) return '';
  const file = await getOpenListFile('/api/openlist', book.openlistPath);
  const rawUrl = resolveRawUrl(file.raw_url || '', '/api/openlist');
  return book.sourceType === 'pdf' ? createPdfCover(rawUrl) : createEpubCover(rawUrl);
}

async function createPdfCover(url: string) {
  if (!url) return '';
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc ||= `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  const loadingTask = pdfjs.getDocument(url);

  try {
    return await withTimeout(
      (async () => {
        const document = await loadingTask.promise;
        const page = await document.getPage(1);
        const viewport = page.getViewport({ scale: 0.42 });
        const canvas = window.document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return '';

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        await page.render({ canvasContext: context, viewport }).promise;
        return canvas.toDataURL('image/jpeg', 0.82);
      })(),
      COVER_EXTRACTION_TIMEOUT,
      () => void loadingTask.destroy()
    );
  } finally {
    await loadingTask.destroy().catch(() => undefined);
  }
}

async function createEpubCover(url: string) {
  if (!url) return '';
  const [{ default: ePub }] = await Promise.all([import('epubjs')]);
  const book = ePub(url, { openAs: 'epub' });

  try {
    return await withTimeout(
      (async () => {
        await book.ready;
        const cover = await book.coverUrl();
        return cover ? imageUrlToDataUrl(cover) : '';
      })(),
      COVER_EXTRACTION_TIMEOUT,
      () => book.destroy()
    );
  } finally {
    book.destroy();
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, onTimeout?: () => void) {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      onTimeout?.();
      reject(new Error('cover extraction timed out'));
    }, ms);
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
  if (typeof window === 'undefined') return {};

  try {
    const raw = localStorage.getItem(getCoverCacheKey(book));
    if (!raw) return {};
    const cached = JSON.parse(raw) as CoverCacheEntry;
    if (!cached.cachedAt) return {};
    if (cached.status === 'miss') {
      if (Date.now() - cached.cachedAt > COVER_MISS_CACHE_TTL) return {};
      return cached;
    }
    if (!cached.value || Date.now() - cached.cachedAt > COVER_CACHE_TTL) return {};
    return cached;
  } catch {
    return {};
  }
}

function writeCachedCover(book: BookItem, entry: CoverCacheEntry) {
  if (typeof window === 'undefined') return;
  if (entry.status === 'hit' && !entry.value?.startsWith('data:image/')) return;

  try {
    localStorage.setItem(getCoverCacheKey(book), JSON.stringify(entry));
  } catch {
    pruneCoverCache();
    try {
      localStorage.setItem(getCoverCacheKey(book), JSON.stringify(entry));
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

function scheduleCoverExtraction(book: BookItem, task: () => Promise<string>) {
  const key = getCoverCacheKey(book);
  const current = inFlightExtractions.get(key);
  if (current) return current;

  const next = new Promise<string>((resolve, reject) => {
    extractionQueue.push(() => {
      activeExtractions += 1;
      task()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          activeExtractions -= 1;
          inFlightExtractions.delete(key);
          runNextExtraction();
        });
    });
    runNextExtraction();
  });

  inFlightExtractions.set(key, next);
  return next;
}

function runNextExtraction() {
  while (activeExtractions < MAX_ACTIVE_EXTRACTIONS && extractionQueue.length) {
    extractionQueue.shift()?.();
  }
}
