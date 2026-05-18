import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRuntimeContentIndex } from './build-runtime-content-index.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readArg(name, fallback = '') {
  const prefix = `--${name}=`;
  const matched = process.argv.find((item) => item.startsWith(prefix));
  if (matched) return matched.slice(prefix.length);
  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0 && process.argv[index + 1] && !process.argv[index + 1].startsWith('--')) {
    return process.argv[index + 1];
  }
  return fallback;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function assertProjectionRoot(projectionRoot) {
  if (!projectionRoot) {
    throw new Error('--projection is required');
  }
  const manifestPath = path.join(projectionRoot, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`ContentBase projection manifest is missing: ${manifestPath}`);
  }
  const manifest = readJson(manifestPath);
  if (manifest.version !== 'public-projection.v1' || manifest.target !== 'myblog') {
    throw new Error('ContentBase projection manifest must be public-projection.v1 for target=myblog');
  }
  if (!Array.isArray(manifest.posts) || manifest.posts.length === 0) {
    throw new Error('ContentBase projection manifest contains no posts');
  }
  return manifest;
}

async function main() {
  const projectionRoot = path.resolve(readArg('projection'));
  const manifest = assertProjectionRoot(projectionRoot);
  const importVault = path.join(repoRoot, '.runtime', 'contentbase-projection-import');

  fs.rmSync(importVault, { recursive: true, force: true });
  fs.mkdirSync(path.join(importVault, 'contentbase'), { recursive: true });

  for (const post of manifest.posts) {
    const sourceFile = path.join(projectionRoot, post.file);
    if (!fs.existsSync(sourceFile)) {
      throw new Error(`ContentBase projected post is missing: ${sourceFile}`);
    }
    const targetName = path.basename(post.file);
    fs.copyFileSync(sourceFile, path.join(importVault, 'contentbase', targetName));
  }

  const result = await buildRuntimeContentIndex({
    rootDir: repoRoot,
    vaultRoot: importVault,
    sourceRootLabel: '/home/vault/Obsidian/docs',
    openListRootLabel: '/openlist/Obsidian/docs',
  });

  const importedSlugs = new Set((result.index?.articles || []).map((article) => article.slug));
  for (const post of manifest.posts) {
    if (!importedSlugs.has(post.slug)) {
      throw new Error(`MyBlog runtime index does not contain imported ContentBase slug: ${post.slug}`);
    }
  }

  console.log(JSON.stringify({
    ok: true,
    importedPosts: manifest.posts.length,
    slugs: manifest.posts.map((post) => post.slug),
    runtimeIndex: 'public-data/runtime/content-index.json',
    publicRuntimeIndex: 'apps/web/public/runtime/content-index.json',
  }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
