const URL_BASE = 'https://pokeapi.co/api/v2/pokemon';
const INIT_LOG_MSG = 'SW:';
const ROOT_PATH = "/10A-PWA/examen_diagnostico";

if (navigator.serviceWorker) {  
    navigator.serviceWorker.register(`${ROOT_PATH}/sw.js`);
} else {
    console.error("El navegador no soporta el Service Worker");
}

async function getPokemonList (url) {
    if (!url) {
        url = URL_BASE;
    }

    const divsButtons = document.getElementsByClassName("buttons-pagination");
    const divButtonsArray = [...divsButtons];
    const divPokemonList = document.getElementById("pokemonList");

    divPokemonList.innerHTML = '';

    const pokemonListResponse = await fetch(url);
    
    if (pokemonListResponse.ok) {
        const pokemonList = await pokemonListResponse.json();

        // Muestra los botones
        divButtonsArray.forEach((div) => {
            div.innerHTML = '';

            if (pokemonList.previous) {
                div.innerHTML += `<button type="button" class="col-4 mx-auto btn btn-primary" onclick="getPokemonList('${pokemonList.previous}')"><i class="bi bi-arrow-left-circle"></i> Previous</button> `;
            } 

            if (pokemonList.next) {
                div.innerHTML += `<button type="button" class="col-4 mx-auto btn btn-primary" onclick="getPokemonList('${pokemonList.next}')">Next <i class="bi bi-arrow-right-circle"></i></button> `;
            } 
        });
        
        // Muestra la información de cada Pokemon
        for (const pokemon of pokemonList.results) {
            const pokemonInfoResponse = await fetch(pokemon.url);

            if (pokemonInfoResponse.ok) {
                const pokemonInfo = await pokemonInfoResponse.json();

                let strHabilities = '<ul class="list-group">';

                for (const ability of pokemonInfo.abilities) {
                    strHabilities += ` <li class="list-group-item">${ability.ability.name}</li>`;
                }

                strHabilities += '</ul>';
                
                divPokemonList.innerHTML += `
                <div class="card col-12 col-md-3 mx-auto my-3" style="width: 18rem;">
                    <img src="${pokemonInfo.sprites.other['official-artwork'].front_default}" class="card-img-top" alt="Imagen del pokemon ${pokemonInfo.name}">
                    <div class="card-body">
                    <h5 class="card-title"><b>Name: </b> ${pokemonInfo.name}</h5>
                    <p class="card-text"><p class="h6">Abilities</p> <p>${strHabilities}</p></p>
                </div>`;
            }
        }
    } else {
        var alertList = document.querySelectorAll('.alert');
        alertList.forEach(function (alert) {
            new bootstrap.Alert(alert)
        });
    }
}

getPokemonList();