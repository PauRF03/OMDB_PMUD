// Es declara un array buit per emmagatzemar la llista de pel·lícules afegides a la llista de desitjos (watchlist).
let watchlist = [];
// Es declara un array buit per emmagatzemar la llista de pel·lícules recentment visitades.
let films = [];
// Si no existeix la clau 'watchlist' al localStorage, es crea amb un array buit.
localStorage["watchlist"] = localStorage["watchlist"] || JSON.stringify(watchlist);

// Funció per actualitzar la llista de pel·lícules recentment visitades al localStorage.
function updateVisited(id, title, poster) {
    // S'itera sobre la llista de pel·lícules recents per eliminar qualsevol pel·lícula amb el mateix ID.
    for (let i = 0; i < films.length; i++) {
        if (films[i].id === id) films.splice(i, 1); // Es treu la pel·lícula existent amb el mateix ID.
    }

    // S'afegeix la nova pel·lícula a la llista de pel·lícules visitades recentment.
    films.push({
        id,
        title,
        poster
    });

    // Si la llista supera les 5 pel·lícules recents, es limita la llista a les 5 últimes.
    if (films.length > 5) films = films.slice(1, 6);

    // S'actualitza el localStorage amb la nova llista de pel·lícules visitades recentment.
    localStorage["recentlyVisited"] = JSON.stringify(films);
}

// Funció que es crida quan es fa clic al botó de cerca.
function searchClicked() {
    // Es recupera el terme de cerca introduït a l'input.
    let query = $("#search").val().toString();
    // Es neteja el camp de cerca després de recuperar el valor.
    $("#search").val("");
    // Es redirigeix a la pàgina de resultats de cerca amb el terme de cerca com a paràmetre a la URL.
    location.href = `search.html?q=${query.replace(" ", "_").replace(".", "")}`;
}

// Funció d'inicialització que es crida quan la pàgina es carrega.
function init() {
    // S'assigna una acció al botó de cerca per executar la funció searchClicked quan es fa clic.
    $("#searchBtn").click(searchClicked);

    // Es recupera la llista de pel·lícules recentment visitades des del localStorage.
    films = JSON.parse(localStorage["recentlyVisited"]);

    // S'assigna una acció perquè es pugui realitzar la cerca prement la tecla Enter al camp de cerca.
    $("#search").on('keypress', function (e) {
        if (e.keyCode == 13) searchClicked();  // 13 és el codi de la tecla Enter.
    });

    // Es recupera la llista de pel·lícules de la llista de desitjos (watchlist) des del localStorage.
    watchlist = JSON.parse(localStorage["watchlist"]);

    // Es comença a construir el codi HTML per mostrar les pel·lícules de la llista de desitjos.
    let s = ``;

    // S'itera sobre la llista de pel·lícules de la llista de desitjos per generar el contingut visual.
    for (let i = 0; i < watchlist.length; i++) {
        // Es comprova si no es tracta de la cinquena pel·lícula, en aquest cas es tanca la fila anterior i s'obre una nova fila.
            s += `<a class="card bg-light col-2 mx-1 mb-5 mt-1 link-underline link-underline-opacity-0" href="film.html?f=${watchlist[i]["id"]}" onclick="updateVisited('${watchlist[i]["id"]}', '${watchlist[i]["title"]}', '${watchlist[i]["poster"]}')">
                    <img src="${watchlist[i]["poster"]}" alt="${watchlist[i]["title"]} poster" class="img-fluid p-2">
                    <h4 class="h4">${watchlist[i]["title"]}</h4>
                </a>`;

    }

    // Es tanca la fila després d'haver afegit totes les pel·lícules de la llista de desitjos.
    s += `</div>`;

    // S'actualitza la vista de la pàgina per mostrar la llista de desitjos.
    $("#watchlist").html(s);
}

// La funció init s'executa quan el document està llest.
$(document).ready(init);