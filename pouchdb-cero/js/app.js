const ROOT_PATH = "/10A-PWA/pouchdb-cero";

if (navigator.serviceWorker) {
  navigator.serviceWorker.register(`${ROOT_PATH}/sw.js`);
}

let db;

const createDatabase = (event) => {
  db = new PouchDB('people');  
  return db;
}

const store = (name, lastname, hours) => {
    let person = {
        _id: new Date().toISOString(),
        name: name,
        lastname: lastname,
        hours: hours,
        sync: false
    };

    return db.put(person);
}

const getAll = () => {
    return db.allDocs({include_docs: true, descending: true});
}

const update = (person) => {
    return db.put(person);
}

const deleteP = (person) => {
    return db.remove(person);
}

document.getElementById("buttonCreate").addEventListener("click", createDatabase);
document.getElementById("buttonRegister").addEventListener("click", (event) => {
  store(
    document.getElementById("inputName").value,
    document.getElementById("inputLastName").value,
    document.getElementById("inputHours").value,
  ).then((resultStore) => {
    console.log(resultStore);
  });
});

document.getElementById("buttonShowAll").addEventListener("click", (event) => {
  getAll().then((resultGetAll) => {
    console.log(resultGetAll.rows);
  });
});

document.getElementById("buttonUpdateAll").addEventListener("click", (event) => {
  getAll().then((resultGetAll) => {
    for (let person of resultGetAll.rows) {
      person.doc.sync = true;
      update(person.doc).then((result) => {
        console.log(result);
      }).catch((error) => console.error(error));
    }
  });
});

document.getElementById("buttonDeleteAll").addEventListener("click", (event) => {
  getAll().then((resultGetAll) => {
    for (let person of resultGetAll.rows) {
      if (person.doc.sync) {        
        deleteP(person.doc).then((result) => {
          console.log(result);
        }).catch((error) => console.error(error));
      }
    }
  });
});