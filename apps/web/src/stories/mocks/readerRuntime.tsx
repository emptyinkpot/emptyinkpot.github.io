import type { BookItem } from '../../lib/books/types';

export type ReaderRuntimeComponent = typeof StorybookReaderRuntime;

export function preloadBookRuntime() {
  return Promise.resolve(StorybookReaderRuntime);
}

export function preloadAllBookRuntimes() {
  return Promise.allSettled([Promise.resolve(StorybookReaderRuntime)]);
}

export function loadBookRuntime() {
  return Promise.resolve(StorybookReaderRuntime);
}

function StorybookReaderRuntime({
  book,
  mode = 'page',
  url
}: {
  book: BookItem;
  mode?: 'page' | 'drawer';
  url: string;
}) {
  return (
    <section className={`storybook-reader-runtime storybook-reader-runtime--${mode}`}>
      <span>{book.sourceType.toUpperCase()} Runtime</span>
      <h2>{book.title}</h2>
      <p>{book.author}</p>
      <code>{url}</code>
    </section>
  );
}
