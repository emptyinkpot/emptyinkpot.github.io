import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const metadataPath = path.join(root, 'public-data', 'books', 'books.metadata.json');
const outputPath = path.join(root, 'public-data', 'books', 'books-index.json');
const webPublicOutputPath = path.join(root, 'apps', 'web', 'public', 'public-data', 'books', 'books-index.json');
const webPublicMetadataPath = path.join(root, 'apps', 'web', 'public', 'public-data', 'books', 'books.metadata.json');
const canonicalPath = '/Obsidian/docs/books/original';
const openListIndexUrl = process.env.MYBLOG_OPENLIST_INDEX_URL || 'https://blog.tengokukk.com/api/openlist/index';

const sourceTag = 'OpenList 原始库';
const extensionPattern = /\.(epub|pdf|mobi)$/i;

async function main() {
  const metadata = await readJson(metadataPath, { entries: [] });
  const metadataMap = buildMetadataMap(metadata.entries || []);
  const index = await loadOpenListIndex();
  if (!index) return;

  const books = index.files
    .filter((file) => !file.isDir && String(file.path || '').startsWith(`${canonicalPath}/`) && extensionPattern.test(file.name || ''))
    .map((file) => normalizeIndexRecord(file, metadataMap))
    .filter(Boolean)
    .sort((a, b) => {
      const left = Date.parse(a.modified || '') || 0;
      const right = Date.parse(b.modified || '') || 0;
      return right - left || a.title.localeCompare(b.title, 'zh-Hans-CN');
    });

  const manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: {
      type: 'openlist-index',
      canonicalPath,
      indexUrl: openListIndexUrl,
      metadataPath: 'public-data/books/books.metadata.json',
      metadataAuthority: 'sidecar-json',
      liveListForbidden: true
    },
    stats: {
      total: index.files.length,
      supported: books.length,
      curated: books.filter((book) => book.metadataSource === 'books.metadata.json').length,
      bySourceType: books.reduce((accumulator, book) => {
        accumulator[book.sourceType] = (accumulator[book.sourceType] || 0) + 1;
        return accumulator;
      }, {})
    },
    books
  };

  await writeJson(outputPath, manifest);
  await writeJson(webPublicOutputPath, manifest);
  await writeJson(webPublicMetadataPath, metadata);
  console.log(`Wrote ${books.length} books to ${path.relative(root, outputPath)}`);
  console.log(`Curated metadata matched ${manifest.stats.curated} books from ${path.relative(root, metadataPath)}`);
  console.log(`Mirrored books index to ${path.relative(root, webPublicOutputPath)}`);
}

async function loadOpenListIndex() {
  try {
    const response = await fetch(openListIndexUrl, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`OpenList index request failed: ${response.status}`);
    }

    const index = await response.json();
    if (!index.ok || !Array.isArray(index.files)) {
      throw new Error('OpenList index response is not a valid files index');
    }

    return index;
  } catch (error) {
    const cached = await readJson(outputPath, null);
    if (cached?.books?.length) {
      await writeJson(webPublicOutputPath, cached);
      console.warn(
        `OpenList index unavailable, reused cached books-index with ${cached.books.length} books: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      return null;
    }
    throw error;
  }
}

function buildMetadataMap(entries) {
  const byPath = new Map();
  for (const entry of entries) {
    const paths = [entry.openlistPath, ...(entry.pathAliases || [])].filter(Boolean);
    for (const itemPath of paths) {
      byPath.set(normalizeOpenListPath(itemPath), entry);
    }
  }
  return byPath;
}

function normalizeIndexRecord(file, metadataMap) {
  const name = String(file.name || '').trim();
  const openlistPath = normalizeOpenListPath(file.path || '');
  if (!name || !openlistPath || !extensionPattern.test(name)) return null;

  const sourceType = getSourceType(name);
  const parsed = parseBookFilename(name);
  const metadata = metadataMap.get(openlistPath);
  const category = metadata?.category || '未分类';
  const baseTags = [sourceType.toUpperCase(), sourceTag];
  const metadataTags = metadata?.tags || [];

  return {
    id: stableBookId(openlistPath),
    metadataId: metadata?.metadataId || stableBookId(openlistPath).replace(/^openlist-/, 'book-'),
    metadataSource: metadata ? 'books.metadata.json' : 'inferred',
    title: metadata?.title || parsed.title,
    author: metadata?.author || parsed.author || 'OpenList 原始书库',
    status: metadata?.status || 'planned',
    statusLabel: metadata?.statusLabel || '想读',
    note:
      metadata?.note ||
      (sourceType === 'external'
        ? 'OpenList 原始书库中的 MOBI 文件；当前站内 reader 暂不接管 MOBI。'
        : `OpenList 原始书库中的 ${sourceType.toUpperCase()} 文件。`),
    category,
    tags: Array.from(new Set([...metadataTags, category, ...baseTags].filter(Boolean))),
    sourceType,
    cover: metadata?.cover || file.thumb || '',
    openlistPath,
    modified: file.modified,
    size: file.size,
    description: metadata?.description || `${metadata?.title || parsed.title} 来自 OpenList 原始书籍资料库。`
  };
}

function getSourceType(name) {
  const lower = name.toLowerCase();
  if (lower.endsWith('.epub')) return 'epub';
  if (lower.endsWith('.pdf')) return 'pdf';
  return 'external';
}

function parseBookFilename(name) {
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

function normalizeTitle(value) {
  return value.replace(/\s*=\s*.+$/g, '').replace(/\s+/g, ' ').trim();
}

function normalizeAuthor(value) {
  return value
    .replace(/\s*\(.*?\)\s*/g, '')
    .replace(/\s*(著|作者|编|编辑|译|译编)\s*/g, '')
    .replace(/ etc\.?/gi, '')
    .replace(/[,，、]\s*/g, ' / ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stableBookId(value) {
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

function normalizeOpenListPath(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  return raw.startsWith('/') ? raw.replace(/\/+$/g, '') || '/' : `/${raw.replace(/\/+$/g, '')}`;
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(`${filePath}.tmp`, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await fs.rename(`${filePath}.tmp`, filePath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
