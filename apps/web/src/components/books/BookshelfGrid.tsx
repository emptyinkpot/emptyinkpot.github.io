import { BookOpen, FileText, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { BookItem } from '../../lib/books/types';
import { loadBooksIndex } from '../../lib/books/manifest';
import { listReaderMemory } from '../../lib/runtime/reader';
import { getBookDetailHref, getBookReaderHref } from '../../lib/books/routes';
import BookCover from './BookCover';

type Props = Record<string, never>;

type ProgressMap = Record<string, string>;
type ShelfMode = 'visual' | 'compact' | 'reading';

export default function BookshelfGrid({}: Props) {
  const [libraryBooks, setLibraryBooks] = useState<BookItem[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');
  const [mode, setMode] = useState<ShelfMode>('visual');
  const [progress, setProgress] = useState<ProgressMap>({});
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [syncStatus, setSyncStatus] = useState('正在同步 OpenList 书库...');

  useEffect(() => {
    setProgress({});
    setRecentIds([]);
    listReaderMemory(50)
      .then((items) => {
        const runtimeProgress: ProgressMap = {};
        items.forEach((item) => {
          if (item.objectType !== 'book') return;
          runtimeProgress[item.objectId] = formatProgressLabel(item);
        });
        setProgress(runtimeProgress);
        const runtimeRecentIds = items.filter((item) => item.objectType === 'book').map((item) => item.objectId);
        setRecentIds(runtimeRecentIds);
      })
      .catch(() => {
        setProgress({});
        setRecentIds([]);
      });
  }, [libraryBooks]);

  useEffect(() => {
    let cancelled = false;

    loadBooksIndex()
      .then((manifest) => {
        if (cancelled) return;
        setLibraryBooks(manifest.books);
        setSyncStatus(`books-index 已加载 ${manifest.books.length} 本`);
      })
      .catch((error: Error) => {
        if (cancelled) return;
        setLibraryBooks([]);
        setSyncStatus(`books-index 暂不可用：${error.message}`);
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
    .slice(0, 8) as BookItem[];

  const visibleShelves = useMemo(() => groupBooksIntoShelves(filtered), [filtered]);

  return (
    <section className={`bookshelf-app bookshelf-app--${mode}`} data-bookshelf-mode={mode}>
      <header className="bookshelf-topbar">
        <div>
          <p className="section-kicker">ReadingObject Shelf</p>
          <h1>我的书架</h1>
          <p>书籍在这里按 ReadingObject 投影：封面、作者、阅读状态和主题 shelf 是第一层，KnowledgeObject 关系留给搜索、图谱和首页混排。</p>
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
          <span>Visible</span>
          <strong>{filtered.length}</strong>
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

      <div className="bookshelf-mode-switch" aria-label="书架视图">
        {[
          ['visual', '封面书架'],
          ['reading', '继续阅读'],
          ['compact', '书脊视图']
        ].map(([id, label]) => (
          <button key={id} className={mode === id ? 'is-active' : ''} type="button" onClick={() => setMode(id as ShelfMode)}>
            {label}
          </button>
        ))}
      </div>

      {recentBooks.length ? (
        <section className="bookshelf-reading-lane" aria-label="继续阅读">
          <header>
            <span>Currently Reading</span>
            <strong>{recentBooks.length} active objects</strong>
          </header>
          <div className="bookshelf-reading-lane__rail">
            {recentBooks.map((book) => (
              <a className="bookshelf-reading-card" href={getBookReaderHref(book)} key={book.id}>
                <BookCover book={book} />
                <span>
                  <strong>{book.title}</strong>
                  <small>{progress[book.id] || '继续阅读'}</small>
                </span>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <div className="bookshelf-surface" data-bookshelf-surface>
        {visibleShelves.map((shelf) => (
          <section className="bookshelf-shelf" key={shelf.id} data-bookshelf-shelf={shelf.id}>
            <header className="bookshelf-shelf__head">
              <div>
                <span>{shelf.eyebrow}</span>
                <h2>{shelf.title}</h2>
              </div>
              <small>{shelf.books.length} books</small>
            </header>
            <div className="bookshelf-grid">
              {shelf.books.map((book) => renderBookTile(book, progress, mode))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

function renderBookTile(book: BookItem, progress: ProgressMap, mode: ShelfMode) {
  return (
    <article className={`book-tile book-tile--${mode}`} key={book.id} data-book-projection="shelf">
      <a className="book-cover-wrap" href={getBookDetailHref(book)} aria-label={`查看 ${book.title}`}>
        <BookCover book={book} />
      </a>
      <div className="book-tile__body">
        <a className="book-tile__title" href={getBookDetailHref(book)}>
          {book.title}
        </a>
        <span>{book.author}</span>
        <small>{progress[book.id] || book.statusLabel || '未开始'}</small>
        <em>{[book.category, book.sourceType.toUpperCase()].filter(Boolean).join(' / ')}</em>
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
  );
}

function groupBooksIntoShelves(books: BookItem[]) {
  const buckets = new Map<string, BookItem[]>();
  books.forEach((book) => {
    const key = book.category || '未分类';
    buckets.set(key, [...(buckets.get(key) || []), book]);
  });

  return [...buckets.entries()]
    .map(([title, shelfBooks]) => ({
      id: title.toLowerCase().replace(/\s+/g, '-'),
      title,
      eyebrow: title === '全部' ? 'Library Shelf' : 'Thematic Shelf',
      books: shelfBooks
    }))
    .sort((a, b) => b.books.length - a.books.length || a.title.localeCompare(b.title, 'zh-CN'));
}

function formatProgressLabel(item: { progress?: number; location?: unknown }) {
  if (typeof item.progress === 'number' && item.progress > 0) {
    return `已读 ${Math.round(item.progress * 100)}%`;
  }
  if (typeof item.location === 'object' && item.location && 'page' in item.location) {
    return `第 ${Number((item.location as { page?: number }).page || 1)} 页`;
  }
  if (item.location) return '继续阅读';
  return '继续阅读';
}
