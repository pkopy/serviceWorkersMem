const CACHE_NAME = 'my-site-cache-v1';
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/js/app.js',
    '/img/geometry2.png',
    '/css/app.css',
    '/css/responsive.css',
    '/img/szmebuldog__300x312.png',
    '/img/star__30x30.png'
];

self.addEventListener('install', (evt) => {
    console.log('[ServiceWorker] Install');
    // CODELAB: Precache static resources here.
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Pre-caching offline page');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});


self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');
    // CODELAB: Remove previous cached data from disk.
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

// self.addEventListener('fetch', (evt) => {
//     console.log('[ServiceWorker] Fetch', evt.request.url);
//     // CODELAB: Add fetch event handler here.
//     if (evt.request.mode !== 'navigate') {
//         // Not a page navigation, bail.
//         return;
//       }
//       evt.respondWith(
//           fetch(evt.request)
//               .catch(() => {
//                 return caches.open(CACHE_NAME)
//                     .then((cache) => {
//                       return cache.match('index.html');
//                     });
//               })
//       );

// });

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});