const INIT_LOG_MSG = 'SW:';
const CACHE_VERSION = 'v1.0';
const ROOT_PATH = "/10A-PWA/Practica4";

self.addEventListener('install', event => {
    console.log(INIT_LOG_MSG, 'Se ha instalado el SW');

    const promiseCache = caches.open(`caches${CACHE_VERSION}`).then((cache) => {
        return cache.addAll([
            // Guarda los elementos de la app shell
            `${ROOT_PATH}/`, 
            `${ROOT_PATH}/index.html`, 
            `${ROOT_PATH}/js/app.js`,
            `${ROOT_PATH}/pages/suma.html`,
            `${ROOT_PATH}/pages/resta.html`,
            `${ROOT_PATH}/pages/multiplicacion.html`,
            `${ROOT_PATH}/pages/division.html`,
            `https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css`,
            `https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js`,
        ]);
    });

    event.waitUntil(promiseCache);
});

self.addEventListener('fetch', event => {
    const respCache = caches.match(event.request);

    event.respondWith(respCache);
});
