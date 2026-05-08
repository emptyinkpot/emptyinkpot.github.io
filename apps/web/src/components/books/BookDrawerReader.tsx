import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { buildCachedBookRawUrl } from '../../lib/books/openlist';
import { loadBookSettings } from '../../lib/books/storage';
import type { BookItem } from '../../lib/books/types';
import { preloadAllBookRuntimes, preloadBookRuntime } from './readerRuntime';

type Props = {
  books: BookItem[];
};

type BookReaderComponent = typeof import('./BookReader')['default'];
type ActiveReader = { bookId: string; target: Element } | null;
type ReaderRect = { height: number; left: number; top: number; width: number };
type BookDrawerOpenDetail = { bookId?: string; mountId?: string };
const prefetchedRanges = new Map<string, Set<'head' | 'tail'>>();
const prefetchingRanges = new Set<string>();
const prefetchBytes = 512 * 1024;
const readerPoolLimit = 3;

export default function BookDrawerReader({ books }: Props) {
  const [activeReader, setActiveReader] = useState<ActiveReader>(null);
  const [BookReader, setBookReader] = useState<BookReaderComponent | null>(null);
  const [readerPool, setReaderPool] = useState<string[]>([]);
  const [readerRect, setReaderRect] = useState<ReaderRect | null>(null);
  const settings = useMemo(() => loadBookSettings(), []);
  const booksById = useMemo(() => new Map(books.map((book) => [book.id, book])), [books]);

  useEffect(() => {
    function openFromDetail(detail: BookDrawerOpenDetail | undefined) {
      if (!detail?.bookId || !detail.mountId) return;

      const target = document.querySelector(`[data-book-drawer-reader-mount="${CSS.escape(detail.mountId)}"]`);
      if (!target) return;
      setActiveReader({ bookId: detail.bookId, target });
      setReaderPool((current) => [detail.bookId, ...current.filter((item) => item !== detail.bookId)].slice(0, readerPoolLimit));
    }

    function open(event: Event) {
      openFromDetail((event as CustomEvent<BookDrawerOpenDetail>).detail);
    }

    function close() {
      setActiveReader(null);
      setReaderRect(null);
      window.__emptyinkpotPendingBookDrawerOpen = null;
    }

    window.addEventListener('emptyinkpot:book-drawer-open', open);
    window.addEventListener('emptyinkpot:book-drawer-close', close);
    openFromDetail(window.__emptyinkpotPendingBookDrawerOpen);
    return () => {
      window.removeEventListener('emptyinkpot:book-drawer-open', open);
      window.removeEventListener('emptyinkpot:book-drawer-close', close);
    };
  }, []);

  useEffect(() => {
    if (BookReader) return;
    const load = () =>
      Promise.allSettled([import('./BookReader').then((module) => setBookReader(() => module.default)), preloadAllBookRuntimes()]);
    if (activeReader) {
      load();
      return;
    }
    const idleId = 'requestIdleCallback' in window ? window.requestIdleCallback(load, { timeout: 1800 }) : window.setTimeout(load, 900);
    return () => {
      if ('cancelIdleCallback' in window && typeof idleId === 'number') window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId as number);
    };
  }, [BookReader, activeReader]);

  const updateActiveRect = useCallback(() => {
    if (!activeReader?.target) return;
    const rect = activeReader.target.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    setReaderRect({
      height: rect.height,
      left: rect.left,
      top: rect.top,
      width: rect.width
    });
  }, [activeReader]);

  useLayoutEffect(() => {
    if (!activeReader) return;
    let frame = 0;
    const schedule = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateActiveRect);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(activeReader.target);
    schedule();
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, true);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule, true);
    };
  }, [activeReader, updateActiveRect]);

  useEffect(() => {
    const cards = [...document.querySelectorAll<HTMLElement>('[data-drawer-id^="book:"]')];
    if (!cards.length) return;

    const prefetchFromCard = (card: HTMLElement, priority: 'visible' | 'intent') => {
      const bookId = card.dataset.drawerId?.replace(/^book:/, '');
      const book = books.find((item) => item.id === bookId);
      if (!book) return;
      preloadBookRuntime(book.sourceType).catch(() => {
        // Runtime preload failures are surfaced when the reader mounts.
      });
      if (priority === 'intent') {
        setReaderPool((current) => [book.id, ...current.filter((item) => item !== book.id)].slice(0, readerPoolLimit));
        prefetchBookSource(book, settings, priority);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target instanceof HTMLElement) {
            prefetchFromCard(entry.target, 'visible');
          }
        });
      },
      { rootMargin: '520px 0px' }
    );
    const cleanup: Array<() => void> = [];

    cards.forEach((card) => {
      const intent = () => prefetchFromCard(card, 'intent');
      observer.observe(card);
      card.addEventListener('pointerenter', intent);
      card.addEventListener('focusin', intent);
      cleanup.push(() => {
        card.removeEventListener('pointerenter', intent);
        card.removeEventListener('focusin', intent);
      });
    });

    return () => {
      observer.disconnect();
      cleanup.forEach((item) => item());
    };
  }, [books, settings]);

  useEffect(() => {
    if (!activeReader) return;
    const book = booksById.get(activeReader.bookId);
    if (book) prefetchBookSource(book, settings, 'intent');
  }, [booksById, settings, activeReader]);

  const activeBook = activeReader ? booksById.get(activeReader.bookId) : null;

  if (activeReader && !activeBook) {
    return createPortal(
      <section className="book-reader-empty book-reader-empty--drawer">
        <span>Book Drawer</span>
        <h1>未找到书籍</h1>
        <p>当前抽屉没有拿到可阅读的书籍对象。</p>
      </section>,
      activeReader.target
    );
  }

  if (activeReader && !BookReader) {
    return createPortal(
      <span className="book-reader-empty book-reader-empty--drawer book-reader-empty--silent" aria-hidden="true" />,
      activeReader.target
    );
  }

  if (!BookReader || !readerPool.length) return null;

  return createPortal(
    <div className="book-reader-pool-layer" aria-hidden={!activeReader}>
      {readerPool.map((bookId) => {
        const book = booksById.get(bookId);
        if (!book) return null;

        const isActive = activeReader?.bookId === bookId && readerRect;
        return (
          <div
            className={`book-reader-pool-slot ${isActive ? 'is-active' : ''}`}
            data-reader-pool-book={bookId}
            key={bookId}
            style={
              isActive
                ? {
                    height: `${readerRect.height}px`,
                    left: `${readerRect.left}px`,
                    top: `${readerRect.top}px`,
                    width: `${readerRect.width}px`
                  }
                : undefined
            }
          >
            <BookReader book={book} mode="drawer" />
          </div>
        );
      })}
    </div>,
    document.body
  );
}

