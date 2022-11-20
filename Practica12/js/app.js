const ROOT_PATH = "/10A-PWA/Practica12";
 
if (navigator.serviceWorker) {
    navigator.serviceWorker.register(`${ROOT_PATH}/sw.js`);
}

const btnCamera = document.getElementById("btnCamera");
const videoCamera = document.getElementById("videoCamera");
const btnTakePhoto = document.getElementById("btnTakePhoto");
const carouselContentInner = document.getElementById("carouselContentInner");

// Elements to show message
const divToast = document.getElementById("divToast");
const divToastMessage = document.getElementById("divToastMessage");

let firstTime = true;

const camera = new Camera(videoCamera);

const showToast = (status, message) => {
    // Limpia el toast
    divToast.classList.remove('text-bg-success', 'text-bg-danger');

    // Asigna la información
    divToast.classList.add(`text-bg-${status ? 'success' : 'danger'}`);
    divToastMessage.innerHTML = message;

    // Muestra el toast
    new bootstrap.Toast(divToast).show();
}


btnCamera.addEventListener('click', async (event) => {
    const status = await camera.power();
    showToast(status, status ? 'Se ha encendido la cámara correctamente' : 'Ha ocurrido un error, favor de intentarlo más tarde');
});
 
btnTakePhoto.addEventListener('click', (event) => {

    if (camera.isPowerOn()) {
        let photo = camera.takePhoto();
        camera.off();
    
        console.log(carouselContentInner.innerHTML);
    
        carouselContentInner.innerHTML += `
            <div class="carousel-item${firstTime ? ' active' : ''}">
                <img src="${photo}" class="d-block w-100">
            </div>  
        `;
    
        firstTime = false;
    } else {
        showToast(false, "Es necesario que primero encienda la cámara");
    }
});
