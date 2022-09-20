const INIT_LOG_MSG = 'SW:';
const PATHS_IMG = [
    'images/html-blue.png',
    'images/github.webp',
    'images/csharp.png',
];

// Opciones
// g: Global
// i: Case Insensitive
const REGEX_IMG_EXTENSION =  /\.(jpg|jpeg|png|gif|webp)$/gi;

console.log("SW: Hola Mundo Gandy!");

// En el service worker, ya no es necesario realizar la siguiente línea de código: 
// const self = this;

// Evento de instalación
self.addEventListener('install', event => {
    console.log(INIT_LOG_MSG, 'install');
});

// Evento de peticiones
self.addEventListener('fetch', event => {
    // En algún punto se llamo a changeCssToImage(event);
    // En algún punto se llamo a returnCustomCss(event);
    // En algún punto se llamo a changeImage(event);
    handleErrors(event);
})

// Funciones
/**
 * Intercepta todos los archivos .css y responde con una imagen
 * @param {*} event 
 */
function changeCssToImage (event) {
    // Esto provoca que los estilos mueran en la página.
    if (event.request.url.includes('.css')) {
        // Imprime solo los archivos con extención css
        console.log(INIT_LOG_MSG, event.request.url);
    
        // En el mismo evento, responde con un fetch a la url
        event.respondWith(fetch(PATH_IMG));
    }
}

/**
 * Cambia la petición de estilos con uno personalizado
 * @param {*} event 
 */
function returnCustomCss (event) {
    if (event.request.url.includes('style.css')) {
        // Imprime solo los archivos con extención css
        console.log(INIT_LOG_MSG, event.request.url);

        // Crea una respuesta y retornala
        const resp = new Response(`
            body {
                color: slategrey;
                background-color: beige;
            }   
        `, 
        {
            headers: {
                'Content-Type': 'text/css'
            }
        });

        // En el mismo evento, responde con una respuesta personalizada
        event.respondWith(resp);
    }
}

/**
 * Intercepta las imagenes y las cambia por las que se encuentran en el proyecto
 * @param {*} event 
 */
function changeImage (event) {
    if (REGEX_IMG_EXTENSION.test(event.request.url)) {
        console.log(INIT_LOG_MSG, event.request.url);
        event.respondWith(fetch(PATHS_IMG[Math.floor(Math.random() * PATHS_IMG.length)]));
    } 
}

/**
 * Realiza la petición a los recursos para verificar si existen
 * @param {*} event 
 */
function handleResourceErrors (event) {
    // Verifica si el recurso a solicitar existe
    const response = fetch(event.request)
        .then(resp => {
            console.log(INIT_LOG_MSG, resp);

            if (resp.ok)
                return resp;

            // Retorna una imagen en caso de que la respuesta no haya sido exitosa
            return fetch(PATHS_IMG[Math.floor(Math.random() * PATHS_IMG.length)]);
        })
        .catch(error => {
            console.log(INIT_LOG_MSG, ' error ', error);
            return error;
        });

    event.respondWith(response);
}
