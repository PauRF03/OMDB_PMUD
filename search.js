let query;
let films = [];
let page = 1;
let maxPages = 1;

// Funció per establir la pàgina actual a la primera pàgina i carregar els resultats.
const firstPage = () => {
    page = 1;
    loadResults();
}

// Funció per establir la pàgina actual a la última pàgina i carregar els resultats.
const lastPage = () => {
    page = maxPages;
    loadResults();
}

// Funció per passar a la pàgina següent, si no és la pàgina màxima.
const nextPage = () => {
    if (page != maxPages) page++;
    loadResults();
}

// Funció per passar a la pàgina anterior, si no és la primera pàgina.
const prevPage = () => {
    if (page != 1) page--;
    loadResults();
}

// Funció per actualitzar la llista de pel·lícules visitades recentment al localStorage.
function updateVisited(id, title, poster) {
    // S'itera sobre la llista de pel·lícules per trobar la pel·lícula amb el mateix ID i eliminar-la.
    for (let i = 0; i < films.length; i++) if (films[i].id === id) films.splice(i, 1);
    // S'afegeix la nova pel·lícula a la llista.
    films.push({
        id,
        title,
        poster
    });
    // Si la llista té més de 5 pel·lícules, es manté només les 5 més recents.
    if (films.length > 5) films = films.slice(1, 6);
    localStorage["recentlyVisited"] = JSON.stringify(films);
}

// Funció per carregar els resultats de la cerca des de l'API de OMDb.
function loadResults() {
    if (query !== "") { // Si hi ha una consulta de cerca.
        fetch(`https://www.omdbapi.com/?s=${query}&page=${page}&apikey=1140ed56`) // Es fa una petició a l'API d'OMDb.
            .then(response => {
                if (!response.ok) { // Si la resposta no és correcta, es llança un error.
                    throw new Error('Error');
                }
                return response.json(); // Si la resposta és correcta, es converteix a JSON.
            })
            .then(data => {
                // Es calcula el nombre màxim de pàgines a partir del total de resultats.
                maxPages = Math.ceil(data["totalResults"] / 10);
                if (data["Response"] === "True") { // Si la resposta de l'API és correcta.
                    let s = `
                            <div class="row-fluid justify-content-end input-group my-3" id="pageSelectorSection">
                                <h3 class="text-light me-auto col-auto self-align-center"><strong>${data["totalResults"]} results</strong></h3>
                                <div class="col-auto btn-group h-auto">
                                    <button class="btn btn-secondary" onclick="firstPage()" id="firstPage">1</button> 
                                    <button class="btn btn-secondary" onclick="prevPage()" id="prevPage">Previous page</button>
                                    <button class="btn btn-secondary" onclick="nextPage()" id="nextPage">Next page</button>
                                    <button class="btn btn-secondary" onclick="lastPage()" id="lastPage">${maxPages}</button>
                                </div>
                            </div>`;
                    // S'itera sobre els resultats de la cerca i es construeix el codi HTML per mostrar-los.
                    for (let i = 0; i < data["Search"].length; i++) {
                        s += `<a class="blockquote mt-2 pl-4 pt-4 link-underline link-underline-opacity-0" href="film.html?f=${data["Search"][i]["imdbID"]}" onclick="updateVisited('${data["Search"][i]["imdbID"]}', '${data["Search"][i]["Title"]}', '${data["Search"][i]["Poster"]}')">
                            <div class="row card-fluid bg-light m-3 rounded align-self-center">`;
                        // Si no hi ha pòster, es mostra una imatge per defecte.
                        if (data["Search"][i]["Poster"] === "N/A") {
                            s += `<img class="col-2 rounded p-2 img-thumbnail img-fluid b-0" src="/media/no-image.png" alt="No image"</img>`
                        } else {
                            s += `<img class="col-2 rounded p-2 img-thumbnail img-fluid b-0" src=${data["Search"][i]["Poster"]} alt="${data["Search"][i]["Title"]} poster"</img>`
                        }
                        s += `<div class="col-10 text-dark">
                                <h1 class="h1 row-auto"><strong>${data["Search"][i]["Title"]} (${data["Search"][i]["Year"]})</strong></h1>
                                <h3 class="h3 row-auto">${data["Search"][i]["Type"].charAt(0).toUpperCase() + data["Search"][i]["Type"].slice(1)}</h3>
                            </div>
                        </div>
                        </a>`;
                    }
                    // S'actualitza la secció de resultats de la cerca a la pàgina.
                    $("#searchResult").html(s);
                    let f = `<div class="p-3" id="upper_container">
                        <div class="justify-content-end align-items-center input-group" id="pageSelectorSection">
                            <div class="btn-group">
                                <button class="btn btn-secondary" onclick="firstPage()" id="firstPage">1</button> 
                                <button class="btn btn-secondary" onclick="prevPage()" id="prevPage">Previous page</button>
                                <button class="btn btn-secondary" onclick="nextPage()" id="nextPage">Next page</button>
                                <button class="btn btn-secondary" onclick="lastPage()" id="lastPage">${maxPages}</button>
                            </div>
                            <input class="rounded input-group-text text-align-left ms-3" min="0" type="number" name="selectPage" id="selectPage" placeholder="Select page (1-${maxPages})">
                        </div>
                    </div>`;
                    // S'actualitza la secció inferior de la pàgina amb els controls de navegació per les pàgines.
                    $("#lower_container").html(f);
                    // S'afegeix un esdeveniment per al camp d'entrada de pàgina per permetre la selecció directa de pàgines.
                    $("#selectPage").on('keypress', function (e) {
                        if (e.keyCode == 13) { // Si es prem la tecla Enter.
                            let req = $("#selectPage").val();
                            // Si el número de pàgina introduït és vàlid, es canvia la pàgina actual.
                            if (req >= 1 && req <= maxPages) {
                                page = req;
                            }
                            loadResults(); // Es carreguen els resultats per a la nova pàgina.
                        }
                    });
                }
            })
            .catch(error => {
                // Si es produeix un error durant la petició, es mostra un missatge d'error.
                console.error('Error:', error);
            });
    }
}

// Funció que es crida quan es fa clic al botó de cerca.
function searchClicked() {
    page = 1;
    maxPages = 1;
    query = $("#search").val().toString();
    $("#search").val("");
    // Es redirigeix a la pàgina de resultats amb el terme de cerca.
    location.href = `search.html?q=${query.replace(" ", "_").replace(".", "")}`;
}

// Funció que s'executa quan la pàgina es carrega.
function init() {
    // Es recupera el terme de cerca des de la URL (paràmetre `q`).
    query = new URLSearchParams(window.location.search).get('q');
    films = JSON.parse(localStorage["recentlyVisited"]);
    $("#searchBtn").click(searchClicked);
    $("#search").on('keypress', function (e) {
        if (e.keyCode == 13) searchClicked();
    });
    // Es carreguen els resultats de la cerca.
    loadResults();
}

// Inicialitza la pàgina quan el document està llest.
$(document).ready(init);