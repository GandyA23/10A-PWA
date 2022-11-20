class Camera {
    constructor (videoNode) {
        this._videoNode = videoNode;
    }

    power () {
        // Obten la camara del dispositivo
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width: 300,
                height: 300
            }
        }).then((stream) => {
            // Empieza la transmisión en el objeto de Video
            this._videoNode.srcObject = stream;
            this._stream = stream;
        });
    }

    off () {
        // Pausa el video para que pueda capturar la foto
        this._videoNode.pause();

        if (this._stream) {
            this._stream.getTracks()[0].stop();
        } 
    }

    takePhoto () {
        let canvas = document.createElement("canvas");

        canvas.setAttribute("width", 300);
        canvas.setAttribute("height", 300);

        let context = canvas.getContext("2d");

        context.drawImage(this._videoNode, 0, 0, canvas.width, canvas.height);

        this._photo = context.canvas.toDataURL();

        canvas = context = null;

        return this._photo;
    }
}
