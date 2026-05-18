import { useEffect, useState } from 'react';
import type { BookItem } from '../../lib/books/types';
import { buildCachedBookCoverUrl } from '../../lib/books/openlist';
import { defaultBookSettings } from '../../lib/books/storage';

type Props = {
  book: BookItem;
  className?: string;
  allowGeneratedCover?: boolean;
};

export default function BookCover({ book, className = '', allowGeneratedCover = true }: Props) {
  const [coverUrl, setCoverUrl] = useState(() => book.cover || '');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    setCoverUrl(book.cover || (allowGeneratedCover ? getOpenListCoverUrl(book) : ''));
  }, [book, allowGeneratedCover]);

  return (
    <span className={`book-cover-render ${className}`.trim()} data-book-cover-id={book.id}>
      {coverUrl && !failed ? (
        <img
          src={coverUrl}
          alt={`${book.title} 封面`}
          onError={() => {
            setFailed(true);
            setCoverUrl('');
          }}
        />
      ) : (
        <span className="book-cover-fallback">
          <i>无封面</i>
        </span>
      )}
    </span>
  );
}

function getOpenListCoverUrl(book: BookItem) {
  return buildCachedBookCoverUrl(book, defaultBookSettings);
}
