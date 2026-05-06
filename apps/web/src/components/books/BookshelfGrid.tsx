import { BookOpen, FileText, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { BookItem } from '../../lib/books/types';
import { listOpenListFiles } from '../../lib/books/openlist';
import { BOOK_RECENT_STORAGE_KEY, getBookProgressKey, loadBookSettings } from '../../lib/books/storage';
import { mergeBooks, normalizeOpenListBookFile } from '../../lib/books/dynamicLibrary';
import BookCover from './BookCover';

type Props = {
  books: BookItem[];
};

type ProgressMap = Record<string, string>;

export default function BookshelfGrid({ books }: Props) {
  const [libraryBooks, setLibraryBooks] = useState(books);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');
  const [progress, setProgress] = useState<ProgressMap>({});
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [syncStatus, setSyncStatus] = useState('正在同步 OpenList 书库...');

  useEffect(() => {
    const nextProgress: ProgressMap = {};
    libraryBooks.forEach((book) => {
      nextProgress[book.id] = readProgressLabel(book.id);
    });
    setProgress(nextProgress);
    setRecentIds(readRecentIds());
  }, [libraryBooks]);

  useEffect(() => {
    const settings = loadBookSettings();
    let cancelled = false;

    listOpenListFiles(settings.openlistBaseUrl, settings.openlistBooksPath)
      .then((files) => {
        if (cancelled) return;
        const dynamicBooks = files.map(normalizeOpenListBookFile).filter(Boolean) as BookItem[];
        setLibraryBooks(mergeBooks(books, dynamicBooks));
        setSyncStatus(`已同步 ${dynamicBooks.length} 本 OpenList 书籍`);
      })
      .catch((error: Error) => {
        if (cancelled) return;
        setLibraryBooks(books);
        setSyncStatus(`OpenList 同步失败：${error.message}`);
      });

    return () => {
      cancelled = true;
    };
  }, [books]);

  const categories = useMemo(() => ['全部', ...Array.from(new Set(libraryBooks.map((book) => book.category)))], [libraryBooks]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return libraryBooks.filter((book) => {
      const matchesCategory = category === '全部' || book.category === category;
      const content = [book.title, book.author, book.category, book.statusLabel, ...book.tags].join(' ').toLowerCase();
      return matchesCategory && (!needle || content.includes(needle));
    });
  }, [libraryBooks, category, query]);

  const recentBooks = recentIds
    .map((id) => libraryBooks.find((book) => book.id === id))
    .filter((book) => book?.sourceType !== 'external')
    .filter(Boolean)
    .slice(0, 3) as BookItem[];

  return (
    <section className="bookshelf-app">
      <header className="bookshelf-topbar">
        <div>
          <p className="section-kicker">Private Bookshelf</p>
          <h1>我的书架</h1>
          <p>书架会实时同步 OpenList 原始书库；PDF/EPUB 尝试自动识别封面，阅读进度保存在当前浏览器。</p>
          <small className="bookshelf-sync-status">{syncStatus}</small>
        </div>
        <label className="bookshelf-search">
          <Search aria-hidden="true" size={16} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索书名、作者、标签" />
        </label>
      </header>

      <section className="bookshelf-overview" aria-label="书架状态">
        <div>
          <span>Books</span>
          <strong>{libraryBooks.length}</strong>
        </div>
        <div>
          <span>Reading</span>
          <strong>{libraryBooks.filter((book) => book.status === 'reading').length}</strong>
        </div>
        <div>
          <span>OpenList</span>
          <strong>{libraryBooks.filter((book) => book.openlistPath).length}</strong>
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
            <a className="book-cover-wrap" href={getBookDetailHref(book)} aria-label={`查看 ${book.title}`}>
              <BookCover book={book} />
            </a>
            <div className="book-tile__body">
              <a className="book-tile__title" href={getBookDetailHref(book)}>
                {book.title}
              </a>
              <span>{book.author}</span>
              <small>{progress[book.id] || '未开始'}</small>
              <div className="book-tile__actions">
                {book.sourceType === 'external' ? (
                  <a href={getBookDetailHref(book)}>
                    <BookOpen aria-hidden="true" size={14} />
                    源文件
                  </a>
                ) : (
                  <a href={getBookReaderHref(book)}>
                    <BookOpen aria-hidden="true" size={14} />
                    阅读
                  </a>
                )}
                <a href={getBookDetailHref(book)}>
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

function isRuntimeBook(book: BookItem) {
  return book.id.startsWith('openlist-');
}

function getBookDetailHref(book: BookItem) {
  if (!isRuntimeBook(book)) return `/books/${book.id}/`;
  return `/books/openlist/?path=${encodeURIComponent(book.openlistPath || '')}`;
}

function getBookReaderHref(book: BookItem) {
  if (!isRuntimeBook(book)) return `/reader/${book.id}/`;
  return `/reader/openlist/?path=${encodeURIComponent(book.openlistPath || '')}`;
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
