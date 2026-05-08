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

export type BookMetadataOverlay = {
  category?: string;
  tags?: string[];
  status?: BookItem['status'];
  statusLabel?: string;
  note?: string;
  description?: string;
  cover?: string;
};

export function buildCanonicalBooks(dynamicBooks: BookItem[], overlays: Record<string, BookMetadataOverlay> = {}) {
  return dynamicBooks.map((book) => applyBookMetadataOverlay(book, overlays[book.openlistPath || ''])).sort((a, b) => {
    const left = Date.parse(a.modified || '') || 0;
    const right = Date.parse(b.modified || '') || 0;
    return right - left || a.title.localeCompare(b.title, 'zh-Hans-CN');
  });
}

export function applyBookMetadataOverlay(book: BookItem, overlay?: BookMetadataOverlay): BookItem {
  if (!overlay) return book;

  const overlayTags = overlay.tags || [];
  const tags = Array.from(new Set([...(overlayTags.length ? overlayTags : book.tags), ...book.tags]));

  return {
    ...book,
    category: overlay.category || book.category,
    tags,
    status: overlay.status || book.status,
    statusLabel: overlay.statusLabel || book.statusLabel,
    note: overlay.note || book.note,
    description: overlay.description || book.description
  };
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
