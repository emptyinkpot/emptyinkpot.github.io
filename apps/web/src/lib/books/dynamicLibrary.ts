import type { BookItem, BookSourceType } from './types';

const sourceTag = 'OpenList 原始库';
const extensionPattern = /\.(epub|pdf|mobi)$/i;

export function isSupportedBookFile(name: string) {
  return extensionPattern.test(name);
}

export function normalizeOpenListBookFile(file: {
  name: string;
  path?: string;
  size?: number;
  modified?: string;
  thumb?: string;
  isDir?: boolean;
  is_dir?: boolean;
}): BookItem | null {
  if (file.isDir || file.is_dir || !isSupportedBookFile(file.name)) return null;

  const sourceType = getSourceType(file.name);
  const parsed = parseBookFilename(file.name);
  const category = inferCategory(parsed.title);

  return {
    id: stableBookId(file.path || file.name),
    title: parsed.title,
    author: parsed.author || 'OpenList 原始书库',
    status: 'planned',
    statusLabel: '想读',
    note:
      sourceType === 'external'
        ? 'OpenList 原始书库中的 MOBI 文件；当前站内 reader 暂不接管 MOBI。'
        : `OpenList 原始书库中的 ${sourceType.toUpperCase()} 文件。`,
    category,
    tags: [category, sourceType.toUpperCase(), sourceTag],
    sourceType,
    cover: file.thumb || '',
    openlistPath: file.path,
    modified: file.modified,
    size: file.size,
    description: `${parsed.title} 来自 OpenList 原始书籍资料库。`
  };
}

export function mergeBooks(staticBooks: BookItem[], dynamicBooks: BookItem[]) {
  const byPath = new Map(staticBooks.map((book) => [book.openlistPath, book]));
  const merged = dynamicBooks.map((dynamicBook) => {
    const staticBook = byPath.get(dynamicBook.openlistPath);
    return staticBook ? { ...dynamicBook, ...staticBook, cover: staticBook.cover || dynamicBook.cover } : dynamicBook;
  });

  const dynamicPaths = new Set(merged.map((book) => book.openlistPath));
  staticBooks.forEach((book) => {
    if (!dynamicPaths.has(book.openlistPath)) merged.push(book);
  });

  return merged.sort((a, b) => {
    const left = Date.parse(a.modified || '') || 0;
    const right = Date.parse(b.modified || '') || 0;
    return right - left || a.title.localeCompare(b.title, 'zh-Hans-CN');
  });
}

function getSourceType(name: string): BookSourceType {
  const lower = name.toLowerCase();
  if (lower.endsWith('.epub')) return 'epub';
  if (lower.endsWith('.pdf')) return 'pdf';
  return 'external';
}

function parseBookFilename(name: string) {
  const withoutExtension = name.replace(extensionPattern, '').replace(/\.pdf$/i, '').trim();
  const cleaned = withoutExtension
    .replace(/\s*\(z-library\.sk,\s*1lib\.sk,\s*z-lib\.sk\)\s*/gi, '')
    .replace(/\s*\(\d+\)\s*$/g, '')
    .trim();

  const authorMatch = cleaned.match(/^(.*?)\s*[（(]([^()（）]+?)[）)]$/);
  if (!authorMatch) {
    return { title: cleaned, author: '' };
  }

  return {
    title: normalizeTitle(authorMatch[1]),
    author: normalizeAuthor(authorMatch[2])
  };
}

function normalizeTitle(value: string) {
  return value.replace(/\s*=\s*.+$/g, '').replace(/\s+/g, ' ').trim();
}

function normalizeAuthor(value: string) {
  return value
    .replace(/\s*\(.*?\)\s*/g, '')
    .replace(/\s*(著|作者|编|编辑|译|译编)\s*/g, '')
    .replace(/ etc\.?/gi, '')
    .replace(/[,，、]\s*/g, ' / ')
    .replace(/\s+/g, ' ')
    .trim();
}

function inferCategory(title: string) {
  if (/设计|网格|平面/.test(title)) return '设计';
  if (/朝鲜|越南|战争|世界史|史/.test(title)) return '历史';
  if (/资本论|马克思|政治经济/.test(title)) return '思想';
  if (/三体|围城|小说/.test(title)) return '文学';
  return '资料';
}

function stableBookId(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  const basename = value
    .split('/')
    .pop()
    ?.replace(extensionPattern, '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 36);

  return `openlist-${basename || 'book'}-${(hash >>> 0).toString(36)}`;
}
