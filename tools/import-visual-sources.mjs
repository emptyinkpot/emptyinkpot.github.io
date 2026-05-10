import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const sourcesPath = path.join(root, 'public-data', 'visual-sources', 'sources.json');
const manifestPath = path.join(root, 'public-data', 'visual-sources', 'visual-manifest.json');
const browserProfileDir = path.join(root, '.runtime', 'visual-import-browser-profile');

const fallbackPalette = {
  pinterest: {
    dominant: '#6b2d5c',
    colors: ['#6b2d5c', '#c9a227', '#f5f1e8', '#2f5d50', '#1f1b18']
  },
  pixiv: {
    dominant: '#2f5d50',
    colors: ['#2f5d50', '#e9b6c8', '#f5f1e8', '#6b2d5c', '#1f1b18']
  },
  local: {
    dominant: '#1f1b18',
    colors: ['#1f1b18', '#c9a227', '#f5f1e8', '#6b2d5c', '#9e2a2b']
  }
};

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/https?:\/\//g, '')
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function stableItemId(source, image, index) {
  const sourceKey = slugify(source.id || source.url || source.type);
  const stableKey = slugify(image.href || image.src || `${sourceKey}-${index + 1}`);
  return `${sourceKey}-${stableKey || index + 1}`.slice(0, 96);
}

