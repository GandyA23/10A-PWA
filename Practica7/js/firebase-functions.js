const ROOT_PATH = "/10A-PWA/Practica7";

import { collection, query, where, getDocs, getFirestore, addDoc } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js"
import { } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js"
import { app } from "/10A-PWA/Practica7/js/firebase.js"

const db = getFirestore(app);

const getAllNotesFirestore = async () => {
    const q = query(collection(db, "notes"));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
        const note = doc.data();

        return {
            id: doc.id,
            text: note.text,
            created_at: note.created_at 
        };
    });
}

const addNoteFirestore = async (note) => {
    try {
        // Add a new document with a generated id.
        const docRef = await addDoc(collection(db, "notes"), note);
    
        console.log("Document written with ID in notes: ", docRef.id);

        return docRef.id;
    } catch (ex) {
        return 'no-created';
    }
}

export {
    getAllNotesFirestore,
    addNoteFirestore
}
