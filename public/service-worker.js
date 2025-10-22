const CACHE_NAME = 'moondreamer-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  
  // Don't cache API calls - let them go through to the backend
  if (request.url.includes('/api/')) {
    event.respondWith(fetch(request));
    return;
  }
  
  // Cache-first strategy for everything else
  event.respondWith(
    caches.match(request).then(response => 
      response || fetch(request).then(res => {
        const cache = caches.open(CACHE_NAME);
        cache.then(c => c.put(request, res.clone()));
        return res;
      })
    ).catch(() => caches.match('/index.html'))
  );
});