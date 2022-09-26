const ROOT_PATH = "/10A-PWA/Practica3";

if (navigator.serviceWorker) {  
    navigator.serviceWorker.register(`${ROOT_PATH}/sw.js`);
} else {
    console.error("El navegador no soporta el Service Worker");
}

function useCaches () {
    // Verifica que el navegador puede soportar el cache
    if (window.caches) {
        console.log("El navegador soporta el cache");

        // Todos los métodos de caches devuelven promesas

        // Obtiene un cache y si no existe, lo crea
        caches.open('cache-v1');

        // Los caches devuelven promesas
        // Aquí devuelve los nombres de los caches que se encuentran guardados en el dominio
        // Imprime un arreglo de strings con una posición (cache-v1)
        caches.keys().then(keys => {
            console.log("Llaves en el cache: ", keys);
        });

        // Verifica si existe un cache por su key, retorna un boolean
        caches.has('cache-v4').then(resp => {
            // Retorna False
            console.log('Respuesta del has: ', resp);
        });

        // Verifica si existe un cache por su key, retorna un boolean
        caches.has('cache-v1').then(resp => {
            // Retorna true
            console.log('Respuesta del has: ', resp);
        });

        // Obtienes el cache
        caches.open('cache-v1').then(cache => {
            // Guarda el index.html, style.css y cache-icon.png en el cache
            // Uno por uno
            cache.add(`${ROOT_PATH}/index.html`);
            cache.add(`${ROOT_PATH}/images/cache-icon.png`);
            cache.add(`${ROOT_PATH}/css/style.css`);

            // Varios elementos
            cache.addAll([`${ROOT_PATH}/index.html`, `${ROOT_PATH}/images/cache-icon.png`, `${ROOT_PATH}/css/style.css`])
                .then(() => {
                    // Elimina un elemento del cache
                    cache.delete(`${ROOT_PATH}/images/cache-icon.png`);
                });

            // Verifica si existe ese archivo por su ruta y devuelve ese archivo si existe
            caches.match(`${ROOT_PATH}/index.html`).then(resp => {
                resp.text().then(respText => {
                    console.log('match response: ', respText);
                });
            });
        });

        // Elimina un cache por su identificador (key)
        caches.delete('caches-v3');

    }
}