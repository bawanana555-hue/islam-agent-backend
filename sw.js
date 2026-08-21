// sw.js - Version Tolérante
const CACHE_NAME = 'tossara-v2';
const ASSETS = [
  './index.html',
  './manifest.json',
  './islam_data.json',
  './db.js',
  './rag_engine.js',
  './app.js',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Met en cache chaque fichier un par un pour éviter tout blocage
      return Promise.allSettled(
        ASSETS.map(asset => cache.add(asset).catch(err => console.warn('Fichier ignoré:', asset)))
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
