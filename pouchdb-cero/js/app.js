const ROOT_PATH = "/10A-PWA/pouchdb-cero";

if (navigator.serviceWorker) {
  navigator.serviceWorker.register(`${ROOT_PATH}/sw.js`);
}

document.getElementById("buttonCreate").addEventListener("click", (event) => {
  createDatabase();

  store(
    document.getElementById("inputName").ariaValueMax,
    document.getElementById("inputLastName").ariaValueMax,
    document.getElementById("inputHours").ariaValueMax,
  ).then((resultStore) => {
    console.log(resultStore);

    // Obten todos los registros
    getAll().then(async (resultGetAll) => {
      console.log(resultGetAll.rows);

      // Actualiza todos los registros en sync: true
      for await(const person of resultGetAll.rows) {
        const resultUpdateAll = await updateAll(person);

        console.log(resultUpdateAll);
      }

      getAll().then(async (resultGetAll2) => {
        // Elimina a todos los usuarios
        for await(const person of resultGetAll2.rows) {
          const resultDeleteAll = await deleteAll(person);

          console.log(resultDeleteAll);
        }
      });
    });
  });

});
