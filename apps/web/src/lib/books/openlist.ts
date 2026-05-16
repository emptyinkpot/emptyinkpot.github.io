import type { BookItem } from './types';
import type { BookSettings } from './storage';

export type OpenListFileInfo = {
  name: string;
  size: number;
  is_dir: boolean;
  modified: string;
  raw_url?: string;
  thumb?: string;
  type?: number;
};

export async function getOpenListFile(baseUrl: string, path: string) {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
  const proxied = !normalizedBaseUrl || normalizedBaseUrl === '/api/openlist' || normalizedBaseUrl.startsWith('/api/openlist');
  if (proxied) {
    const response = await fetch('/api/openlist/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ path })
    });

    if (!response.ok) {
      throw new Error(`OpenList 代理请求失败：${response.status}`);
    }

    const json = await response.json();
    if (!json.ok) {
      throw new Error(json.error || 'OpenList 代理返回了错误。');
    }

    return json.file as OpenListFileInfo;
  }

  if (!baseUrl) {
    throw new Error('尚未配置 OpenList Base URL。');
  }

  const response = await fetch(`${normalizedBaseUrl}/api/fs/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      path,
      password: '',
      page: 1,
      per_page: 0,
      refresh: false
    })
  });

  if (!response.ok) {
    throw new Error(`OpenList 请求失败：${response.status}`);
  }

  const json = await response.json();

  if (json.code !== 200) {
    throw new Error(json.message || 'OpenList 返回了错误。');
  }

  return json.data as OpenListFileInfo;
}

export async function listOpenListFiles(baseUrl: string, path: string) {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
  const proxied = !normalizedBaseUrl || normalizedBaseUrl === '/api/openlist' || normalizedBaseUrl.startsWith('/api/openlist');
  if (proxied) {
    const indexedFiles = await listIndexedOpenListFiles(path).catch(() => null);
    if (indexedFiles?.length) return indexedFiles;

    const response = await fetch('/api/openlist/list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ path, perPage: 200 })
    });

    if (!response.ok) {
      throw new Error(`OpenList 目录请求失败：${response.status}`);
    }

    const json = await response.json();
    if (!json.ok) {
      throw new Error(json.error || 'OpenList 目录代理返回了错误。');
    }

    return json.items as OpenListFileInfo[];
  }

  if (!baseUrl) {
    throw new Error('尚未配置 OpenList Base URL。');
  }

  const response = await fetch(`${normalizedBaseUrl}/api/fs/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      path,
      password: '',
      page: 1,
      per_page: 200,
      refresh: false
    })
  });

  if (!response.ok) {
    throw new Error(`OpenList 目录请求失败：${response.status}`);
  }

  const json = await response.json();

  if (json.code !== 200) {
    throw new Error(json.message || 'OpenList 返回了目录错误。');
  }

  return (json.data?.content || []).map((item: OpenListFileInfo) => ({
    ...item,
    path: `${path.replace(/\/$/, '')}/${String(item.name || '').replace(/^\/+/, '')}`
  })) as OpenListFileInfo[];
}

async function listIndexedOpenListFiles(path: string) {
  const response = await fetch('/api/openlist/index', { cache: 'no-store' });
  if (!response.ok) return [];

  const json = await response.json();
  if (!json.ok || !Array.isArray(json.files)) return [];

  const root = path.replace(/\/$/, '');
  return json.files
    .filter((file: { path?: string; isDir?: boolean }) => file.path?.startsWith(`${root}/`) && !file.isDir)
    .map(
      (file: {
        name: string;
        path: string;
        size: number;
        modified: string;
        thumb?: string;
        type?: number;
      }) =>
        ({
          name: file.name,
          path: file.path,
          size: file.size,
          modified: file.modified,
          thumb: file.thumb || '',
          type: file.type,
          is_dir: false
        }) as OpenListFileInfo
    );
}

export function resolveBookOpenListPath(book: BookItem, settings: BookSettings) {
  if (!book.openlistPath) return '';
  if (book.openlistPath.startsWith('/')) return book.openlistPath;
  return `${settings.openlistBooksPath.replace(/\/$/, '')}/${book.openlistPath.replace(/^\//, '')}`;
}

export function resolveRawUrl(rawUrl: string, baseUrl: string) {
  if (!rawUrl) return '';
  if (/^https?:\/\//i.test(rawUrl)) return rawUrl;
  if (rawUrl.startsWith('/')) return rawUrl;
  return new URL(rawUrl, `${baseUrl.replace(/\/$/, '')}/`).toString();
}

export function buildCachedBookRawUrl(book: BookItem, settings: BookSettings) {
  const path = resolveBookOpenListPath(book, settings);
  if ((!book.id && !path) || book.sourceType === 'external') return '';

  const params = new URLSearchParams({ bookId: book.id });
  if (path) params.set('path', path);
  if (book.modified) params.set('modified', book.modified);
  if (book.size) params.set('size', String(book.size));
  return `/api/openlist/raw?${params.toString()}`;
}

export function buildCachedBookCoverUrl(book: BookItem, settings: BookSettings) {
  const path = resolveBookOpenListPath(book, settings);
  if ((!book.id && !path) || book.sourceType === 'external') return '';

  const params = new URLSearchParams({ bookId: book.id });
  if (path) params.set('path', path);
  if (book.modified) params.set('modified', book.modified);
  if (book.size) params.set('size', String(book.size));
  return `/api/openlist/cover?${params.toString()}`;
}

export function buildCachedBookPageUrl(book: BookItem, settings: BookSettings, page: number) {
  const path = resolveBookOpenListPath(book, settings);
  if ((!book.id && !path) || book.sourceType !== 'pdf') return '';

  const params = new URLSearchParams({ bookId: book.id, page: String(Math.max(1, Math.round(page))) });
  if (path) params.set('path', path);
  if (book.modified) params.set('modified', book.modified);
  if (book.size) params.set('size', String(book.size));
  return `/api/openlist/page?${params.toString()}`;
}
