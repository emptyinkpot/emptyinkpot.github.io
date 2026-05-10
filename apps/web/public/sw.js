const CACHE_VERSION = 'myblog-runtime-pwa-v1';
const STATIC_CACHE = `${CACHE_VERSION}:static`;
const PAGE_CACHE = `${CACHE_VERSION}:pages`;
const APP_SHELL_URLS = ['/', '/books/', '/knowledge/', '/codex/', '/manifest.webmanifest', '/favicon.svg'];

const isRuntimePath = (url) =>
  url.pathname.startsWith('/api/') ||
  url.pathname.startsWith('/openlist/') ||
  url.pathname.startsWith('/reader/openlist') ||
  url.pathname.startsWith('/books/openlist');

const isStaticAsset = (request, url) =>
  request.destination === 'style' ||
  request.destination === 'script' ||
  request.destination === 'font' ||
  request.destination === 'image' ||
  url.pathname.startsWith('/_astro/') ||
  url.pathname.startsWith('/pagefind/');

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !key.startsWith(CACHE_VERSION))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || request.headers.has('range')) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || isRuntimePath(url)) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(PAGE_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match('/');
        })
    );
    return;
  }

  if (isStaticAsset(request, url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      })
    );
  }
});
