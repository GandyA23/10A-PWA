const ROOT_PATH = "/10A-PWA/Practica6";

if (navigator.serviceWorker) {  
    navigator.serviceWorker.register(`${ROOT_PATH}/sw.js`);
} else {
    console.error("El navegador no soporta el Service Worker");
}
