let page = 1;
let maxPages = 1;
let query = "";
let films = [];
localStorage["recentlyVisited"] = localStorage["recentlyVisited"] || JSON.stringify(films);

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
    films.push({
        id,
        title,
        poster
    });
    if (films.length > 5) films = films.slice(1, 6);
    localStorage["recentlyVisited"] = JSON.stringify(films);
    initRecentlyVisited();
}

function initRecentlyVisited(){
    let s = `<h3 class="text-light pb-2"><strong>Recent searches</strong></h3>`;
    for(let i = films.length - 1; i >= 0; i--){
        s += `<a class="card bg-light col-2 ms-3" href="film.html?f=${films[i]["id"]}">
                <img src="${films[i]["poster"]}" alt="${films[i]["title"]} poster" class="img-fluid p-2">
                <h6 class="h6">${films[i]["title"]}</h4>
            </div>
        </a>`
    }
    $("#recentlyVisited").html(s);
}

function loadResults() {
    if (query !== "") {
        fetch(`http://www.omdbapi.com/?s=${query.replace(" ", "_")}&page=${page}&apikey=1140ed56`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error');
                }
                return response.json();
            })
            .then(data => {
                $("#recentlyVisited").html("");
                maxPages = Math.ceil(data["totalResults"] / 10);
                if (data["Response"] === "True") {
                    let s = `<h3 class="text-light pb-2"><strong>Results for "${query}"</strong></h3>`;
                    for (let i = 0; i < data["Search"].length; i++) {
                        s += `<div class="row card-fluid bg-light m-2 rounded align-self-center">`;
                        if (data["Search"][i]["Poster"] === "N/A") {
                            s += `<img class="col-2 rounded p-2 img-thumbnail img-fluid b-0" src="/media/no-image.png" alt="No image"</img>`
                        } else {
                            s += `<img class="col-2 rounded p-2 img-thumbnail img-fluid b-0" src=${data["Search"][i]["Poster"]} alt="${data["Search"][i]["Title"]} poster"</img>`
                        }
                        s += `<a class="col-10 blockquote pl-4 pt-4" href="film.html?f=${data["Search"][i]["imdbID"]}" target="_blank" onclick="updateVisited('${data["Search"][i]["imdbID"]}', '${data["Search"][i]["Title"]}', '${data["Search"][i]["Poster"]}')"><h2><strong>${data["Search"][i]["Title"]} (${data["Search"][i]["Year"]})</strong><br/>${data["Search"][i]["Type"]}</h2></a></div>`;
                    }
                    $("#searchResult").html(s);
                    let f = `<div class="row me-2 ms-2 mb-2 p-3" id="upper_container">
                        <div class="col-3 justify-content-end align-items-center input-group" id="pageSelectorSection">
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
    loadResults();
}


function init() {
    $("#searchBtn").click(searchClicked);
    $("#search").on('keypress', function (e) {
        if (e.keyCode == 13) searchClicked();
    });
    films = JSON.parse(localStorage["recentlyVisited"]);
    initRecentlyVisited();
}

$(document).ready(init);