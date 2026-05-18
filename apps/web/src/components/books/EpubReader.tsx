import { useEffect, useMemo, useState } from 'react';
import { ReactReader } from 'react-reader';
import type { BookItem } from '../../lib/books/types';
import { getBookLocationKey } from '../../lib/books/storage';
import { getBookReaderHref } from '../../lib/books/routes';
import { getReaderMemory, saveReaderMemory } from '../../lib/runtime/reader';

type Props = {
  book: BookItem;
  mode?: 'page' | 'drawer';
  url: string;
};

export default function EpubReader({ book, mode = 'page', url }: Props) {
  const locationKey = getBookLocationKey(book.id);
  const [location, setLocation] = useState<string | number>(0);
  const isDrawer = mode === 'drawer';
  const debouncedSaveMemory = useMemo(() => debounceReaderMemory(isDrawer ? 3000 : 800), [isDrawer]);

  useEffect(() => {
    let cancelled = false;
    getReaderMemory(book.id)
      .then((memory) => {
        if (cancelled) return;
        if (memory?.location && (typeof memory.location === 'string' || typeof memory.location === 'number')) {
          setLocation(memory.location);
          return;
        }
        if (memory?.location && typeof memory.location === 'object' && 'location' in memory.location) {
          setLocation(String((memory.location as { location?: string }).location || 0));
          return;
        }

        const legacyLocation = localStorage.getItem(locationKey);
        if (!legacyLocation) return;
        setLocation(legacyLocation);
        return saveReaderMemory({
          objectId: book.id,
          objectType: 'book',
          title: book.title,
          href: getBookReaderHref(book),
          location: legacyLocation
        }).then(() => {
          localStorage.removeItem(locationKey);
        });
      })
      .catch(() => {
        // Runtime API errors do not block reading; legacy state is not reused as a second truth.
      });
    return () => {
      cancelled = true;
    };
  }, [book.id, book.title, locationKey]);

  return (
    <section className={`epub-reader ${isDrawer ? 'epub-reader--drawer' : ''}`}>
      <ReactReader
        url={url}
        title={book.title}
        showToc={true}
        location={location}
        locationChanged={(nextLocation: string) => {
          setLocation(nextLocation);
          debouncedSaveMemory({
            objectId: book.id,
            objectType: 'book',
            title: book.title,
            href: getBookReaderHref(book),
            location: nextLocation
          });
        }}
        epubInitOptions={{ openAs: 'epub' }}
        epubOptions={
          isDrawer
            ? {
                flow: 'scrolled',
                manager: 'continuous',
                spread: 'none'
              }
            : undefined
        }
        readerStyles={{
          readerArea: {
            backgroundColor: 'var(--reader-bg, #f5f1e8)'
          },
          titleArea: {
            display: isDrawer ? 'none' : 'block',
            color: 'var(--reader-text, #1e1b18)'
          },
          reader: {
            top: isDrawer ? 18 : 50,
            left: isDrawer ? 34 : 50,
            right: isDrawer ? 34 : 50,
            bottom: isDrawer ? 22 : 20
          },
          arrow: {
            display: isDrawer ? 'none' : 'block'
          },
          tocArea: {
            background: 'var(--heritage-paper, #efe8da)'
          },
          tocAreaButton: {
            borderBottom: '0',
            color: 'var(--heritage-muted, #6b645c)',
            fontFamily: 'var(--font-ui)'
          }
        }}
      />
    </section>
  );
}

function debounceReaderMemory(delay: number) {
  let timer = 0;
  return (record: Parameters<typeof saveReaderMemory>[0]) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      saveReaderMemory(record).catch(() => {
        // Runtime persistence errors are surfaced by the network layer; reading itself stays interactive.
      });
    }, delay);
  };
}
