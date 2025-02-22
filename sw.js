// sw.js - a simple service worker for caching static files

const CACHE_NAME = 'pbi-pwa-cache-v1';
const FILES_TO_CACHE = [
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
  // Add more assets: CSS, JS, etc. e.g. '/styles.css', '/app.js'
];

self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  // Intercept fetch requests
  evt.respondWith(
    caches.match(evt.request)
      .then((response) => {
        // Return cached response if found, else fetch from network
        return response || fetch(evt.request);
      })
  );
});
