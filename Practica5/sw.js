const INIT_LOG_MSG = 'SW:';
const ROOT_PATH = "/10A-PWA/Practica5";
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
                `${ROOT_PATH}/index.html`, 
                `${ROOT_PATH}/images/cache-icon.png`, 
                `${ROOT_PATH}/css/style.css`,
                `${ROOT_PATH}/js/app.js`,
            ]);
        });

    // Recursos inmutables
    const promiseCacheInmutable = caches.open(INMUTABLE_CACHE_NAME)
        .then((cache) => {
            return cache.addAll([
                // Los archivos de Bootstrap pueden ser actualizados debido a su versión, se dice que son archivos inmutables.
                `https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css`,
                `https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js`,
            ]);
        });

    event.waitUntil(Promise.all([
        promiseCacheStatic, 
        promiseCacheInmutable
    ]));
});

// Estrategía Cache With Network fallback
self.addEventListener('fetch', (event) => {
    const response = caches.match(event.request)
        .then((respCache) => {
            // Si esta en cache, devuelvelo
            // El tiempo de respuesta es realmente reducido a menos de 10 ms
            if (respCache) return respCache;

            // Si no encontro el cache, entonces ve a la web a buscarlo
            return fetch(event.request)
                .then((respWeb) => {
                    caches.open(DYNAMIC_CACHE_NAME)
                        .then(async (cache) => {
                            // Guardalo en cache relacionado con una promesa
                            // Si llega esa promesa, entonces respondela con otra
                            // Primero guarda y después borras
                            await cache.put(event.request, respWeb);
                            cleanCache(DYNAMIC_CACHE_NAME, 2);
                        });
                    
                    // Es necesario clonar la respuesta para responderla a cache y la otra al fetch
                    // Un mismo response no puede ser enviado a dos diferentes peticiones
                    return respWeb.clone();
                });
        });

    return event.respondWith(response);
});

/*
// Estrategía: Only Cache
self.addEventListener('fetch', event => {
    const respCache = caches.match(event.request);
    event.respondWith(respCache);
});
*/

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
