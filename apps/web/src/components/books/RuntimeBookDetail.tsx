import { BookOpen, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { BookItem } from '../../lib/books/types';
import { getOpenListFile } from '../../lib/books/openlist';
import { normalizeOpenListBookFile } from '../../lib/books/dynamicLibrary';
import BookCover from './BookCover';

export default function RuntimeBookDetail() {
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
        if (!nextBook) throw new Error('这个文件不是支持展示的书籍格式。');
        setBook(nextBook);
      })
      .catch((err: Error) => setError(err.message || '无法读取 OpenList 文件。'));
  }, []);

  if (error) {
    return (
      <main className="book-detail-page">
        <section className="book-reader-empty">
          <span>OpenList</span>
          <h1>无法打开书籍</h1>
          <p>{error}</p>
          <a href="/books/">返回书架</a>
        </section>
      </main>
    );
  }

  if (!book) {
    return (
      <main className="book-detail-page">
        <section className="book-reader-empty">
          <span>OpenList</span>
          <h1>正在读取书籍资料</h1>
          <p>正在从 OpenList 同步文件信息。</p>
        </section>
      </main>
    );
  }

  return (
    <main className="book-detail-page">
      <nav className="book-detail-breadcrumb" aria-label="书架路径">
        <a href="/books/">书架</a>
        <span>{book.category}</span>
      </nav>

      <section className="book-detail-hero">
        <div className="book-detail-cover">
          <BookCover book={book} />
        </div>

        <div className="book-detail-copy">
          <p className="section-kicker">Bookshelf / {book.statusLabel}</p>
          <h1>{book.title}</h1>
          <p>{book.description ?? book.note}</p>
          <dl>
            <div>
              <dt>作者</dt>
              <dd>{book.author}</dd>
            </div>
            <div>
              <dt>分类</dt>
              <dd>{book.category}</dd>
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
          <div className="book-detail-tags">
            {book.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="book-detail-actions">
            {book.sourceType === 'external' ? (
              <a href="/openlist/">
                <ExternalLink aria-hidden="true" size={15} />
                OpenList 源目录
              </a>
            ) : (
              <a href={`/reader/openlist/?path=${encodeURIComponent(book.openlistPath || '')}`}>
                <BookOpen aria-hidden="true" size={15} />
                进入阅读器
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
