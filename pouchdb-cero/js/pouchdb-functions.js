let db;
var remoteCouch = false;

const createDatabase = (dbName) => {
    return db = new PouchDB('people');
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

const updateAll = (people) => {
    return db.put(people);
}

const deleteAll = (people) => {
    return db.remove(people);
}
