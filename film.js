let imdbID, poster, title;
let watchlist = [];

function searchClicked() {
  let query = $("#search").val().toString();
  $("#search").val("");
  location.href = `search.html?q=${query.replace(" ", "_").replace(".", "")}`
}

function checkboxListener(){
  if($("#watchlist").is(':checked')){
    for(let i = 0; i < watchlist.length; i++) if(watchlist[i].id === imdbID) watchlist.splice(i, 1);
    watchlist.push({
        id: imdbID,
        title,
        poster
    });
    localStorage["watchlist"] = JSON.stringify(watchlist);
  }else{
    for(let i = 0; i < watchlist.length; i++) if(watchlist[i].id === imdbID) watchlist.splice(i, 1);
    localStorage["watchlist"] = JSON.stringify(watchlist);
  }
}

function init() {
  watchlist = JSON.parse(localStorage["watchlist"]);
  imdbID = new URLSearchParams(window.location.search).get('f');
  for(let i = 0; i < watchlist.length; i++) {
    if(watchlist[i].id === imdbID) {
      $("#watchlist").prop("checked", true);
      break;
    }
  }
  $("#searchBtn").click(searchClicked);
  $("#watchlist").click(checkboxListener);
  $("#search").on('keypress', function (e) {
    if (e.keyCode == 13) searchClicked();
  });
  fetch(`httsp://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=1140ed56`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error');
      }
      return response.json();
    })
    .then(data => {
      if (data["Response"] === "True") {
        document.title = data["Title"];
        title = data["Title"];
        let d = `<div class="pt-2 row-fluid mb-3 align-text-bottom">
                  <h2 class="text-light col-auto my-auto"><strong>${data["Title"]} (${data["Year"]})</strong></h3>
                `;
        if (data["Director"] !== "N/A") {
          d += `<h4 class="text-light col-auto my-auto">directed by <strong class="fs-3">${data["Director"]}</strong></h4>`;
        }
        d += `</div>`;
        if (data["Runtime"] !== "N/A") {
          d += `<div class="row-fluid badge text-bg-success mb-3">
                  <h5 class="text-light col-auto text-align-center">${data["Runtime"]}</h5>
                </div>`;
        }
        if (data["Genre"] !== "N/A") {
          d += `<div class="row-fluid mb-3">
                  <h5 class="text-light col-auto text-align-center">${data["Genre"]}</h5>
                </div>`;
        }
        if (data["Writer"] !== "N/A") {
          d += `<div class="row-fluid mb-3">
                  <h5 class="text-light col-auto text-align-center">Written by ${data["Writer"]}</h5>
                </div>`;
        }
        if (data["Plot"] !== "N/A") {
          d += `<div class="row-fluid mb-3">
                  <h5 class="text-light col-auto text-align-center lh-base">${data["Plot"]}</h5>
                </div>`;
        }
        if (data["Actors"] !== "N/A") {
          d += `<div class="row-fluid mb-3">
                  <h5 class="text-light col-auto text-align-center">Starring: ${data["Actors"]}</h5>
                </div>`;
        }
        if (data["Awards"] !== "N/A") {
          d += `<div class="row-fluid mb-3">
                  <h5 class="text-light col-auto text-align-center">Awards: ${data["Awards"]}</h5>
                </div>`;
        }
        if (data["BoxOffice"] !== "N/A") {
          d += `<div class="row-fluid mb-3">
                  <h5 class="text-light col-auto text-align-center">Earnings: ${data["BoxOffice"]}</h5>
                </div>`;
        }
        $("#details").html(d);
        let s = ``;
        if (data["Poster"] === "N/A") {
          poster = "/media/no-image.png";
          s += `<img id="poster" src="/media/no-image.png" alt="$No poster">`
        } else {
          poster = data["Poster"];
          s += `<img id="poster" src="${data["Poster"]}" alt="${data["Title"]} poster">`
        }
        if (data["Ratings"].length != 0) {
          s += `<table class="w-parent table-responsive" id="ratings">`;
          if (data["Ratings"][0] != null) {
            s += `<tr>
                    <td><a href="https://www.imdb.com/title/${data["imdbID"]}" target="_blank"><img class="logo" src="/media/imdb.svg" alt=""></a></td>
                    <td class="rating">${data["Ratings"][0]["Value"]} (${data["imdbVotes"]}  votes)</td>
                  </tr>`;
          }
          if (data["Ratings"][1] != null) {
            s += `<tr>
                    <td><a href="https://www.rottentomatoes.com/m/${data["Title"].toLowerCase().replace(/[\W_]+/g, "_")}" target="_blank"><img class="logo" src="/media/rotten_tomatoes.svg" alt=""></a></td>
                    <td class="rating">${data["Ratings"][1]["Value"]}</td>
                  </tr>`;
          }
          if (data["Ratings"][2] != null) {
            s += `<tr>
                    <td><a href="https://www.metacritic.com/movie/${data["Title"].toLowerCase().replace(/[^a-zA-Z0-9\-]+/g, "-")}" target="_blank"><img class="logo" src="/media/metacritic.svg" alt=""></a></td>
                    <td class="rating">${data["Ratings"][2]["Value"]} </td>
                  </tr>`;
          }
          s += `</table>`;
        }
        $("#image-ratings").html(s);
      } else {
        $("#image-ratings").html("");
        $("#details").html("");
        $("#film").html(`<h2 id="error">${data["Error"]}</h2>`);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

$(document).ready(init);