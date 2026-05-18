import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import type { PDFDocumentLoadingTask, PDFDocumentProxy, PDFPageProxy, RenderTask } from 'pdfjs-dist';
import type { BookItem } from '../../lib/books/types';
import { getBookProgressKey, loadBookSettings } from '../../lib/books/storage';
import { buildCachedBookCoverUrl, buildCachedBookPageUrl } from '../../lib/books/openlist';
import { getBookReaderHref } from '../../lib/books/routes';
import { getReaderMemory, saveReaderMemory } from '../../lib/runtime/reader';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
const PDF_RANGE_CHUNK_SIZE = 768 * 1024;
const CACHED_PDF_INITIAL_PAGES = 4;
const CACHED_PDF_PAGE_BATCH = 4;
const CACHED_PDF_MAX_PAGES = 800;

type Props = {
  book: BookItem;
  mode?: 'page' | 'drawer';
  url: string;
};

export default function PdfReader({ book, mode = 'page', url }: Props) {
  if (mode === 'drawer') {
    return <PdfDrawerReader book={book} url={url} />;
  }

  return <PdfPageReader book={book} url={url} />;
}

function PdfPageReader({ book, url }: Props) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState(0);
  const [width, setWidth] = useState(860);
  const [page, setPage] = useState(1);
  const debouncedSaveMemory = useMemo(() => debounceReaderMemory(600), []);
  const pdfFile = useMemo(() => ({ url }), [url]);
  const pdfOptions = useMemo(
    () => ({
      disableAutoFetch: false,
      disableRange: false,
      disableStream: true,
      length: book.size && book.size > 0 ? book.size : undefined,
      rangeChunkSize: PDF_RANGE_CHUNK_SIZE
    }),
    [book.size]
  );

  useEffect(() => {
    let cancelled = false;
    getReaderMemory(book.id)
      .then((memory) => {
        if (cancelled) return;
        const nextPage =
          typeof memory?.location === 'object' && memory.location && 'page' in memory.location
            ? Number((memory.location as { page?: number }).page || 0)
            : 0;
        if (nextPage > 0) {
          setPage(nextPage);
          return;
        }

        const legacyPage = Number(localStorage.getItem(`${getBookProgressKey(book.id)}:page`) || 0);
        if (legacyPage <= 0) return;
        setPage(legacyPage);
        return saveReaderMemory({
          objectId: book.id,
          objectType: 'book',
          title: book.title,
          href: getBookReaderHref(book),
          location: { page: legacyPage }
        }).then(() => {
          localStorage.removeItem(`${getBookProgressKey(book.id)}:page`);
        });
      })
      .catch(() => {
        // Runtime API errors do not block reading; legacy state is not reused as a second truth.
      });
    return () => {
      cancelled = true;
    };
  }, [book.id, book.title]);

  useEffect(() => {
    if (!shellRef.current) return;
    const resize = () => setWidth(Math.min(920, Math.max(280, shellRef.current?.clientWidth ? shellRef.current.clientWidth - 40 : 860)));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(shellRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setNumPages(0);
  }, [url]);

  const savePageMemory = useCallback((next: number) => {
    const value = Math.max(1, Math.min(next, numPages || next));
    debouncedSaveMemory({
      objectId: book.id,
      objectType: 'book',
      title: book.title,
      href: getBookReaderHref(book),
      location: { page: value },
      progress: numPages ? value / numPages : 0
    });
  }, [book.id, book.title, debouncedSaveMemory, numPages]);

  const setCurrentPage = (next: number) => {
    const value = Math.max(1, Math.min(next, numPages || next));
    setPage(value);
    savePageMemory(value);
  };

  const handlePdfLoadSuccess = useCallback((pdf: PDFDocumentProxy) => {
    setNumPages(pdf.numPages);
  }, []);

  return (
    <section className="pdf-reader" ref={shellRef}>
      <div className="pdf-controls">
        <button type="button" onClick={() => setCurrentPage(page - 1)} disabled={page <= 1}>
          上一页
        </button>
        <span>
          {page} / {numPages || '?'}
        </span>
        <button type="button" onClick={() => setCurrentPage(page + 1)} disabled={Boolean(numPages) && page >= numPages}>
          下一页
        </button>
      </div>

      <Document
        file={pdfFile}
        options={pdfOptions}
        loading={<span className="pdf-reader__status pdf-reader__status--silent" aria-hidden="true" />}
        error={<p className="pdf-reader__status">PDF 打开失败，请先完成 OpenList 文件缓存预热。</p>}
        onLoadSuccess={handlePdfLoadSuccess}
      >
        <Page pageNumber={page} width={width} />
      </Document>
    </section>
  );
}

