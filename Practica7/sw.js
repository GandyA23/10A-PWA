const INIT_LOG_MSG = 'SW:';
const ROOT_PATH = "/10A-PWA/Practica7";
const STATIC_CACHE_NAME = 'static-cache-v1.1';
const INMUTABLE_CACHE_NAME = 'inmutable-cache-v1.0';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1.1';

self.addEventListener('install', event => {
    console.log(INIT_LOG_MSG, 'Se ha instalado el SW');

    // Recursos estáticos
    const promiseCacheStatic = caches.open(STATIC_CACHE_NAME)
        .then((cache) => {
            return cache.addAll([
                `${ROOT_PATH}/`, 
                `${ROOT_PATH}/index.html`
            ]);
        });

    // Recursos inmutables
    const promiseCacheInmutable = caches.open(INMUTABLE_CACHE_NAME)
        .then((cache) => {
            return cache.addAll([
                // Los archivos de Bootstrap pueden ser actualizados debido a su versión, se dice que son archivos inmutables.
                `https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css`,
                `https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js`,
                `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css`,
            ]);
        });

    event.waitUntil(Promise.all([
        promiseCacheStatic, 
        promiseCacheInmutable
    ]));
});

// nertwork with cache fallback
self.addEventListener('fetch', (event) => {

    const response = fetch(event.request).then((respWeb) => {
        // En caso de que no exista una respuesta, entonces bucamos en cache 
        if (!respWeb) {
            return caches.match(event.request);
        }

        caches.open(DYNAMIC_CACHE_NAME).then(async (cache) => {
            await cache.put(event.request, respWeb);
            cleanCache(DYNAMIC_CACHE_NAME, 3);
        });
        return respWeb.clone();
    }).catch(() => {
        return caches.match(event.request);
    });

    event.respondWith(response);
});

// Ayuda a eliminar elementos poniendo un número límite de objetos a guardar
function cleanCache (cacheName, numberItems) {
    return caches.open(cacheName).then((cache) => {
        cache.keys().then((keys) => {
            console.log(INIT_LOG_MSG, keys);
            if (keys.length > numberItems) {
                cache.delete(keys[0]).then(cleanCache(cacheName, numberItems));
            }
        })
    });
}