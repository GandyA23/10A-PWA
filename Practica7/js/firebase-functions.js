const ROOT_PATH = "/10A-PWA/Practica7";

import { collection, query, orderBy, getDocs, getFirestore, addDoc, startAfter, limit, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js"
import { } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js"
import { app } from "/10A-PWA/Practica7/js/firebase.js"

const db = getFirestore(app);

const getAllNotesFirestore = async (lastVisible) => {
    const queryParams = [
        collection(db, "notes"), 
        orderBy("created_at", "desc"), 
        limit(5)        
    ];

    // En caso de que envíen una última posición, la considera para la query
    if (lastVisible) {
        queryParams.push(startAfter(lastVisible));
    }

    const q = query(...queryParams);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => {
        const note = doc.data();

        return {
            id: doc.id,
            text: note.text,
            created_at: note.created_at.toDate(),
            d: doc
        };
    });
}

const addNoteFirestore = async (note) => {
    try {
        // Add a new document with a generated id.
        const docRef = await addDoc(collection(db, "notes"), note);

        return docRef.id;
    } catch (ex) {
        console.error(ex);
        return 'no-created';
    }
}

const updateNoteFirestore = async(note) => {
    try {
        // Update a document.
        const noteRef = doc(db, "notes", note.id);

        await updateDoc(noteRef, {
            text: note.text
        });

        return true;
    } catch (ex) {
        console.error(ex);
        return false;
    }
}

export {
    getAllNotesFirestore,
    addNoteFirestore,
    updateNoteFirestore
}