function PdfDrawerReader({
  book,
  url
}: {
  book: BookItem;
  url: string;
}) {
  const shellRef = useRef<HTMLDivElement>(null);
  const loadingTaskRef = useRef<PDFDocumentLoadingTask | null>(null);
  const rangeTransportRef = useRef<CachedPdfRangeTransport | null>(null);
  const [error, setError] = useState('');
  const [firstPageReady, setFirstPageReady] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const [outline, setOutline] = useState<Array<{ pageNumber: number; title: string }>>([]);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [initialPage, setInitialPage] = useState(1);
  const [visiblePages, setVisiblePages] = useState<number[]>([1, 2]);
  const [width, setWidth] = useState(860);
  const settings = useMemo(() => loadBookSettings(), []);
  const coverUrl = useMemo(() => book.cover || buildCachedBookCoverUrl(book, settings), [book, settings]);
  const debouncedSaveMemory = useMemo(() => debounceReaderMemory(2500), []);

  const savePageMemory = useCallback((next: number) => {
    const value = Math.max(1, Math.min(next, numPages || next));
    debouncedSaveMemory({
      objectId: book.id,
      objectType: 'book',
      title: book.title,
      href: getBookReaderHref(book),
      location: { page: value },
      progress: numPages ? value / numPages : 0
    });
  }, [book.id, book.title, debouncedSaveMemory, numPages]);

  useEffect(() => {
    if (!shellRef.current) return;
    const resize = () => setWidth(Math.min(920, Math.max(280, shellRef.current?.clientWidth ? shellRef.current.clientWidth - 40 : 860)));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(shellRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    getReaderMemory(book.id)
      .then((memory) => {
        if (cancelled) return;
        const nextPage =
          typeof memory?.location === 'object' && memory.location && 'page' in memory.location
            ? Number((memory.location as { page?: number }).page || 0)
            : 0;
        if (nextPage <= 1) return;
        setInitialPage(nextPage);
        setVisiblePages([nextPage, 1, 2]);
      })
      .catch(() => {
        // Runtime API errors do not block reading.
      });
    return () => {
      cancelled = true;
    };
  }, [book.id]);

  useEffect(() => {
    let cancelled = false;
    setError('');
    setFirstPageReady(false);
    setNumPages(0);
    setOutline([]);
    setPdf(null);
    setVisiblePages(initialPage > 1 ? [initialPage, 1, 2] : [1, 2]);

    async function openPdf() {
      const transport = await createCachedPdfRangeTransport(url, book.size);
      if (cancelled) {
        transport.abort();
        return;
      }
      rangeTransportRef.current = transport;
      const task = pdfjs.getDocument({
        disableAutoFetch: true,
        disableRange: false,
        disableStream: true,
        length: transport.length,
        range: transport,
        rangeChunkSize: PDF_RANGE_CHUNK_SIZE
      });
      loadingTaskRef.current = task;
      const document = await task.promise;
      if (cancelled) {
        await document.destroy().catch(() => undefined);
        return;
      }
      setPdf(document);
      setNumPages(document.numPages);
      document
        .getOutline()
        .then((items) => resolvePdfOutline(document, items))
        .then((items) => {
          if (!cancelled) setOutline(items);
        })
        .catch(() => {
          if (!cancelled) setOutline([]);
        });
    }

    openPdf().catch(() => {
      if (!cancelled) setError('PDF Runtime 初始化失败，请检查文件缓存和 Range 支持。');
    });

    return () => {
      cancelled = true;
      rangeTransportRef.current?.abort();
      loadingTaskRef.current?.destroy().catch(() => undefined);
      loadingTaskRef.current = null;
      rangeTransportRef.current = null;
    };
  }, [book.size, initialPage, url]);

  useEffect(() => {
    if (!pdf || !numPages || initialPage <= 1) return;
    const id = window.setTimeout(() => {
      shellRef.current?.querySelector(`[data-pdf-page="${initialPage}"]`)?.scrollIntoView({ block: 'start' });
    }, 160);
    return () => window.clearTimeout(id);
  }, [initialPage, numPages, pdf]);

  const requestPage = useCallback((pageNumber: number) => {
    setVisiblePages((current) => {
      const next = new Set(current);
      for (let page = Math.max(1, pageNumber - 2); page <= pageNumber + 3; page += 1) next.add(page);
      return [...next].sort((a, b) => a - b).slice(-10);
    });
    savePageMemory(pageNumber);
  }, [savePageMemory]);

  const pages = useMemo(() => {
    if (!numPages) return [];
    const wanted = new Set(visiblePages.filter((item) => item >= 1 && item <= numPages));
    wanted.add(1);
    if (numPages >= 2) wanted.add(2);
    return [...wanted].sort((a, b) => a - b);
  }, [numPages, visiblePages]);

  return (
    <section className="pdf-reader pdf-reader--drawer pdf-reader--direct" ref={shellRef}>
      {!firstPageReady ? <CachedPdfPageList book={book} coverUrl={coverUrl} onVisiblePage={savePageMemory} settings={settings} /> : null}
      {outline.length ? (
        <nav className="pdf-reader__toc" aria-label="PDF 目录">
          {outline.slice(0, 28).map((item) => (
            <button
              key={`${item.pageNumber}:${item.title}`}
              type="button"
              onClick={() => {
                setVisiblePages((current) => [...new Set([...current, item.pageNumber])]);
                window.setTimeout(() => shellRef.current?.querySelector(`[data-pdf-page="${item.pageNumber}"]`)?.scrollIntoView({ block: 'start' }), 80);
              }}
            >
              <span>{item.title}</span>
              <small>{item.pageNumber}</small>
            </button>
          ))}
        </nav>
      ) : null}
      {error ? <p className="pdf-reader__status">{error}</p> : null}
      {pages.map((pageNumber) => (
        <DirectPdfPage
          key={pageNumber}
          onFirstRender={() => setFirstPageReady(true)}
          onVisible={requestPage}
          pageNumber={pageNumber}
          pdf={pdf}
          width={width}
        />
      ))}
    </section>
  );
}

function CachedPdfPageList({
  book,
  coverUrl,
  onVisiblePage,
  settings
}: {
  book: BookItem;
  coverUrl: string;
  onVisiblePage(page: number): void;
  settings: ReturnType<typeof loadBookSettings>;
}) {
  const [pages, setPages] = useState(() => Array.from({ length: CACHED_PDF_INITIAL_PAGES }, (_, index) => index + 1));
  const [ended, setEnded] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const appendPages = useCallback(() => {
    if (ended) return;
    setPages((current) => {
      const last = current.at(-1) || 0;
      if (last >= CACHED_PDF_MAX_PAGES) return current;
      const nextLast = Math.min(CACHED_PDF_MAX_PAGES, last + CACHED_PDF_PAGE_BATCH);
      return [...current, ...Array.from({ length: nextLast - last }, (_, index) => last + index + 1)];
    });
  }, [ended]);

  useEffect(() => {
    if (!sentinelRef.current || ended) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) appendPages();
      },
      { rootMargin: '1400px 0px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [appendPages, ended]);

  const handleMissingPage = useCallback((page: number) => {
    setEnded(true);
    setPages((current) => current.filter((item) => item < page));
  }, []);

  return (
    <section className="pdf-reader__cached-pages" aria-label={`${book.title} 缓存正文`}>
      {pages.map((pageNumber) => (
        <CachedPdfPageImage
          book={book}
          key={pageNumber}
          onMissing={handleMissingPage}
          onVisible={onVisiblePage}
          pageNumber={pageNumber}
          settings={settings}
        />
      ))}
      {coverUrl ? (
        <article className="pdf-reader__instant pdf-reader__instant--fallback" aria-label={`${book.title} 阅读首屏`}>
          <img src={coverUrl} alt={`${book.title} 封面`} />
          <div>
            <span>{book.sourceType.toUpperCase()} ARCHIVE</span>
            <h2>{book.title}</h2>
            <p>{book.author}</p>
          </div>
        </article>
      ) : null}
      {!ended ? <div className="pdf-reader__cached-sentinel" ref={sentinelRef} aria-hidden="true" /> : null}
    </section>
  );
}

function CachedPdfPageImage({
  book,
  onMissing,
  onVisible,
  pageNumber,
  settings
}: {
  book: BookItem;
  onMissing(page: number): void;
  onVisible(page: number): void;
  pageNumber: number;
  settings: ReturnType<typeof loadBookSettings>;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const url = useMemo(() => buildCachedBookPageUrl(book, settings, pageNumber), [book, pageNumber, settings]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!ref.current || failed) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) onVisible(pageNumber);
      },
      { rootMargin: '220px 0px', threshold: 0.08 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [failed, onVisible, pageNumber]);

  if (!url || failed) return null;

  return (
    <img
      alt={`${book.title} 第 ${pageNumber} 页`}
      data-cached-pdf-page={pageNumber}
      decoding="async"
      loading={pageNumber <= 2 ? 'eager' : 'lazy'}
      onError={() => {
        setFailed(true);
        onMissing(pageNumber);
      }}
      ref={ref}
      src={url}
    />
  );
}

function PdfInstantCover({ book, coverUrl }: { book: BookItem; coverUrl: string }) {
  return (
    <article className="pdf-reader__instant" aria-label={`${book.title} 阅读首屏`}>
      <img src={coverUrl} alt={`${book.title} 封面`} />
      <div>
        <span>{book.sourceType.toUpperCase()} ARCHIVE</span>
        <h2>{book.title}</h2>
        <p>{book.author}</p>
      </div>
    </article>
  );
}

function debounceReaderMemory(delay: number) {
  let timer = 0;
  return (record: Parameters<typeof saveReaderMemory>[0]) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      saveReaderMemory(record).catch(() => {
        // Runtime persistence errors are surfaced by the network layer; reading stays interactive.
      });
    }, delay);
  };
}

