import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const metadataPath = path.join(root, 'public-data', 'books', 'books.metadata.json');
const outputPath = path.join(root, 'public-data', 'books', 'books-index.json');
const webPublicOutputPath = path.join(root, 'apps', 'web', 'public', 'public-data', 'books', 'books-index.json');
const webPublicMetadataPath = path.join(root, 'apps', 'web', 'public', 'public-data', 'books', 'books.metadata.json');
const databaseGatewayUrl = (process.env.MYBLOG_DATABASE_GATEWAY_URL || process.env.DATABASE_GATEWAY_URL || '').replace(/\/+$/, '');
const databaseGatewayApiKey = process.env.MYBLOG_DATABASE_GATEWAY_API_KEY || process.env.DATABASE_GATEWAY_API_KEY || '';
const databaseGatewayTargetId = process.env.MYBLOG_BOOKS_OPENLIST_TARGET_ID || 'myblog-books-original';
const legacyOpenListIndexUrl = process.env.MYBLOG_OPENLIST_INDEX_URL || '';
const legacyCanonicalPath = '/Obsidian/docs/books/original';

const sourceTag = 'OpenList 原始库';
const extensionPattern = /\.(epub|pdf|mobi)$/i;

async function main() {
  const metadata = await readJson(metadataPath, { entries: [] });
  const metadataMap = buildMetadataMap(metadata.entries || []);
  const index = await loadOpenListIndex();
  if (!index) return;
  const canonicalPath = normalizeOpenListPath(index.canonicalPath || legacyCanonicalPath);

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
      type: index.sourceType || 'database-gateway-openlist-target',
      canonicalPath,
      indexUrl: index.indexUrl,
      targetId: index.targetId,
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
    if (databaseGatewayUrl) {
      return await loadDataBaseGatewayOpenListTargetIndex();
    }

    if (legacyOpenListIndexUrl) {
      return await loadLegacyOpenListIndex();
    }

    throw new Error('MYBLOG_DATABASE_GATEWAY_URL is not configured.');
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

async function loadDataBaseGatewayOpenListTargetIndex() {
  const files = [];
  let page = 1;
  let total = 0;
  let targetRemoteDir = '';

  while (page < 1000) {
    const response = await fetch(`${databaseGatewayUrl}/openlist/targets/${encodeURIComponent(databaseGatewayTargetId)}/list`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(databaseGatewayApiKey ? { 'X-DataBase-Api-Key': databaseGatewayApiKey } : {})
      },
      body: JSON.stringify({
        page,
        per_page: 200,
        refresh: false
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload?.ok === false) {
      throw new Error(payload?.message || payload?.error || `DataBase Gateway OpenList target request failed: ${response.status}`);
    }

    const content = Array.isArray(payload.content) ? payload.content : [];
    targetRemoteDir = normalizeOpenListPath(payload.target?.remoteDir || targetRemoteDir);
    if (!targetRemoteDir) {
      throw new Error(`DataBase Gateway OpenList target has no remoteDir: ${databaseGatewayTargetId}`);
    }
    total = Number(payload.total || content.length || total);
    for (const item of content) {
      files.push(toOpenListIndexFile(targetRemoteDir, item));
    }

    if (!content.length || content.length < 200 || files.length >= total) break;
    page += 1;
  }

  if (!files.length) {
    throw new Error(`DataBase Gateway OpenList target returned 0 files: ${databaseGatewayTargetId}`);
  }

  return {
    ok: true,
    sourceType: 'database-gateway-openlist-target',
    indexUrl: `/openlist/targets/${databaseGatewayTargetId}/list`,
    targetId: databaseGatewayTargetId,
    canonicalPath: targetRemoteDir,
    files
  };
}

async function loadLegacyOpenListIndex() {
  const response = await fetch(legacyOpenListIndexUrl, {
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

  if (!index.files.length) {
    throw new Error(`OpenList index returned 0 files: ${legacyOpenListIndexUrl}`);
  }

  return {
    ...index,
    sourceType: 'legacy-openlist-index',
    indexUrl: legacyOpenListIndexUrl,
    canonicalPath: normalizeOpenListPath(index.canonicalPath || index.root || legacyCanonicalPath)
  };
}

function toOpenListIndexFile(parentPath, item) {
  const name = String(item.name || '').trim();
  const itemPath = normalizeOpenListPath(`${normalizeOpenListPath(parentPath).replace(/\/+$/g, '')}/${name}`);
  return {
    id: item.id || stableBookId(itemPath),
    source: 'database-gateway-openlist-target',
    path: itemPath,
    parentPath: normalizeOpenListPath(parentPath),
    root: normalizeOpenListPath(parentPath),
    name,
    ext: path.extname(name).toLowerCase(),
    kind: item.is_dir ? 'folder' : 'book',
    isDir: Boolean(item.is_dir),
    size: Number(item.size || 0),
    modified: item.modified || '',
    type: item.type,
    thumb: item.thumb || ''
  };
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
    id: file.id || stableBookId(openlistPath),
    metadataId: metadata?.metadataId || (file.id || stableBookId(openlistPath)).replace(/^openlist-/, 'book-'),
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
