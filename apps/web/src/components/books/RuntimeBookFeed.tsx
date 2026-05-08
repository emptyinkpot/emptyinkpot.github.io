import { BookOpen } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { buildCanonicalBooks, normalizeOpenListBookFile } from '../../lib/books/dynamicLibrary';
import { listOpenListFiles } from '../../lib/books/openlist';
import { loadBookSettings } from '../../lib/books/storage';
import { getBookDetailHref, getBookReaderHref } from '../../lib/books/routes';
import type { BookItem } from '../../lib/books/types';
import BookCover from './BookCover';
import BookDrawerReader from './BookDrawerReader';

type Props = {
  targetId: string;
};

type SearchDoc = {
  id: string;
  type: 'book';
  title: string;
  content: string;
  tags: string[];
  href: string;
  drawerId: string;
  sourceId: string;
};

export default function RuntimeBookFeed({ targetId }: Props) {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [status, setStatus] = useState('正在同步 OpenList 书籍...');
  const settings = useMemo(() => loadBookSettings(), []);

  useEffect(() => {
    let cancelled = false;
    listOpenListFiles(settings.openlistBaseUrl, settings.openlistBooksPath)
      .then((files) => {
        if (cancelled) return;
        const dynamicBooks = files.map(normalizeOpenListBookFile).filter(Boolean) as BookItem[];
        const canonicalBooks = buildCanonicalBooks(dynamicBooks);
        setBooks(canonicalBooks);
        setStatus(`OpenList canonical：${canonicalBooks.length} 本`);
        window.dispatchEvent(
          new CustomEvent('emptyinkpot:runtime-books-ready', {
            detail: {
              count: canonicalBooks.length,
              docs: canonicalBooks.map(toSearchDoc)
            }
          })
        );
      })
      .catch((error: Error) => {
        if (cancelled) return;
        setBooks([]);
        setStatus(`OpenList 书籍同步失败：${error.message}`);
      });

    return () => {
      cancelled = true;
    };
  }, [settings]);

  return (
    <>
      <article className="home-feed-card home-feed-card--compact runtime-book-status" data-runtime-book-feed={targetId} data-feed-card data-feed-kind="book">
        <div className="bookmark bookmark--book">
          <span>book</span>
        </div>
        <div className="home-feed-card__body">
          <span>Books</span>
          <h2>OpenList 书架</h2>
          <p>{status}</p>
        </div>
      </article>
        {books.map((book) => (
          <RuntimeBookCard book={book} key={book.id} />
        ))}
      <section className="runtime-book-templates" hidden>
        {books.map((book) => (
          <RuntimeBookTemplate book={book} key={book.id} />
        ))}
      </section>
      <BookDrawerReader books={books} />
    </>
  );
}

