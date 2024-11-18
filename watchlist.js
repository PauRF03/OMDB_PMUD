let watchlist = [];
let films = [];
localStorage["watchlist"] = localStorage["watchlist"] || JSON.stringify(watchlist);

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

function searchClicked() {
    let query = $("#search").val().toString();
    $("#search").val("");
    location.href = `search.html?q=${query.replace(" ", "_").replace(".", "")}`
}

function init() {
    $("#searchBtn").click(searchClicked);
    films = JSON.parse(localStorage["recentlyVisited"]);
    $("#search").on('keypress', function (e) {
        if (e.keyCode == 13) searchClicked();
    });
    watchlist = JSON.parse(localStorage["watchlist"]);
    let s =``;
    for (let i = 0; i < watchlist.length; i++) {
        if (i % 5 != 0) {
            s += `<a class="card bg-light col-2 ms-3" href="film.html?f=${watchlist[i]["id"]}" onclick="updateVisited('${watchlist[i]["id"]}', '${watchlist[i]["title"]}', '${watchlist[i]["poster"]}')">
                    <img src="${watchlist[i]["poster"]}" alt="${watchlist[i]["title"]} poster" class="img-fluid p-2">
                    <h6 class="h6">${watchlist[i]["title"]}</h4>
            </a>`
        } else {
            s += `
                <a class="card bg-light col-2 ms-3" href="film.html?f=${watchlist[i]["id"]}" onclick="updateVisited('${watchlist[i]["id"]}', '${watchlist[i]["title"]}', '${watchlist[i]["poster"]}')">
                    <img src="${watchlist[i]["poster"]}" alt="${watchlist[i]["title"]} poster" class="img-fluid p-2">
                    <h6 class="h6">${watchlist[i]["title"]}</h4>
                </div>
            </a>`
        }
    }
    $("#watchlist").html(s);
}

$(document).ready(init);