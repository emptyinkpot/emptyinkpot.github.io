import { ArrowLeft, ExternalLink, Moon, Sun, Sunrise } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { BookItem } from '../../lib/books/types';
import { buildCachedBookCoverUrl, buildCachedBookRawUrl } from '../../lib/books/openlist';
import { loadBookSettings, READER_THEME_STORAGE_KEY, saveBookSettings, type BookReaderTheme } from '../../lib/books/storage';
import { getBookReaderHref } from '../../lib/books/routes';
import { saveReaderMemory } from '../../lib/runtime/reader';
import { loadBookRuntime, type ReaderRuntimeComponent } from './readerRuntime';

type Props = {
  book: BookItem;
  mode?: 'page' | 'drawer';
};

const themeItems: Array<{ id: BookReaderTheme; label: string; Icon: typeof Sun }> = [
  { id: 'light', label: '白天', Icon: Sun },
  { id: 'sepia', label: '护眼', Icon: Sunrise },
  { id: 'dark', label: '夜间', Icon: Moon }
];

export default function BookReader({ book, mode = 'page' }: Props) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [RuntimeReader, setRuntimeReader] = useState<ReaderRuntimeComponent | null>(null);
  const [theme, setTheme] = useState<BookReaderTheme>('sepia');
  const settings = useMemo(() => loadBookSettings(), []);

  useEffect(() => {
    const savedTheme = (localStorage.getItem(READER_THEME_STORAGE_KEY) || settings.readerTheme) as BookReaderTheme;
    applyTheme(savedTheme);
    setTheme(savedTheme);
    saveReaderMemory({
      objectId: book.id,
      objectType: 'book',
      title: book.title,
      href: mode === 'drawer' ? `/#book:${book.id}` : getBookReaderHref(book)
    }).catch(() => {
      // Runtime API errors do not block opening the source file.
    });
  }, [book.id, settings.readerTheme]);

  useEffect(() => {
    const nextUrl = buildCachedBookRawUrl(book, settings);
    setError('');
    setUrl('');
    setRuntimeReader(null);

    if (!nextUrl) {
      setError('这本书尚未配置 OpenList 文件路径。');
      return;
    }

    if (book.sourceType === 'external') {
      setError('当前 reader 只接管 EPUB / PDF；这个条目请在详情页打开源文件。');
      return;
    }

    setUrl(nextUrl);
    loadBookRuntime(book.sourceType)
      .then((runtime) => {
        if (!runtime) {
          setError('当前 reader 只接管 EPUB / PDF；这个条目请在详情页打开源文件。');
          return;
        }
        setRuntimeReader(() => runtime);
      })
      .catch(() => setError('阅读器运行时加载失败。'));
  }, [book, settings]);

  const setReaderTheme = (next: BookReaderTheme) => {
    setTheme(next);
    applyTheme(next);
    saveBookSettings({ ...settings, readerTheme: next });
  };

  return (
    <main className={`book-reader-shell ${mode === 'drawer' ? 'book-reader-shell--drawer' : ''}`}>
      {mode === 'page' ? (
        <header className="book-reader-topbar">
          <a className="book-reader-back" href="/books/">
            <ArrowLeft aria-hidden="true" size={16} />
            书架
          </a>
          <div>
            <span>{book.author}</span>
            <strong>{book.title}</strong>
          </div>
          <nav aria-label="阅读主题">
            {themeItems.map(({ id, label, Icon }) => (
              <button key={id} className={theme === id ? 'is-active' : ''} type="button" onClick={() => setReaderTheme(id)} title={label}>
                <Icon aria-hidden="true" size={15} />
                <span>{label}</span>
              </button>
            ))}
            {url ? (
              <a href={url} target="_blank" rel="noreferrer">
                <ExternalLink aria-hidden="true" size={15} />
                源文件
              </a>
            ) : null}
          </nav>
        </header>
      ) : null}

      {error ? (
        <section className="book-reader-empty">
          <span>{book.sourceType.toUpperCase()}</span>
          <h1>{book.title}</h1>
          <p>{error}</p>
          <a href="/settings/">打开设置</a>
        </section>
      ) : !url || !RuntimeReader ? (
        mode === 'drawer' && book.sourceType === 'pdf' ? (
          <BookReaderInstantShell book={book} />
        ) : (
          <span className="book-reader-empty book-reader-empty--silent" aria-hidden="true" />
        )
      ) : (
        <RuntimeReader book={book} mode={mode} url={url} />
      )}
    </main>
  );
}

function BookReaderInstantShell({ book }: { book: BookItem }) {
  const settings = useMemo(() => loadBookSettings(), []);
  const coverUrl = useMemo(() => book.cover || buildCachedBookCoverUrl(book, settings), [book, settings]);

  if (!coverUrl) return <span className="book-reader-empty book-reader-empty--silent" aria-hidden="true" />;

  return (
    <section className="pdf-reader pdf-reader--drawer">
      <article className="pdf-reader__instant" aria-label={`${book.title} 阅读首屏`}>
        <img src={coverUrl} alt={`${book.title} 封面`} />
        <div>
          <span>{book.sourceType.toUpperCase()} ARCHIVE</span>
          <h2>{book.title}</h2>
          <p>{book.author}</p>
        </div>
      </article>
    </section>
  );
}

function applyTheme(theme: BookReaderTheme) {
  document.documentElement.dataset.readerTheme = theme;
  localStorage.setItem(READER_THEME_STORAGE_KEY, theme);
}
