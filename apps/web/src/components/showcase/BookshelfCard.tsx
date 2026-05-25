import type { BookItem } from '../../lib/books/types';
import { getBookDetailHref } from '../../lib/books/routes';
import { withBase } from '../../lib/site';
import BookCover from './BookCover';

type BookshelfCardProps = {
  book: BookItem;
  compact?: boolean;
};

export default function BookshelfCard({ book, compact = false }: BookshelfCardProps) {
  const className = ['showcase-card', compact ? 'showcase-card--compact' : ''].filter(Boolean).join(' ');

  return (
    <a className={className} href={withBase(getBookDetailHref(book))}>
      <BookCover title={book.title} cover={book.cover} />
      <div>
        <span>书架 / {book.statusLabel}</span>
        <strong>{book.title}</strong>
        <small>{book.author}</small>
        <p>{book.note}</p>
      </div>
    </a>
  );
}
