import { getAllNotesFirestore, addNoteFirestore, updateNoteFirestore } from "/10A-PWA/Practica7/js/firebase-functions.js";
const ROOT_PATH = "/10A-PWA/Practica7";
 
/*
if (navigator.serviceWorker) {
    navigator.serviceWorker.register(`${ROOT_PATH}/sw.js`);
}
*/


// Elements to show new notes
const divNotes = document.getElementById('divNotes');

// Elements to show message
const divToast = document.getElementById("divToast");
const divToastMessage = document.getElementById("divToastMessage");

// Elements to save a note
const textareaNote = document.getElementById("textareaNote");

// Elements to update a note
const inputNoteId = document.getElementById('inputNoteId');
const textAreaNoteUpdate = document.getElementById('textareaNoteUpdate');
const captionCreatedAtUpdate = document.getElementById('createdAtUpdate');

// Elements to show all notes
const buttonLoadNotes = document.getElementById("buttonLoadNotes");

// En base al último registro
let lastVisible = null;

const pushNoteToDiv = (note, first) => {

    const id = note.id;
    const text = note.text;
    const created_at = note.created_at.toLocaleString('es-MX');
    const textEscaped = text.replaceAll('"', "&quote;");

    const cardNote = `
    <div class="card my-2" data-bs-toggle="modal" data-bs-target="#modalUpdateNote" data-bs-idNote="${id}" data-bs-text="${textEscaped}" data-bs-created_at="${created_at}">
        <div class="card-body">
            <div class="row">
                <div class="col-3">
                    <img src="https://picsum.photos/seed/image1/150/150" class="img-fluid img-thumbnail" alt="Imagen relacionada a la nota">
                </div>
                <div class="col">
                    <figure>
                        <blockquote class="blockquote">
                            <p id="pText${id}" class="text-truncate">${text}</p>
                        </blockquote>
                        <figcaption class="blockquote-footer mt-3">
                            ${created_at}
                        </figcaption>
                    </figure>
                </div>
            </div>
        </div>
    </div>
    `;

    if (first)
        divNotes.innerHTML = `${cardNote} ${divNotes.innerHTML}`;
    else
        divNotes.innerHTML += cardNote;
}

const getAllNotes = async () => {
    const notes = await getAllNotesFirestore(lastVisible);

    if (notes.length > 0) {
        for(const note of notes) {
            pushNoteToDiv(note);
        }

        lastVisible = notes[notes.length - 1].d;
        
        showToast(true, 'Se han cargado las notas');
    } else {
        showToast(false, 'No hay más notas por mostrar');
        buttonLoadNotes.classList.add("visually-hidden");
    }
}

const saveNote = async() => {
    const note = {
        text: textareaNote.value,
        created_at: new Date()
    };

    const id = await addNoteFirestore(note);
    let message, status = id != 'no-create';

    if (status) {
        message = `Nota creada: <b>${id}</b>`;
        textareaNote.value = '';
        pushNoteToDiv(note, status);
    } else {
        message = `Ha ocurrido un error: <b>${id}</b>`;
    }

    showToast(status, message);
}

const showDataInModal = (event) => {
    // Button that triggered the modal
    const button = event.relatedTarget;
    
    // Extract info from data-bs-* attributes
    const id = button.getAttribute('data-bs-idNote');
    const text = button.getAttribute('data-bs-text').replaceAll("&quote;", '"');
    const created_at = button.getAttribute('data-bs-created_at');

    // Update the modal's content.
    inputNoteId.value = id;
    textAreaNoteUpdate.value = text;
    captionCreatedAtUpdate.innerHTML = `Fecha de creación: ${created_at}`;
}

const updateNote = () => {
    const note = {
        id: inputNoteId.value,
        text: textAreaNoteUpdate.value
    };

    const status = updateNoteFirestore(note);

    if (status) {
        // Update note content
        document.getElementById(`pText${note.id}`).innerHTML = note.text;
        
        // Close modal
        document.getElementById('buttonCloseModal').click();

        // Show toast
        showToast(status, 'Se ha actualizado la nota');
    } else {
        showToast(status, 'Ha ocurrido un error al actualizar la nota');
    }
}

const showToast = (status, message) => {
    // Limpia el toast
    divToast.classList.remove('text-bg-success', 'text-bg-danger');

    // Asigna la información
    divToast.classList.add(`text-bg-${status ? 'success' : 'danger'}`);
    divToastMessage.innerHTML = message;

    // Muestra el toast
    new bootstrap.Toast(divToast).show();
}

// Events listeners
document.getElementById("buttonSave").addEventListener('click', saveNote);
buttonLoadNotes.addEventListener('click', getAllNotes);
document.getElementById("modalUpdateNote").addEventListener('show.bs.modal', showDataInModal);
document.getElementById("buttonUpdate").addEventListener('click', updateNote);

getAllNotes();