function RuntimeBookCard({ book }: { book: BookItem }) {
  const drawerId = `book:${book.id}`;
  return (
    <button
      type="button"
      className="home-feed-card home-feed-card--compact"
      data-feed-card
      data-feed-kind="book"
      data-drawer-id={drawerId}
      data-seal-target={drawerId}
      data-seal-title={book.title}
      data-seal-kind="book"
      data-hover-preview={JSON.stringify(toHoverPreview(book))}
    >
      <div className="bookmark bookmark--book">
        <span>book</span>
      </div>
      <span className="seal-trigger" role="button" tabIndex={0} data-seal-trigger>
        盖章
      </span>
      <span className="card-paperclip" aria-hidden="true" />
      <div className="home-feed-card__cover home-feed-card__cover--book">
        <BookCover book={book} allowGeneratedCover={false} />
      </div>
      <div className="home-feed-card__body">
        <div className="home-feed-card__meta">
          <span>书架 / {book.statusLabel}</span>
          <small>{book.author}</small>
        </div>
        <h2>{book.title}</h2>
        <p>{book.description || book.note}</p>
        <div className="home-feed-card__tags">
          {[book.category, book.statusLabel, book.sourceType.toUpperCase(), ...book.tags].slice(0, 4).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </button>
  );
}

function RuntimeBookTemplate({ book }: { book: BookItem }) {
  const drawerId = `book:${book.id}`;
  const readHref = book.sourceType === 'external' ? '' : getBookReaderHref(book);
  const coverSrc = getBookCoverSrc(book);

  return (
    <article
      className="home-article-reader"
      data-drawer-template={drawerId}
      data-article-id={drawerId}
      data-kind="book"
      data-full-href={getBookDetailHref(book)}
      data-read-href={readHref}
      data-book-id={book.id}
      data-kicker={`书架 / ${book.statusLabel}`}
      data-title={book.title}
    >
      <header className="home-article-intro">
        <span>书架 / {book.statusLabel}</span>
        <h1>{book.title}</h1>
        <p>{book.description || book.note}</p>
      </header>
      <div className="home-drawer-summary">
        {readHref ? (
          <section className="book-drawer-reader-panel" aria-label={`${book.title} 阅读器`}>
            <header className="book-drawer-reader-panel__intro">
              <div className="home-drawer-summary__media home-drawer-summary__media--book">
                <BookCover book={book} allowGeneratedCover={false} />
              </div>
              <div className="book-drawer-reader-panel__copy">
                <span className="book-drawer-reader-panel__eyebrow">Runtime Book Object</span>
                <h3>{book.title}</h3>
                <p>{book.description || book.note}</p>
                <div className="home-feed-card__tags">
                  {[book.category, book.statusLabel, book.sourceType.toUpperCase(), ...book.tags].slice(0, 6).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </header>
            <div className="book-drawer-reader-panel__mount" data-book-drawer-reader-mount={`${book.id}-${drawerId.replace(/[^a-zA-Z0-9_-]/g, '-')}`}>
              {book.sourceType === 'pdf' ? (
                <section className="pdf-reader pdf-reader--drawer" data-book-drawer-instant>
                  <article className="pdf-reader__instant" aria-label={`${book.title} 阅读首屏`}>
                    {coverSrc ? (
                      <img src={coverSrc} alt={`${book.title} 封面`} loading="eager" />
                    ) : (
                      <span className="book-cover-fallback">
                        <i>无封面</i>
                      </span>
                    )}
                    <div>
                      <span>{book.sourceType.toUpperCase()} ARCHIVE</span>
                      <h2>{book.title}</h2>
                      <p>{book.author}</p>
                    </div>
                  </article>
                </section>
              ) : null}
            </div>
          </section>
        ) : (
          <>
            <div className="home-drawer-summary__media home-drawer-summary__media--book">
              <BookCover book={book} allowGeneratedCover={false} />
            </div>
            <div className="home-drawer-summary__main">
              <dl className="home-drawer-summary__details">
                <div>
                  <dt>作者</dt>
                  <dd>{book.author}</dd>
                </div>
                <div>
                  <dt>来源</dt>
                  <dd>{book.sourceType.toUpperCase()} / OpenList</dd>
                </div>
                <div>
                  <dt>路径</dt>
                  <dd>{book.openlistPath}</dd>
                </div>
              </dl>
            </div>
          </>
        )}
      </div>
    </article>
  );
}

function getBookCoverSrc(book: BookItem) {
  return book.cover || '';
}

function toSearchDoc(book: BookItem): SearchDoc {
  const drawerId = `book:${book.id}`;
  return {
    id: drawerId,
    type: 'book',
    title: book.title,
    content: [book.author, book.category, book.statusLabel, book.note, book.description, book.openlistPath].filter(Boolean).join('\n'),
    tags: [book.category, book.statusLabel, book.sourceType.toUpperCase(), ...book.tags],
    href: getBookDetailHref(book),
    drawerId,
    sourceId: book.id
  };
}

function toHoverPreview(book: BookItem) {
  return {
    type: 'book',
    id: book.id,
    title: book.title,
    summary: book.description || book.note,
    image: getBookCoverSrc(book),
    tags: [book.category, book.statusLabel, book.sourceType.toUpperCase(), ...book.tags].slice(0, 4)
  };
}
