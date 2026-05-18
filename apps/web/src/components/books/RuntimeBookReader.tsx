import { useEffect, useState } from 'react';
import type { BookItem } from '../../lib/books/types';
import { getOpenListFile } from '../../lib/books/openlist';
import { normalizeOpenListBookFile } from '../../lib/books/dynamicLibrary';
import BookReader from './BookReader';

export default function RuntimeBookReader() {
  const [book, setBook] = useState<BookItem | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const path = new URL(window.location.href).searchParams.get('path') || '';
    if (!path) {
      setError('缺少 OpenList 文件路径。');
      return;
    }

    getOpenListFile('/api/openlist', path)
      .then((file) => {
        const nextBook = normalizeOpenListBookFile({ ...file, path });
        if (!nextBook) throw new Error('这个文件不是支持阅读的书籍格式。');
        setBook(nextBook);
      })
      .catch((err: Error) => setError(err.message || '无法读取 OpenList 文件。'));
  }, []);

  if (error) {
    return (
      <main className="book-reader-shell">
        <section className="book-reader-empty">
          <span>OpenList</span>
          <h1>无法打开阅读器</h1>
          <p>{error}</p>
          <a href="/books/">返回书架</a>
        </section>
      </main>
    );
  }

  if (!book) {
    return (
      <main className="book-reader-shell">
        <section className="book-reader-empty">
          <span>OpenList</span>
          <h1>正在读取书籍</h1>
          <p>正在从 OpenList 同步文件信息。</p>
        </section>
      </main>
    );
  }

  return <BookReader book={book} />;
}