function uniqueBy(items, keyFn) {
  const seen = new Set();
  const output = [];
  for (const item of items) {
    const key = keyFn(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    output.push(item);
  }
  return output;
}

function chunkByPattern(items, pattern) {
  const sizes = Array.isArray(pattern) && pattern.length ? pattern : [6, 4, 9, 12];
  const chunks = [];
  let cursor = 0;
  let patternIndex = 0;

  while (cursor < items.length) {
    const size = Math.max(1, Number(sizes[patternIndex % sizes.length]) || 6);
    chunks.push(items.slice(cursor, cursor + size));
    cursor += size;
    patternIndex += 1;
  }

  return chunks;
}

function normalizePreviewUrl(src) {
  if (!src) return '';
  const value = String(src);
  if (value.startsWith('data:') || value.startsWith('blob:')) return '';
  return value.replace(/&amp;/g, '&');
}

function isValidBookmarkImage(source, item) {
  const previewUrl = String(item.previewUrl || '');
  const href = String(item.href || '');

  if (source.type === 'pixiv') {
    if (!href.includes('/artworks/')) return false;
    if (previewUrl.includes('/images/404-')) return false;
    if (previewUrl.includes('source.pixiv.net/www/images/')) return false;
  }

  if (source.type === 'pinterest') {
    if (!href.includes('/pin/')) return false;
    if (!previewUrl.includes('pinimg.com')) return false;
  }

  return true;
}

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

async function scrapeSource(page, source) {
  await page.goto(source.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(2500);

  const limit = Number(source.limit) || 24;
  const accumulated = [];
  const seen = new Set();

  const collectVisibleImages = async () => {
    const rawImages = await page.evaluate(() => {
      const { document: pageDocument, location: pageLocation } = globalThis;
      const candidates = Array.from(pageDocument.images).map((img) => {
        const previewUrl =
          img.currentSrc ||
          img.src ||
          img.getAttribute('data-src') ||
          img.getAttribute('srcset')?.split(',').at(-1)?.trim().split(' ')[0] ||
          '';
        const anchor = img.closest('a');
        return {
          previewUrl,
          alt: img.alt || img.getAttribute('aria-label') || '',
          href: anchor?.href || pageLocation.href,
          width: img.naturalWidth || img.width || 0,
          height: img.naturalHeight || img.height || 0
        };
      });

      return candidates.filter((item) => item.previewUrl && item.width >= 120 && item.height >= 120);
    });

    for (const image of rawImages) {
      const normalized = {
        ...image,
        previewUrl: normalizePreviewUrl(image.previewUrl),
        title: image.alt?.trim() || source.title
      };
      if (!normalized.previewUrl || !isValidBookmarkImage(source, normalized)) continue;
      const key = normalized.href || normalized.previewUrl;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      accumulated.push(normalized);
    }
  };

  await collectVisibleImages();
  let previousCount = accumulated.length;
  let stableRounds = 0;
  for (let i = 0; i < 28; i += 1) {
    if (accumulated.length >= limit) break;
    await page.mouse.wheel(0, 1800);
    await page.waitForTimeout(1100);
    await collectVisibleImages();
    stableRounds = accumulated.length <= previousCount ? stableRounds + 1 : 0;
    if (stableRounds >= 6 && accumulated.length > 0) break;
    previousCount = Math.max(previousCount, accumulated.length);
  }

  return uniqueBy(
    accumulated,
    (item) => item.href || item.previewUrl
  ).slice(0, limit);
}

function toCollection(source, images, partitionIndex = 0, totalPartitions = 1) {
  const palette = fallbackPalette[source.type] ?? fallbackPalette.local;
  const baseCollectionId = slugify(source.id || source.collectionTitle || source.url);
  const collectionId = totalPartitions > 1 ? `${baseCollectionId}-cluster-${partitionIndex + 1}` : baseCollectionId;
  const partitionLabel = totalPartitions > 1 ? ` · Cluster ${String(partitionIndex + 1).padStart(2, '0')}` : '';
  const visualItems = images.map((image, index) => {
    const itemId = stableItemId(source, image, index);
    const title = image.title || `${source.collectionTitle || source.title} ${index + 1}`;
    return {
      id: itemId,
      title,
      image: image.previewUrl,
      previewUrl: image.previewUrl,
      type: source.type === 'pixiv' ? 'illustration' : 'reference',
      source: source.title,
      sourceUrl: image.href || source.url,
      summary: `${source.type} 收藏：${title}`,
      note: `由 Visual Bookmark Sync 从 ${source.title} 读取的收藏记录。当前阶段不下载原图，只保留平台预览图 URL、收藏链接和 metadata。`,
      tags: source.tags || [source.type],
      palette,
      related: {
        visuals: []
      }
    };
  });

  return {
    id: collectionId,
    title: `${source.collectionTitle || source.title}${partitionLabel}`,
    source: source.type,
    sourceLabel: `${String(source.type).toUpperCase()} BOOKMARKS`,
    summary: `${source.title} 同步得到的第 ${partitionIndex + 1} 个视觉主题簇。`,
    mood: source.mood || 'Visual Board',
    tags: source.tags || [source.type],
    palette,
    coverImages: visualItems.slice(0, 4).map((item) => item.image),
    images: visualItems,
    cluster: `cluster-${partitionIndex + 1}`,
    parentSourceId: source.id,
    partitionIndex,
    partitionSize: visualItems.length,
    curationNote: `这个 collection 来自 ${source.title} 的收藏清单，是同步后按 ${visualItems.length} 张一组切出的视觉主题簇。同步器只保存平台预览图 URL、标题和来源链接，不下载原图，不保存登录态。`
  };
}

function toCollections(source, images) {
  const partitions = chunkByPattern(images, source.partitionPattern);
  return partitions.map((chunk, index) => toCollection(source, chunk, index, partitions.length));
}

async function main() {
  const config = await readJson(sourcesPath, { sources: [] });
  const sources = (config.sources || []).filter((source) => source.enabled && source.url);
  if (!sources.length) {
    console.log('No enabled visual bookmark sources. Edit public-data/visual-sources/sources.json first.');
    return;
  }

  await fs.mkdir(browserProfileDir, { recursive: true });
  const context = await chromium.launchPersistentContext(browserProfileDir, {
    headless: false,
    viewport: { width: 1440, height: 1000 }
  });

  const page = context.pages()[0] || (await context.newPage());
  const collections = [];
  const sourceReports = [];

  for (const source of sources) {
    console.log(`Syncing bookmarks ${source.id}: ${source.url}`);
    try {
      const images = await scrapeSource(page, source);
      const sourceCollections = toCollections(source, images);
      collections.push(...sourceCollections);
      sourceReports.push({
        id: source.id,
        type: source.type,
        url: source.url,
        mode: 'bookmark-sync',
        downloaded: false,
        syncedItems: images.length,
        syncedCollections: sourceCollections.filter((collection) => collection.images.length).length,
        partitionPattern: source.partitionPattern || [6, 4, 9, 12],
        warning: images.length ? undefined : 'no-valid-bookmark-items; source may require login or a concrete public collection URL',
        syncedAt: new Date().toISOString()
      });
      console.log(`Synced ${images.length} bookmark previews into ${sourceCollections.length} collections from ${source.id}`);
    } catch (error) {
      sourceReports.push({
        id: source.id,
        type: source.type,
        url: source.url,
        mode: 'bookmark-sync',
        downloaded: false,
        error: error instanceof Error ? error.message : String(error),
        syncedAt: new Date().toISOString()
      });
      console.error(`Failed ${source.id}:`, error);
    }
  }

  await context.close();

  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    mode: 'bookmark-sync',
    downloaded: false,
    sources: sourceReports,
    collections: collections.filter((collection) => collection.images.length)
  };

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${manifest.collections.length} bookmark collections to ${path.relative(root, manifestPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