function DirectPdfPage({
  onFirstRender,
  onVisible,
  pageNumber,
  pdf,
  width
}: {
  onFirstRender?(): void;
  onVisible(page: number): void;
  pageNumber: number;
  pdf: PDFDocumentProxy | null;
  width: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const [height, setHeight] = useState(Math.round(width * 1.34));
  const [shouldRender, setShouldRender] = useState(pageNumber <= 2);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRender(true);
          onVisible(pageNumber);
        }
      },
      { rootMargin: '960px 0px', threshold: 0.01 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onVisible, pageNumber]);

  useEffect(() => {
    if (!pdf || !shouldRender || !canvasRef.current) return;
    let cancelled = false;
    const canvas = canvasRef.current;

    async function renderPage() {
      renderTaskRef.current?.cancel();
      const page = await pdf.getPage(pageNumber);
      if (cancelled) return;
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = width / baseViewport.width;
      const viewport = page.getViewport({ scale });
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * ratio);
      canvas.height = Math.floor(viewport.height * ratio);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;
      setHeight(Math.ceil(viewport.height));
      const context = canvas.getContext('2d');
      if (!context) return;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const task = page.render({ canvas, canvasContext: context, viewport });
      renderTaskRef.current = task;
      await task.promise;
      if (!cancelled && pageNumber === 1) onFirstRender?.();
      page.cleanup();
    }

    renderPage().catch((error) => {
      if (!cancelled && error?.name !== 'RenderingCancelledException') {
        // Page-level render failures should not take down the whole drawer.
      }
    });
    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;
    };
  }, [onFirstRender, pageNumber, pdf, shouldRender, width]);

  return (
    <div ref={ref} className="pdf-reader__page pdf-reader__page--direct" data-pdf-page={pageNumber} style={{ minHeight: height }}>
      {shouldRender ? <canvas ref={canvasRef} /> : null}
    </div>
  );
}

