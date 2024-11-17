let films = [];
localStorage["recentlyVisited"] = localStorage["recentlyVisited"] || JSON.stringify(films);

function clearVisited() {
    films = []
    localStorage["recentlyVisited"] = JSON.stringify(films);
    initRecentlyVisited();
}

function updateVisited(id, title, poster) {
    for(let i = 0; i < films.length; i++) if(films[i].id === id) films.splice(i, 1);
    films.push({
        id,
        title,
        poster
    });
    if (films.length > 5) films = films.slice(1, 6);
    localStorage["recentlyVisited"] = JSON.stringify(films);
}

function initRecentlyVisited() {
    $("#searchResult").html("");
    $("#lower_container").html("");
    $("#recentlyVisited").html("");
    if (films.length > 0) {
        let s = `<div class="row-fluid d-flex pb-4">
                    <h3 class="text-light col-auto d-inline-block me-auto"><strong>Recent searches</strong></h3>
                    <button class="btn btn-danger col-auto d-inline-block justify-self-end" onclick="clearVisited()" id="nextPage">Clear</button>
                </div>`;
        for (let i = films.length - 1; i >= 0; i--) {
            s += `<a class="card bg-light col-2 ms-3" href="film.html?f=${films[i]["id"]}" onclick="updateVisited('${films[i]["id"]}', '${films[i]["title"]}', '${films[i]["poster"]}')">
                <img src="${films[i]["poster"]}" alt="${films[i]["title"]} poster" class="img-fluid p-2">
                <h6 class="h6">${films[i]["title"]}</h4>
            </div>
        </a>`
        }
        $("#recentlyVisited").html(s);
    }
}

function searchClicked() {
    let query = $("#search").val().toString();
    $("#search").val("");
    location.href = `search.html?q=${query.replace(" ", "_").replace(".", "")}`
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