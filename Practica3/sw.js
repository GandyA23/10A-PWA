const INIT_LOG_MSG = 'SW:';
const ROOT_PATH = "/10A-PWA/Practica3";

// Si un navegador es compatible con el SW, entonces también es compatible con caches
self.addEventListener('install', event => {
    console.log(INIT_LOG_MSG, 'Se ha instalado el SW');

    const promiseCache = caches.open('caches-v1.1').then((cache) => {
        return cache.addAll([
            // Guarda los elementos de la app shell
            // Es necesario agregar a raíz para evitar errores en modo offline
            `${ROOT_PATH}/`, 
            `${ROOT_PATH}/index.html`, 
            `${ROOT_PATH}/images/cache-icon.png`, 
            `${ROOT_PATH}/css/style.css`,
            `${ROOT_PATH}/js/app.js`,
            `https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css`,
            `https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js`,
        ]);
    });

    // No pases al siguiente estado hasta que la cache se instale
    event.waitUntil(promiseCache);
});

self.addEventListener('fetch', event => {
    // Busca en todos los caches los archivos a los cuales se les hace petición
    const respCache = caches.match(event.request);

    event.respondWith(respCache);
});