declare global {
  interface Window {
    __emptyinkpotPendingBookDrawerOpen?: BookDrawerOpenDetail | null;
  }
}

function prefetchBookSource(book: BookItem, settings: ReturnType<typeof loadBookSettings>, priority: 'visible' | 'intent') {
  if (book.sourceType === 'external') return;
  const url = buildCachedBookRawUrl(book, settings);
  if (!url) return;

  preloadBookRuntime(book.sourceType).catch(() => {
    // Runtime preload failures are surfaced when the reader mounts.
  });

  const completed = prefetchedRanges.get(url) ?? new Set<'head' | 'tail'>();
  const wanted: Array<{ key: 'head' | 'tail'; range: string }> =
    priority === 'intent'
      ? [
          { key: 'head', range: `bytes=0-${prefetchBytes - 1}` },
          { key: 'tail', range: `bytes=-${prefetchBytes}` }
        ]
      : [{ key: 'head', range: `bytes=0-${prefetchBytes - 1}` }];
  const ranges = wanted.filter((item) => !completed.has(item.key) && !prefetchingRanges.has(`${url}:${item.key}`));
  if (!ranges.length) return;

  Promise.allSettled(
    ranges.map(({ key, range }) => {
      prefetchingRanges.add(`${url}:${key}`);
      return fetch(url, {
        headers: { range },
        cache: 'force-cache',
        priority: priority === 'intent' ? 'high' : 'low'
      } as RequestInit & { priority?: 'high' | 'low' }).then((response) => {
        if (response.ok || response.status === 206) {
          const next = prefetchedRanges.get(url) ?? new Set<'head' | 'tail'>();
          next.add(key);
          prefetchedRanges.set(url, next);
        }
      });
    })
  ).finally(() => {
    ranges.forEach(({ key }) => prefetchingRanges.delete(`${url}:${key}`));
  });
}
