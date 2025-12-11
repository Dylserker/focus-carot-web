const CACHE_NAME = 'focus-carot-cache-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/favicon-new.ico',
  '/logo192.png',
  '/logo512.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
          return null;
        })
      )
    )
  );
  self.clients.claim();
});

// Network-first for navigation, cache-first for other requests
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle same-origin requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin === self.location.origin) {
    // HTML navigation requests -> try network, fallback to cache
    if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            // Update cache with latest index.html
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy));
            return response;
          })
          .catch(() => caches.match('/index.html'))
      );
      return;
    }

    // For other assets: try cache first then network
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            // Put a copy in cache for future
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => {
            // Nothing in cache and network failed
            return new Response(null, { status: 504, statusText: 'Gateway Timeout' });
          });
      })
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
