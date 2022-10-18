const INIT_LOG_MSG = 'SW:';
const ROOT_PATH = "/10A-PWA/examen_diagnostico";
const STATIC_CACHE_NAME = 'static-cache-v1.0';
const INMUTABLE_CACHE_NAME = 'inmutable-cache-v1.0';
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v1.0';
const LIMIT_ELEMENTS = 400;

const ELEMENTS_CACHE = {
    [STATIC_CACHE_NAME]: [
        `${ROOT_PATH}/`, 
        `${ROOT_PATH}/index.html`,
        `${ROOT_PATH}/js/main.js`,
    ],
    [INMUTABLE_CACHE_NAME]: [
        `https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css`,
        `https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js`,
        `https://pokeapi.co/api/v2/pokemon`,
    ],
};

const DEFAULT_RESPONSE = `https://pokeapi.co/api/v2/pokemon`;

self.addEventListener('install', (event) => {
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
    let respFetch;

    if (existsElementInAppShell(event.request.url)) {
        respFetch = onlyCache(event.request);
    } else {
        respFetch = getResponseNetwork(event.request); 
    }

    return event.respondWith(respFetch);
});

// Verifica si un elemento existe en el arreglo de elementos en cache
function existsElementInAppShell(element) {
    let flag = false;

    for (const elements of Object.values(ELEMENTS_CACHE))
        flag |= elements.includes(element);

    return flag;
}

// Retorna el elemento en cache
function onlyCache(req) {
    return caches.match(req).then(response => response).catch(() => {
        return caches.match(DEFAULT_RESPONSE);
    });
}

function getResponseNetwork(req) {
    return fetch(req).then((respWeb) => {
        // En caso de que no exista una respuesta, entonces bucamos en cache 
        if (!respWeb) {
            return onlyCache(req);
        }

        caches.open(DYNAMIC_CACHE_NAME).then(async (cache) => {
            await cache.put(req, respWeb);
            cleanCache(DYNAMIC_CACHE_NAME, LIMIT_ELEMENTS);
        });
        return respWeb.clone();
    }).catch(() => {
        return onlyCache(req);
    });
}

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