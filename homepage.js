// S'inicialitza una llista de pel·lícules i es recupera la llista de pel·lícules recentment visitades del localStorage,
// o es crea una llista buida si no existeix cap dada.
let films = [];
localStorage["recentlyVisited"] = localStorage["recentlyVisited"] || JSON.stringify(films);

// Si no existeix la clau 'watchlist' al localStorage, es crea amb un array buit.
localStorage["watchlist"] = localStorage["watchlist"] || JSON.stringify([]);

// Funció per esborrar la llista de pel·lícules recentment visitades del localStorage i actualitzar la vista.
function clearVisited() {
    films = [];
    localStorage["recentlyVisited"] = JSON.stringify([]);
    initRecentlyVisited();
}

// Funció per actualitzar la llista de pel·lícules recentment visitades al localStorage.
function updateVisited(id, title, poster) {
    // S'itera sobre les pel·lícules per eliminar una pel·lícula existent amb el mateix ID.
    for (let i = 0; i < films.length; i++) {
        if (films[i].id === id) films.splice(i, 1);  // Es treu la pel·lícula de la llista si ja existeix.
    }

    // S'afegeix la nova pel·lícula a la llista.
    films.push({
        id,
        title,
        poster
    });

    // Si la llista supera les 5 pel·lícules, es limita la llista a les 5 més recents.
    if (films.length > 5) films = films.slice(1, 6);

    // S'actualitza el localStorage amb la nova llista de pel·lícules.
    localStorage["recentlyVisited"] = JSON.stringify(films);
}

// Funció per inicialitzar i mostrar les pel·lícules recentment visitades a la interfície d'usuari.
function initRecentlyVisited() {
    // Es netegen les seccions de la pàgina on es mostraran els resultats.
    $("#searchResult").html("");
    $("#lower_container").html("");
    $("#recentlyVisited").html("");
    let s = ""
    // Si la llista de pel·lícules recentment visitades no està buida, es genera el contingut.
    if (films.length > 0) {
        s += `<div class="row-fluid d-flex pb-4">
                    <h3 class="text-light col-auto d-inline-block me-auto"><strong>Recent searches</strong></h3>
                    <button class="btn btn-danger col-auto d-inline-block justify-self-end" onclick="clearVisited()" id="nextPage">Clear</button>
                </div>`;

        // Es genera un enllaç per cada pel·lícula recent, mostrant la seva imatge i el títol.
        for (let i = films.length - 1; i >= 0; i--) {
            s += `<a class="card bg-light col-2 mx-3 link-underline link-underline-opacity-0" href="film.html?f=${films[i]["id"]}" onclick="updateVisited('${films[i]["id"]}', '${films[i]["title"]}', '${films[i]["poster"]}')">
                <img src="${films[i]["poster"]}" alt="${films[i]["title"]} poster" class="img-fluid p-2">
                <h4 class="h4">${films[i]["title"]}</h4>
                </div>
            </a>`;
        }        
    }else{
        s += `<h1 class="text-light col-auto d-inline-block mt-5"><strong>Hello there! Search a movie to get started</strong></h1>`;
    }
    $("#recentlyVisited").html(s);
}

// Funció que es dispara quan es fa clic al botó de cerca, redirigint a la pàgina de resultats amb la consulta de cerca.
function searchClicked() {
    let query = $("#search").val().toString();
    $("#search").val("");
    // Es redirigeix a la pàgina de resultats de cerca amb el terme de cerca com a paràmetre.
    location.href = `search.html?q=${query.replace(" ", "_").replace(".", "")}`;
}

// Funció d'inicialització que es crida quan la pàgina es carrega.
function init() {
    // S'associa l'esdeveniment de clic al botó de cerca.
    $("#searchBtn").click(searchClicked);

    // Es permet la cerca quan es prem la tecla Enter al camp de cerca.
    $("#search").on('keypress', function (e) {
        if (e.keyCode == 13) searchClicked();  // 13 és el codi de la tecla Enter.
    });

    // Es carrega la llista de pel·lícules recentment visitades del localStorage.
    films = JSON.parse(localStorage["recentlyVisited"]);
    // Es crida la funció per actualitzar la vista de les pel·lícules recentment visitades.
    initRecentlyVisited();
}

// La funció init s'executa quan el document està llest.
$(document).ready(init);