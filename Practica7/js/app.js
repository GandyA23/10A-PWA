import { getAllNotesFirestore, addNoteFirestore } from "/10A-PWA/Practica7/js/firebase-functions.js";
const ROOT_PATH = "/10A-PWA/Practica7";
 
/*
if (navigator.serviceWorker) {
    navigator.serviceWorker.register(`${ROOT_PATH}/sw.js`);
}
*/

const divNotes = document.getElementById('divNotes');
const divToast = document.getElementById("divToast");
const divToastMessage = document.getElementById("divToastMessage");
const textareaNote = document.getElementById("textareaNote");

const pushNoteToDiv = (note) => {
    const cardNote = `
    <div class="card my-2">
        <div class="card-body">
            <div class="row">
            <div class="col-3">
                <img src="https://picsum.photos/seed/image1/200/200" class="img-fluid img-thumbnail" alt="Imagen relacionada a la nota">
            </div>
            <div class="col text-truncate">
                ${note.text}
            </div>
            </div>
        </div>
    </div>
    `;

    divNotes.innerHTML = `${cardNote} ${divNotes.innerHTML}`;
}

const getAllNotes = async () => {
    const notes = await getAllNotesFirestore();

    divNotes.innerHTML = '';

    for(const note of notes) {
        pushNoteToDiv(note);
    }
}

const saveNote = async() => {
    divToast.classList.remove('text-bg-primary');
    divToast.classList.remove('text-bg-danger');

    const note = {
        text: textareaNote.value,
        created_at: new Date()
    };

    const id = await addNoteFirestore(note);

    if (id != 'no-create') {
        divToast.classList.add('text-bg-primary');
        textareaNote.value = '';
        divToastMessage.innerHTML = `Nota creada: <b>${id}</b>`;
        pushNoteToDiv(note);
    } else {
        divToast.classList.add('text-bg-danger');
        divToastMessage.innerHTML = `Ha ocurrido un error: <b>${id}</b>`;
    }

    new bootstrap.Toast(divToast).show();
}

document.getElementById("buttonSave").addEventListener('click', saveNote);

getAllNotes();
