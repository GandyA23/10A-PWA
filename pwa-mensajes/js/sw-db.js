const db = new PouchDB("mensajes");
const serverApiSw = 'http://localhost:3000';

function saveMessage(message){
    message._id = new Date().toISOString();
    
    return db.put(message).then(()=>{
        console.log('Mensaje almacenado');

        // Registra una tarea pendiente asíncrona por realizar 
        self.registration.sync.register('new-post');
        
        const resBodyOffline = {
            result: true,
            message: {
                origin: message.origin,
                text: message.text,
            },
            offMode: true,
        };

        const resOffline = new Response(
            JSON.stringify(resBodyOffline),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        return resOffline;
    })
}

function sendPostMessages() {
    return db.allDocs({include_docs: true})
        .then((docs) => {
            const allPromises = [];

            docs.rows.forEach((row) => {

                const doc = row.doc;

                const prom = fetch(serverApiSw, {
                    method: 'POST',
                    body: JSON.stringify(doc),
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  })
                    .then((res) => db.remove(doc));

                allPromises.push(prom);
            });

            return allPromises;
        });
}