class CachedPdfRangeTransport extends pdfjs.PDFDataRangeTransport {
  private readonly controllers = new Set<AbortController>();
  private readonly sourceUrl: string;

  constructor(length: number, initialData: Uint8Array | null, sourceUrl: string) {
    super(length, initialData, true);
    this.sourceUrl = sourceUrl;
    this.transportReady();
  }

  requestDataRange(begin: number, end: number) {
    const controller = new AbortController();
    this.controllers.add(controller);
    fetch(this.sourceUrl, {
      headers: { range: `bytes=${begin}-${Math.max(begin, end - 1)}` },
      signal: controller.signal
    })
      .then((response) => {
        if (!response.ok && response.status !== 206) throw new Error(`PDF range failed: ${response.status}`);
        return response.arrayBuffer();
      })
      .then((buffer) => {
        this.onDataRange(begin, new Uint8Array(buffer));
        this.onDataProgress(Math.min(end, this.length), this.length);
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') {
          // PDF.js may retry adjacent ranges; keep failures local to this request.
        }
      })
      .finally(() => {
        this.controllers.delete(controller);
      });
  }

  abort() {
    this.controllers.forEach((controller) => controller.abort());
    this.controllers.clear();
    super.abort();
  }
}

async function createCachedPdfRangeTransport(url: string, knownSize?: number) {
  const probeEnd = knownSize && knownSize > 0 ? Math.min(knownSize - 1, PDF_RANGE_CHUNK_SIZE - 1) : PDF_RANGE_CHUNK_SIZE - 1;
  const probe = await fetch(url, { headers: { range: `bytes=0-${probeEnd}` } });
  if (!probe.ok && probe.status !== 206) throw new Error(`PDF probe failed: ${probe.status}`);
  const initialData = new Uint8Array(await probe.arrayBuffer());
  const length = knownSize && knownSize > 0 ? knownSize : getLengthFromContentRange(probe.headers.get('content-range'));
  if (!length) throw new Error('PDF range probe did not return content length.');
  return new CachedPdfRangeTransport(length, initialData, url);
}

