const CACHE_VERSION = 'v1';
const CACHE_NAME = `justchill-static-${CACHE_VERSION}`;
const CONTENT_CACHE = `justchill-content-${CACHE_VERSION}`;
const IMAGE_CACHE = `justchill-images-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/dist/output.css',
  '/dist/main.js',
  '/jc_favicon_32x32.png',
  '/jc_favicon_192x192.png',
  '/jc_logo_32x32.png',
  '/jc_logo_144x144.png',
  '/jc_logo_180x180.png',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheAllowlist = [CACHE_NAME, CONTENT_CACHE, IMAGE_CACHE];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheAllowlist.includes(cacheName)) {
            console.log('Deleting outdated cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper function to determine if URL is navigating to a new page
function isNavigation(request) {
  return (request.mode === 'navigate' || 
         (request.method === 'GET' && 
          request.headers.get('accept').includes('text/html')));
}

// Helper function to determine if we should cache this response
function isCacheWorthy(response) {
  // Don't cache error responses or opaque responses
  return response && response.status === 200 && response.type === 'basic';
}

// Fetch event - implement stale-while-revalidate strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // For same-origin navigation requests (HTML pages)
  if (isNavigation(request) && url.origin === self.location.origin) {
    event.respondWith(
      caches.match('/index.html')
        .then(cachedResponse => {
          const fetchPromise = fetch(request)
            .then(response => {
              // Update the cache with the new version
              if (isCacheWorthy(response)) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(request, responseClone);
                });
              }
              return response;
            })
            .catch(() => {
              // If fetch fails, fall back to cached page
              return cachedResponse;
            });
          
          // Return the cached response immediately if available, otherwise wait for fetch
          return cachedResponse || fetchPromise;
        })
    );
    return;
  }
  
  // For image requests, use Cache-First strategy
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then(response => {
              if (!isCacheWorthy(response)) {
                return response;
              }
              
              // Cache the image for future use
              const responseClone = response.clone();
              caches.open(IMAGE_CACHE).then(cache => {
                cache.put(request, responseClone);
              });
              
              return response;
            });
        })
    );
    return;
  }
  
  // For all other requests, use Network-First strategy
  event.respondWith(
    fetch(request)
      .then(response => {
        // Don't cache cross-origin resources or error responses
        if (!isCacheWorthy(response)) {
          return response;
        }
        
        // Cache successful responses for future offline use
        const responseClone = response.clone();
        caches.open(CONTENT_CACHE).then(cache => {
          cache.put(request, responseClone);
        });
        
        return response;
      })
      .catch(() => {
        // If network request fails, try to get from cache
        return caches.match(request);
      })
  );
});

// Handle background sync for any pending uploads/requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'justchill-sync') {
    // Handle sync event when back online
    event.waitUntil(syncData());
  }
});

// Placeholder for sync functionality
async function syncData() {
  // In a real app, this would process any queued API requests
  // For now, this is just a placeholder
  console.log('Background sync executed');
  return Promise.resolve();
}