import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import chokidar from 'chokidar';
import { buildRuntimeContentIndex } from './build-runtime-content-index.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const vaultRoot = path.resolve(process.env.MYBLOG_VAULT_ROOT || '/home/vault/Obsidian/docs');
const watchRoot = path.resolve(process.env.MYBLOG_VAULT_WATCH_ROOT || vaultRoot);
const runtimeIndexPath = path.resolve(process.env.MYBLOG_RUNTIME_INDEX_PATH || '/srv/myblog/site/runtime/content-index.json');
const sourceRootLabel = process.env.MYBLOG_RUNTIME_SOURCE_ROOT_LABEL || '/home/vault/Obsidian/docs';
const openListRootLabel = process.env.MYBLOG_RUNTIME_OPENLIST_ROOT_LABEL || '/openlist/Obsidian/docs';
const debounceMs = Number(process.env.MYBLOG_RUNTIME_PROJECTOR_DEBOUNCE_MS || 3000);

let timer = null;
let running = false;
let queued = false;
let changedFiles = new Set();

assertDirectory(vaultRoot, 'Vault root');
assertDirectory(watchRoot, 'Watch root');

console.log(`[runtime-content-projector] Vault root: ${vaultRoot}`);
console.log(`[runtime-content-projector] Watch root: ${watchRoot}`);
console.log(`[runtime-content-projector] Runtime index: ${runtimeIndexPath}`);
console.log(`[runtime-content-projector] Public OpenList root: ${openListRootLabel}`);
console.log('[runtime-content-projector] This service only rewrites runtime/content-index.json. It never runs Astro build, Pagefind, deploy, scp or rsync.');

scheduleProjection('startup');

const watcher = chokidar.watch(watchRoot, {
  ignored: [
    /(^|[/\\])\../,
    /[/\\]node_modules[/\\]/,
    /[/\\]\.git[/\\]/,
    /[/\\]\.obsidian[/\\]/,
    /[/\\]private[/\\]/,
    /[/\\]drafts[/\\]/
  ],
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 2000,
    pollInterval: 250
  }
});

watcher.on('add', onFileChange);
watcher.on('change', onFileChange);
watcher.on('unlink', onFileChange);
watcher.on('error', (error) => {
  console.error(`[runtime-content-projector] Watch error: ${error.message}`);
});

function onFileChange(filePath) {
  if (!/\.mdx?$/i.test(filePath)) return;
  const relativePath = toSlash(path.relative(watchRoot, filePath));
  changedFiles.add(relativePath);
  scheduleProjection(relativePath);
}

function scheduleProjection(reason) {
  if (running) {
    queued = true;
    console.log(`[runtime-content-projector] Change queued during projection: ${reason}`);
    return;
  }

  if (timer) clearTimeout(timer);
  console.log(`[runtime-content-projector] Change detected: ${reason}`);
  timer = setTimeout(projectRuntimeIndex, debounceMs);
}

async function projectRuntimeIndex() {
  timer = null;
  running = true;
  queued = false;
  const files = Array.from(changedFiles);
  changedFiles = new Set();
  if (files.length) {
    console.log(`[runtime-content-projector] Rebuilding after ${files.length} markdown change(s).`);
  }

  try {
    await buildRuntimeContentIndex({
      rootDir,
      vaultRoot,
      sourceRootLabel,
      openListRootLabel,
      outputFiles: [runtimeIndexPath]
    });
    console.log('[runtime-content-projector] Runtime index refreshed.');
  } catch (error) {
    console.error(`[runtime-content-projector] Projection failed: ${error.message}`);
  }

  running = false;
  if (queued || changedFiles.size > 0) scheduleProjection('queued changes');
}

function assertDirectory(directory, label) {
  if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
    console.error(`[runtime-content-projector] ${label} not found: ${directory}`);
    process.exit(1);
  }
}

function toSlash(value) {
  return value.replace(/\\/g, '/');
}
