import { ArrowLeft, ExternalLink, Moon, Sun, Sunrise } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { BookItem } from '../../lib/books/types';
import { getOpenListFile, resolveBookOpenListPath, resolveRawUrl } from '../../lib/books/openlist';
import {
  BOOK_RECENT_STORAGE_KEY,
  loadBookSettings,
  READER_THEME_STORAGE_KEY,
  saveBookSettings,
  type BookReaderTheme
} from '../../lib/books/storage';
import EpubReader from './EpubReader';
import PdfReader from './PdfReader';

type Props = {
  book: BookItem;
};

const themeItems: Array<{ id: BookReaderTheme; label: string; Icon: typeof Sun }> = [
  { id: 'light', label: '白天', Icon: Sun },
  { id: 'sepia', label: '护眼', Icon: Sunrise },
  { id: 'dark', label: '夜间', Icon: Moon }
];

export default function BookReader({ book }: Props) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [theme, setTheme] = useState<BookReaderTheme>('sepia');
  const settings = useMemo(() => loadBookSettings(), []);

  useEffect(() => {
    const savedTheme = (localStorage.getItem(READER_THEME_STORAGE_KEY) || settings.readerTheme) as BookReaderTheme;
    applyTheme(savedTheme);
    setTheme(savedTheme);
    rememberBook(book.id);
  }, [book.id, settings.readerTheme]);

  useEffect(() => {
    const path = resolveBookOpenListPath(book, settings);

    if (!path) {
      setError('这本书尚未配置 OpenList 文件路径。');
      return;
    }

    if (book.sourceType === 'external') {
      setError('当前 reader 只接管 EPUB / PDF；这个条目请在详情页打开源文件。');
      return;
    }

    getOpenListFile(settings.openlistBaseUrl, path)
      .then((file) => {
        if (!file.raw_url) {
          throw new Error('OpenList 没有返回 raw_url。');
        }
        setUrl(resolveRawUrl(file.raw_url, settings.openlistBaseUrl));
      })
      .catch((err: Error) => setError(err.message || '无法读取 OpenList 文件。'));
  }, [book, settings]);

  const setReaderTheme = (next: BookReaderTheme) => {
    setTheme(next);
    applyTheme(next);
    saveBookSettings({ ...settings, readerTheme: next });
  };

  return (
    <main className="book-reader-shell">
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

      {error ? (
        <section className="book-reader-empty">
          <span>{book.sourceType.toUpperCase()}</span>
          <h1>{book.title}</h1>
          <p>{error}</p>
          <a href="/settings/">打开设置</a>
        </section>
      ) : !url ? (
        <section className="book-reader-empty">
          <span>OpenList</span>
          <h1>{book.title}</h1>
          <p>正在从 OpenList 读取文件。</p>
        </section>
      ) : book.sourceType === 'epub' ? (
        <EpubReader book={book} url={url} />
      ) : (
        <PdfReader book={book} url={url} />
      )}
    </main>
  );
}

function applyTheme(theme: BookReaderTheme) {
  document.documentElement.dataset.readerTheme = theme;
  localStorage.setItem(READER_THEME_STORAGE_KEY, theme);
}

function rememberBook(bookId: string) {
  try {
    const current = JSON.parse(localStorage.getItem(BOOK_RECENT_STORAGE_KEY) || '[]') as string[];
    localStorage.setItem(BOOK_RECENT_STORAGE_KEY, JSON.stringify([bookId, ...current.filter((id) => id !== bookId)].slice(0, 8)));
  } catch {
    localStorage.setItem(BOOK_RECENT_STORAGE_KEY, JSON.stringify([bookId]));
  }
}
