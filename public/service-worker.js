// Dynamic cache version - change this when you want to force update
const CACHE_VERSION = 'v2';
const APP_CACHE = `moondreamer-app-${CACHE_VERSION}`;
const ASSETS_CACHE = `moondreamer-assets-${CACHE_VERSION}`;

// Critical files to cache on install
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_CACHE).then(cache => cache.addAll(urlsToCache))
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete old caches that don't match current version
          if (cacheName !== APP_CACHE && cacheName !== ASSETS_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Don't cache API calls - always fetch fresh from backend
  if (request.url.includes('/api/')) {
    event.respondWith(fetch(request));
    return;
  }
  
  // Network-first strategy for HTML, JS, CSS (app code)
  // This ensures users always get the latest app version
  if (request.destination === 'document' || 
      request.destination === 'script' || 
      request.destination === 'style' ||
      url.pathname.endsWith('.html') ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.jsx')) {
    
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone and cache the fresh response
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(APP_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(request).then(cached => {
            return cached || caches.match('/index.html');
          });
        })
    );
    return;
  }
  
  // Cache-first strategy for images and fonts (static assets)
  // These don't change often, so cache improves performance
  if (request.destination === 'image' || 
      request.destination === 'font' ||
      url.pathname.includes('/images/') ||
      url.pathname.includes('/fonts/')) {
    
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) {
          return cached;
        }
        
        return fetch(request).then(response => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(ASSETS_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
    return;
  }
  
  // For everything else, try network first
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(APP_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});