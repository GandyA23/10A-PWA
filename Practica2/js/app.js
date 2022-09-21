// Pregunta si el navegador soporta el Service Worker
if (navigator.serviceWorker) {
    console.log("El navegador soporta el Service Worker");
    
    // Registra el archivo js al navegador
    // Es necesario colocar el archivo js en la raíz para que tenga control de toda la aplicación.  
    navigator.serviceWorker.register("/10A-PWA/Practica2/sw.js");
}
