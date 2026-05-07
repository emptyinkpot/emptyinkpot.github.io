import { BookOpen, FileText, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { BookItem } from '../../lib/books/types';
import { BOOK_RECENT_STORAGE_KEY, getBookProgressKey } from '../../lib/books/storage';

type Props = {
  books: BookItem[];
};

type ProgressMap = Record<string, string>;

export default function BookshelfGrid({ books }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');
  const [progress, setProgress] = useState<ProgressMap>({});
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    const nextProgress: ProgressMap = {};
    books.forEach((book) => {
      nextProgress[book.id] = readProgressLabel(book.id);
    });
    setProgress(nextProgress);
    setRecentIds(readRecentIds());
  }, [books]);

  const categories = useMemo(() => ['全部', ...Array.from(new Set(books.map((book) => book.category)))], [books]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return books.filter((book) => {
      const matchesCategory = category === '全部' || book.category === category;
      const content = [book.title, book.author, book.category, book.statusLabel, ...book.tags].join(' ').toLowerCase();
      return matchesCategory && (!needle || content.includes(needle));
    });
  }, [books, category, query]);

  const recentBooks = recentIds
    .map((id) => books.find((book) => book.id === id))
    .filter(Boolean)
    .slice(0, 3) as BookItem[];

  return (
    <section className="bookshelf-app">
      <header className="bookshelf-topbar">
        <div>
          <p className="section-kicker">Private Bookshelf</p>
          <h1>我的书架</h1>
          <p>书籍作为 BookObject 进入阅读空间；文件真源在 OpenList/WebDAV，阅读记忆保存在当前浏览器。</p>
        </div>
        <label className="bookshelf-search">
          <Search aria-hidden="true" size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索书名、作者、标签" />
        </label>
      </header>

      <section className="bookshelf-overview" aria-label="书架状态">
        <div>
          <span>Books</span>
          <strong>{books.length}</strong>
        </div>
        <div>
          <span>Reading</span>
          <strong>{books.filter((book) => book.status === 'reading').length}</strong>
        </div>
        <div>
          <span>OpenList</span>
          <strong>{books.filter((book) => book.openlistPath).length}</strong>
        </div>
        <div>
          <span>Recent</span>
          <strong>{recentBooks.length}</strong>
        </div>
      </section>

      <nav className="bookshelf-tabs" aria-label="书架分类">
        {categories.map((item) => (
          <button key={item} className={item === category ? 'is-active' : ''} type="button" onClick={() => setCategory(item)}>
            {item}
          </button>
        ))}
      </nav>

      {recentBooks.length ? (
        <section className="bookshelf-recent">
          <span>最近阅读</span>
          <div>
            {recentBooks.map((book) => (
              <a href={`/reader/${book.id}/`} key={book.id}>
                {book.title}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <div className="bookshelf-grid">
        {filtered.map((book) => (
          <article className="book-tile" key={book.id}>
            <a className="book-cover-wrap" href={`/books/${book.id}/`} aria-label={`查看 ${book.title}`}>
              {book.cover ? (
                <img src={book.cover} alt={`${book.title} 封面`} />
              ) : (
                <span className="book-cover-fallback">
                  <i>{book.category}</i>
                  <strong>{book.title}</strong>
                  <small>{book.author}</small>
                </span>
              )}
            </a>
            <div className="book-tile__body">
              <a className="book-tile__title" href={`/books/${book.id}/`}>
                {book.title}
              </a>
              <span>{book.author}</span>
              <small>{progress[book.id] || '未开始'}</small>
              <div className="book-tile__actions">
                <a href={`/reader/${book.id}/`}>
                  <BookOpen aria-hidden="true" size={14} />
                  阅读
                </a>
                <a href={`/books/${book.id}/`}>
                  <FileText aria-hidden="true" size={14} />
                  详情
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function readProgressLabel(bookId: string) {
  if (typeof window === 'undefined') return '未开始';

  try {
    const raw = localStorage.getItem(getBookProgressKey(bookId));
    if (!raw) return '未开始';
    const progress = JSON.parse(raw);
    if (typeof progress.percent === 'number' && progress.percent > 0) {
      return `已读 ${Math.round(progress.percent * 100)}%`;
    }
    if (progress.page) return `第 ${progress.page} 页`;
    if (progress.location) return '继续阅读';
  } catch {
    return '继续阅读';
  }

  return '继续阅读';
}

function readRecentIds() {
  if (typeof window === 'undefined') return [];

  try {
    return JSON.parse(localStorage.getItem(BOOK_RECENT_STORAGE_KEY) || '[]') as string[];
  } catch {
    return [];
  }
}
