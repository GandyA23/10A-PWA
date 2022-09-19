const INIT_MSG = 'SW:';

console.log("SW: Hola Mundo Gandy!");

// En el service worker, ya no es necesario realizar la siguiente línea de código: 
// const self = this;

// Evento de instalación
self.addEventListener('install', event => {
    console.log(INIT_MSG, 'install');
});

// Evento de peticiones
self.addEventListener('fetch', event => {
    /*
    // Intercepta todos los archivos .css y responde con una imagen, esto provoca que los estilos mueran en la página.
    if (event.request.url.includes('.css')) {
        // Imprime solo los archivos con extención css
        console.log(INIT_MSG, event.request.url);
    
        // En el mismo evento, responde con un fetch a la url
        event.respondWith(fetch('images/html-blue.png'));
    }
    */  

    // Cambia los estilos desde el Service Worker
    if (event.request.url.includes('style.css')) {
        // Imprime solo los archivos con extención css
        console.log(INIT_MSG, event.request.url);

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
})