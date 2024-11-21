let query;
let films = [];
let page = 1;
let maxPages = 1;

function firstPage() {
    page = 1;
    loadResults();
}

function lastPage() {
    page = maxPages;
    loadResults();
}

function nextPage() {
    if (page != maxPages) page++;
    loadResults();
}

function prevPage() {
    if (page != 1) page--;
    loadResults();
}

function updateVisited(id, title, poster) {
    for (let i = 0; i < films.length; i++) if (films[i].id === id) films.splice(i, 1);
    films.push({
        id,
        title,
        poster
    });
    if (films.length > 5) films = films.slice(1, 6);
    localStorage["recentlyVisited"] = JSON.stringify(films);
}

function loadResults() {
    if (query !== "") {
        fetch(`https://www.omdbapi.com/?s=${query}&page=${page}&apikey=1140ed56`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error');
                }
                return response.json();
            })
            .then(data => {
                maxPages = Math.ceil(data["totalResults"] / 10);
                if (data["Response"] === "True") {
                    let s = `
                            <div class="row-fluid justify-content-end input-group py-2" id="pageSelectorSection">
                                <h3 class="text-light me-auto col-auto"><strong>${data["totalResults"]} results</strong></h3>
                                <div class="col-auto btn-group h-auto">
                                    <button class="btn btn-secondary" onclick="firstPage()" id="firstPage">1</button> 
                                    <button class="btn btn-secondary" onclick="prevPage()" id="prevPage">Previous page</button>
                                    <button class="btn btn-secondary" onclick="nextPage()" id="nextPage">Next page</button>
                                    <button class="btn btn-secondary" onclick="lastPage()" id="lastPage">${maxPages}</button>
                                </div>
                            </div>`;
                    for (let i = 0; i < data["Search"].length; i++) {
                        s += `<div class="row card-fluid bg-light m-2 rounded align-self-center">`;
                        if (data["Search"][i]["Poster"] === "N/A") {
                            s += `<img class="col-2 rounded p-2 img-thumbnail img-fluid b-0" src="/media/no-image.png" alt="No image"</img>`
                        } else {
                            s += `<img class="col-2 rounded p-2 img-thumbnail img-fluid b-0" src=${data["Search"][i]["Poster"]} alt="${data["Search"][i]["Title"]} poster"</img>`
                        }
                        s += `
                            <div class="col-10">
                                <a class="blockquote pl-4 pt-4" href="film.html?f=${data["Search"][i]["imdbID"]}" onclick="updateVisited('${data["Search"][i]["imdbID"]}', '${data["Search"][i]["Title"]}', '${data["Search"][i]["Poster"]}')">
                                    <h2 class="row-auto"><strong>${data["Search"][i]["Title"]} (${data["Search"][i]["Year"]})</strong></h2>
                                </a>
                                <h4 class="row-auto">${data["Search"][i]["Type"].charAt(0).toUpperCase() + data["Search"][i]["Type"].slice(1)}</h4>
                            </div>
                        </div>`;
                    }
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
                    $("#lower_container").html(f);
                    $("#selectPage").on('keypress', function (e) {
                        if (e.keyCode == 13) {
                            let req = $("#selectPage").val();
                            if (req >= 1 && req <= maxPages) {
                                page = req;
                            }
                            loadResults();
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

function searchClicked() {
    page = 1;
    maxPages = 1;
    query = $("#search").val().toString();
    $("#search").val("");
    location.href = `search.html?q=${query.replace(" ", "_").replace(".", "")}`;
}

function init() {
    query = new URLSearchParams(window.location.search).get('q');
    films = JSON.parse(localStorage["recentlyVisited"]);
    $("#searchBtn").click(searchClicked);
    $("#search").on('keypress', function (e) {
        if (e.keyCode == 13) searchClicked();
    });
    loadResults();
}

$(document).ready(init);