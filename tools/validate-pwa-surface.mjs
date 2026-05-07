import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const issues = [];

const manifestPath = 'apps/web/public/manifest.webmanifest';
const serviceWorkerPath = 'apps/web/public/sw.js';
const baseLayoutPath = 'apps/web/src/layouts/BaseLayout.astro';
const twaContractPath = 'apps/android-shell/twa.contract.json';

validateManifest();
validateServiceWorkerBoundary();
validateLayoutRegistration();
validateTwaContract();

if (issues.length) {
  console.error(['PWA surface validation failed:', ...issues.map((issue) => `- ${issue}`)].join('\n'));
  process.exit(1);
}

console.log('PWA surface validation passed');

function validateManifest() {
  const manifest = readJson(manifestPath);

  expectEqual(manifest.id, '/', 'manifest id must be /');
  expectEqual(manifest.start_url, '/', 'manifest start_url must be /');
  expectEqual(manifest.scope, '/', 'manifest scope must be /');
  expectEqual(manifest.display, 'standalone', 'manifest display must be standalone');
  expectString(manifest.name, 'manifest name is required');
  expectString(manifest.short_name, 'manifest short_name is required');
  expectString(manifest.theme_color, 'manifest theme_color is required');
  expectString(manifest.background_color, 'manifest background_color is required');

  const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
  if (!icons.length) {
    issues.push('manifest must define icons');
    return;
  }

  validateIcon(icons, '192x192');
  validateIcon(icons, '512x512');

  const shortcutUrls = new Set((manifest.shortcuts ?? []).map((shortcut) => shortcut.url));
  ['/', '/books/', '/knowledge/', '/codex/'].forEach((url) => {
    if (url !== '/' && !shortcutUrls.has(url)) {
      issues.push(`manifest shortcuts should include ${url}`);
    }
  });
}

function validateIcon(icons, expectedSize) {
  const icon = icons.find((item) => item.sizes === expectedSize && item.type === 'image/png');
  if (!icon) {
    issues.push(`manifest must include a PNG icon with size ${expectedSize}`);
    return;
  }

  if (!icon.purpose || !String(icon.purpose).includes('maskable')) {
    issues.push(`manifest icon ${icon.src} must include maskable purpose`);
  }

  const imagePath = String(icon.src || '').replace(/^\//, 'apps/web/public/');
  if (!fileExists(imagePath)) {
    issues.push(`manifest icon file is missing: ${icon.src}`);
    return;
  }

  const [width, height] = readPngSize(imagePath);
  const [expectedWidth, expectedHeight] = expectedSize.split('x').map(Number);
  if (width !== expectedWidth || height !== expectedHeight) {
    issues.push(`manifest icon ${icon.src} is ${width}x${height}, expected ${expectedSize}`);
  }
}

function validateServiceWorkerBoundary() {
  const source = readText(serviceWorkerPath);

  [
    "url.pathname.startsWith('/api/')",
    "url.pathname.startsWith('/openlist/')",
    "url.pathname.startsWith('/reader/openlist')",
    "url.pathname.startsWith('/books/openlist')",
    "request.headers.has('range')"
  ].forEach((needle) => {
    if (!source.includes(needle)) {
      issues.push(`service worker boundary is missing: ${needle}`);
    }
  });

  if (!source.includes("self.addEventListener('fetch'")) {
    issues.push('service worker must define a fetch handler');
  }
}

function validateLayoutRegistration() {
  const source = readText(baseLayoutPath);

  [
    'rel="manifest"',
    '/manifest.webmanifest',
    'serviceWorker.register',
    '/sw.js',
    'theme-color',
    'apple-touch-icon'
  ].forEach((needle) => {
    if (!source.includes(needle)) {
      issues.push(`BaseLayout is missing PWA registration fragment: ${needle}`);
    }
  });
}

function validateTwaContract() {
  const contract = readJson(twaContractPath);

  expectEqual(contract.phase, 'pwa-twa', 'TWA contract phase must be pwa-twa');
  expectEqual(contract.status, 'web-pwa-surface-ready-local', 'TWA contract status must match local PWA surface readiness');
  expectEqual(contract.webManifestSource, manifestPath, 'TWA contract manifest source must match canonical path');
  expectEqual(contract.serviceWorkerSource, serviceWorkerPath, 'TWA contract service worker source must match canonical path');

  const boundaries = contract.serviceWorkerBoundary ?? [];
  ['do not intercept /api/*', 'do not intercept /openlist/*', 'do not intercept HTTP Range requests'].forEach((boundary) => {
    if (!boundaries.includes(boundary)) {
      issues.push(`TWA contract is missing service worker boundary: ${boundary}`);
    }
  });
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function readText(relativePath) {
  return fs.readFileSync(resolvePath(relativePath), 'utf8');
}

function fileExists(relativePath) {
  return fs.existsSync(resolvePath(relativePath));
}

function resolvePath(relativePath) {
  return path.resolve(rootDir, relativePath);
}

function expectString(value, message) {
  if (!value || typeof value !== 'string') {
    issues.push(message);
  }
}

function expectEqual(actual, expected, message) {
  if (actual !== expected) {
    issues.push(`${message}; got ${JSON.stringify(actual)}`);
  }
}

function readPngSize(relativePath) {
  const buffer = fs.readFileSync(resolvePath(relativePath));
  const signature = buffer.subarray(0, 8).toString('hex');
  if (signature !== '89504e470d0a1a0a') {
    issues.push(`not a PNG file: ${relativePath}`);
    return [0, 0];
  }
  return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
}
