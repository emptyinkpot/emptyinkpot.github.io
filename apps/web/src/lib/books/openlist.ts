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
