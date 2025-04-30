const CACHE_NAME = 'justchill-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/jc_logo_32x32.png',
    // Add paths to other critical assets here
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});