function getLengthFromContentRange(value: string | null) {
  const match = value?.match(/\/(\d+)$/);
  return match ? Number(match[1]) : 0;
}

async function resolvePdfOutline(pdf: PDFDocumentProxy, items: Awaited<ReturnType<PDFDocumentProxy['getOutline']>>) {
  if (!items?.length) return [];
  const flat = flattenPdfOutline(items);
  const resolved = await Promise.all(
    flat.map(async (item) => {
      try {
        const explicitPageNumber = typeof item.dest === 'object' && item.dest && 'num' in item.dest ? Number(item.dest.num || 0) : 0;
        if (explicitPageNumber > 0) return { title: item.title, pageNumber: explicitPageNumber };
        const dest = typeof item.dest === 'string' ? await pdf.getDestination(item.dest) : item.dest;
        const ref = Array.isArray(dest) ? dest[0] : null;
        if (!ref) return null;
        const pageIndex = typeof ref === 'number' ? ref : await pdf.getPageIndex(ref);
        return { title: item.title, pageNumber: pageIndex + 1 };
      } catch {
        return null;
      }
    })
  );
  return resolved.filter((item): item is { pageNumber: number; title: string } => Boolean(item?.pageNumber && item.title));
}

function flattenPdfOutline(
  items: NonNullable<Awaited<ReturnType<PDFDocumentProxy['getOutline']>>>
): Array<{ dest: NonNullable<Awaited<ReturnType<PDFDocumentProxy['getOutline']>>>[number]['dest']; title: string }> {
  return items.flatMap((item) => [
    { dest: item.dest, title: item.title },
    ...flattenPdfOutline(item.items || [])
  ]);
}
