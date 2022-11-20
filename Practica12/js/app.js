const ROOT_PATH = "/10A-PWA/Practica12";
 
if (navigator.serviceWorker) {
    navigator.serviceWorker.register(`${ROOT_PATH}/sw.js`);
}

const btnCamera = document.getElementById("btnCamera");
const videoCamera = document.getElementById("videoCamera");
const btnTakePhoto = document.getElementById("btnTakePhoto");
const imgDynamic = document.getElementById("imgDynamic");

const camera = new Camera(videoCamera);

btnCamera.addEventListener('click', (event) => {
    camera.power();
});
 
btnTakePhoto.addEventListener('click', (event) => {
    let photo = camera.takePhoto();
    camera.off();

    imgDynamic.setAttribute('src', photo);
});
