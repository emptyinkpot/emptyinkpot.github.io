import { useState } from 'react';
import { ReactReader } from 'react-reader';
import type { BookItem } from '../../lib/books/types';
import { getBookLocationKey, getBookProgressKey } from '../../lib/books/storage';

type Props = {
  book: BookItem;
  url: string;
};

export default function EpubReader({ book, url }: Props) {
  const locationKey = getBookLocationKey(book.id);
  const progressKey = getBookProgressKey(book.id);
  const [location, setLocation] = useState<string | number>(() => localStorage.getItem(locationKey) || 0);

  return (
    <section className="epub-reader">
      <ReactReader
        url={url}
        title={book.title}
        location={location}
        locationChanged={(nextLocation: string) => {
          setLocation(nextLocation);
          localStorage.setItem(locationKey, nextLocation);
          localStorage.setItem(
            progressKey,
            JSON.stringify({
              location: nextLocation,
              updatedAt: Date.now()
            })
          );
        }}
        epubInitOptions={{ openAs: 'epub' }}
        readerStyles={{
          readerArea: {
            backgroundColor: 'var(--reader-bg, #f5f1e8)'
          },
          titleArea: {
            color: 'var(--reader-text, #1e1b18)'
          },
          tocArea: {
            background: 'var(--heritage-paper, #efe8da)'
          }
        }}
      />
    </section>
  );
}
