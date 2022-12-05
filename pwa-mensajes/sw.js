const ROOT_PATH = "/10A-PWA/pwa-mensajes";

importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.3.1/dist/pouchdb.min.js');
importScripts(`${ROOT_PATH}/js/sw-db.js`);

const STATIC_CACHE_NAME = 'static-cache-v1.2';
const INMUTABLE_CACHE_NAME = 'inmutable-cache-v1.1';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1.1';

const cleanCache = (cacheName, limitItems) => {
  caches.open(cacheName).then((cache) => {
    return cache.keys().then((keys) => {
      if (keys.length > limitItems) {
        cache.delete(keys[0]).then(cleanCache(cacheName, limitItems));
      }
    });
  });
};

self.addEventListener('install', (event) => {
  const respCache = caches.open(STATIC_CACHE_NAME).then((cache) => {
    return cache.addAll([
      `${ROOT_PATH}/`,
      `${ROOT_PATH}/index.html`,
      `${ROOT_PATH}/js/app.js`,
      `${ROOT_PATH}/images/icons/android-launchericon-48-48.png`,
      `${ROOT_PATH}/images/icons/android-launchericon-72-72.png`,
      `${ROOT_PATH}/images/icons/android-launchericon-96-96.png`,
      `${ROOT_PATH}/images/icons/android-launchericon-144-144.png`,
      `${ROOT_PATH}/images/icons/android-launchericon-192-192.png`,
      `${ROOT_PATH}/images/icons/android-launchericon-512-512.png`,
      `${ROOT_PATH}/manifest.json`,
    ]);
  });
  const respCacheInmutable = caches.open(INMUTABLE_CACHE_NAME).then((cache) => {
    return cache.addAll([
      'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css',
      'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/webfonts/fa-solid-900.woff2',
      'https://cdn.jsdelivr.net/npm/pouchdb@7.3.1/dist/pouchdb.min.js',
    ]);
  });

  event.waitUntil(Promise.all([respCache, respCacheInmutable]));
});

self.addEventListener('activate', (event) => {
  const promDeleteCaches = caches.keys().then((items) => {
    items.forEach((key) => {
      if (key !== STATIC_CACHE_NAME && key.includes('static')) {
        return caches.delete(key);
      }
    });
  });
  event.waitUntil(promDeleteCaches);
});

self.addEventListener('fetch', (event) => {

  console.log(event.request.clone().method);

  if (event.request.clone().method === 'POST') {
    // Guarda todas las peticiones a POUCH DB
    const resp = fetch(event.request.clone())
      .then((respWeb) => respWeb)
      .catch((error) => {
        console.error(error);

        // Pregunta sí la sincronización es posible en este navegador
        if (self.registration.sync) {
          return event.request.json().then((body) => {
            console.log(body);
            return saveMessage(body);
          });
        } else {
          // Manda un mensaje al usuario que no puede realizar operaciones sync
        }    
      });

      event.respondWith(resp);
  } else {
    // En caso de no ser tipo POST, entonces es necesario meterlo como cache
    const resp = caches
      .match(event.request)
      .then((respCache) => {
        if (respCache) {
          return respCache;
        }
        return fetch(event.request).then((respWeb) => {
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, respWeb);
            cleanCache(DYNAMIC_CACHE_NAME, 10);
          });
          return respWeb.clone();
        });
      })
      .catch((error) => {
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match(`${ROOT_PATH}/pages/offline.html`);
        }
      });
    event.respondWith(resp);
  }

});

self.addEventListener('sync', (event) => {
  console.log('SW:', 'Sync');


  if (event.tag === 'new-post') {
    const resPromSync = sendPostMessages();
    event.waitUntil(resPromSync);
  }
});
