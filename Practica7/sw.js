const LOG_MSG = 'SW:';
const ROOT_PATH = "/10A-PWA/Practica7";
const STATIC_CACHE_NAME = 'static-cache-v1.1';
const INMUTABLE_CACHE_NAME = 'inmutable-cache-v1.0';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1.0';
const LIMIT_ELEMENTS = 40;

const DEFAULT_RESPONSE = {
    '/html': `${ROOT_PATH}/pages/offline.html`,
    'image/': `${ROOT_PATH}/images/image-not-found.svg`
};

const ELEMENTS_CACHE = {
    [STATIC_CACHE_NAME]: [
        `${ROOT_PATH}/`, 
        `${ROOT_PATH}/index.html`,
        DEFAULT_RESPONSE['/html'],
        DEFAULT_RESPONSE['image/'],
        `${ROOT_PATH}/images/icons/android-launchericon-48-48.png`,
        `${ROOT_PATH}/images/icons/android-launchericon-72-72.png`,
        `${ROOT_PATH}/images/icons/android-launchericon-96-96.png`,
        `${ROOT_PATH}/images/icons/android-launchericon-144-144.png`,
        `${ROOT_PATH}/images/icons/android-launchericon-192-192.png`,
        `${ROOT_PATH}/images/icons/android-launchericon-512-512.png`,
    ],
    [INMUTABLE_CACHE_NAME]: [
        // Los archivos de Bootstrap pueden ser actualizados debido a su versión, se dice que son archivos inmutables.
        `https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css`,
        `https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js`,
        `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css`,
    ],
};

self.addEventListener('install', event => {
    const PROMISES = Object.keys(ELEMENTS_CACHE).map((cacheName) => {
        return caches.open(cacheName)
            .then((cache) => {
                return cache.addAll(ELEMENTS_CACHE[cacheName]);
            });
    });
    
    event.waitUntil(Promise.all(PROMISES));
});

// Estrategía Cache With Network fallback
self.addEventListener('fetch', (event) => {
    let respFetch = onlyCache(event.request).then((element) => {
        if (element)
            return element;
        return getResponseNetwork(event.request);
    });

    return event.respondWith(respFetch);
});

// Se detona la activación cada vez que se abre la pestaña una vez cerrada por completo
self.addEventListener('activate', (event) => {
    console.log(LOG_MSG, 'Activado!');

    // Elimina los caches de versiones anteriores
    const promDelete = caches.keys().then((cacheNames) => {
        for (const cacheName of cacheNames) {
            if (cacheName !== STATIC_CACHE_NAME && cacheName.includes('static'))
                return caches.delete(cacheName);

            if (cacheName !== INMUTABLE_CACHE_NAME && cacheName.includes('inmutable'))
                return caches.delete(cacheName);

            if (cacheName !== DYNAMIC_CACHE_NAME && cacheName.includes('dynamic'))
                return caches.delete(cacheName);
        }

        return cacheNames;
    });

    event.waitUntil(promDelete);
});

// Retorna el elemento en cache
function onlyCache(req) {
    return caches.match(req);
}

// Ve al network y consulta todos los recursos
function getResponseNetwork(req) {
    return fetch(req).then((respWeb) => {
        caches.open(DYNAMIC_CACHE_NAME).then(async (cache) => {
            await cache.put(req, respWeb);
            cleanCache(DYNAMIC_CACHE_NAME, LIMIT_ELEMENTS);
        });
        return respWeb.clone();
    }).catch((error) => {
        // retorna una respuesta default en caso de que el usuario no cuente con internet
        // Retorna una página offline u otro recurso dentro de DEFAULT_RESPONSE
        for (const key of Object.keys(DEFAULT_RESPONSE))
            if (req.headers.get('accept').includes(key)) 
                return onlyCache(DEFAULT_RESPONSE[key]);
    });
}

// Ayuda a eliminar elementos poniendo un número límite de objetos a guardar
function cleanCache (cacheName, numberItems) {
    return caches.open(cacheName).then((cache) => {
        cache.keys().then((keys) => {
            console.log(LOG_MSG, keys);
            if (keys.length > numberItems) {
                cache.delete(keys[0]).then(cleanCache(cacheName, numberItems));
            }
        })
    });
}
