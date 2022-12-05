const ROOT_PATH = "/10A-PWA/pwa-mensajes";

if (navigator.serviceWorker) {
  navigator.serviceWorker.register(`${ROOT_PATH}/sw.js`);
}

const origin = document.getElementById('name');
const textMessage = document.getElementById('textMessage');

const containerMessage = document.getElementById('containerMessage');

const btnSend = document.getElementById('btnSend');

const serverApi = 'http://localhost:3000';

btnSend.addEventListener('click', () => {
  const message = {
    origin: origin.value,
    text: textMessage.value,
  };
  fetch(serverApi, {
    method: 'POST',
    body: JSON.stringify(message),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((resp) => {
      if (resp.result) {
        const div = document.createElement('div');
        div.classList.add('card');
        div.classList.add('mt-2');
        div.innerHTML = `
        <div class="card-body">
            <div class="row">
                <div class="col-12 text-success">${resp.message.origin}</div>
                <div class="col-12">${resp.message.text}</div>
            </div>
        </div>`;
        containerMessage.prepend(div);
      }
    });
});

const getAllMessage = async () => {
  const resp = await fetch(serverApi).then((res) => res.json());
  containerMessage.innerHTML = '';
  resp.forEach((element) => {
    containerMessage.innerHTML += `<div class="card mt-2">
        <div class="card-body">
            <div class="row">
                <div class="col-12 text-success">${element.origin}</div>
                <div class="col-12">${element.text}</div>
            </div>
        </div>
      </div>`;
  });
};

getAllMessage();
