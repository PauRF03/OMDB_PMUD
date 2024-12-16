// Es declaren variables globals per emmagatzemar la informació de la pel·lícula.
let imdbID, poster, title;
let watchlist = [];

// Funció per a quan l'usuari fa clic al botó de cerca.
function searchClicked() {
  // Es recupera la consulta de cerca del camp d'entrada i es neteja el camp.
  let query = $("#search").val().toString();
  $("#search").val("");  // Esborra el contingut de l'input de cerca.

  // Es redirigeix a la pàgina de cerca passant la consulta com a paràmetre a la URL.
  location.href = `search.html?q=${query.replace(" ", "_").replace(".", "")}`
}

// Funció per gestionar el clic al checkbox de la llista de desitjos.
function checkboxListener(){
  // Es comprova si el checkbox està marcat.
  if($("#watchlist").is(':checked')){
    // Si la pel·lícula ja està a la llista de desitjos, es treu per evitar duplicats.
    for(let i = 0; i < watchlist.length; i++) if(watchlist[i].id === imdbID) watchlist.splice(i, 1);
  
    // Es afegeix la pel·lícula a la llista de desitjos.
    watchlist.push({
        id: imdbID,
        title,
        poster
    });
    bootstrap.Toast.getOrCreateInstance($("#liveToast")).show()
  } else {
    // Si el checkbox no està marcat, es treu la pel·lícula de la llista de desitjos.
    for(let i = 0; i < watchlist.length; i++) if(watchlist[i].id === imdbID) watchlist.splice(i, 1);
  }
  // La llista de desitjos actualitzada es guarda al localStorage.
  localStorage["watchlist"] = JSON.stringify(watchlist);
}

// Funció per inicialitzar la pàgina quan es carrega.
function init() {
  // Es carrega la llista de desitjos des del localStorage (si existeix).
  watchlist = JSON.parse(localStorage["watchlist"]);
  
  // Es recupera l'IMDb ID de la URL (passat com a paràmetre 'f').
  imdbID = new URLSearchParams(window.location.search).get('f');
  
  // Es comprova si aquesta pel·lícula ja està a la llista de desitjos i, si és així, es marca el checkbox.
  for(let i = 0; i < watchlist.length; i++) {
    if(watchlist[i].id === imdbID) {
      $("#watchlist").prop("checked", true);
      break;
    }
  }

  // Es connecten els esdeveniments als elements de la pàgina.
  $("#searchBtn").click(searchClicked);  // Quan es fa clic al botó de cerca.
  $("#watchlist").click(checkboxListener);  // Quan es fa clic al checkbox de la llista de desitjos.
  
  // Es permet que la cerca es realitzi quan s'prem la tecla Enter.
  $("#search").on('keypress', function (e) {
    if (e.keyCode == 13) searchClicked();  // 13 és el codi de la tecla Enter.
  });

  // Es fa una petició a l'API OMDB per obtenir la informació de la pel·lícula.
  fetch(`https://www.omdbapi.com/?i=${imdbID}&plot=full&apikey=1140ed56`)
    .then(response => {
      // Es comprova si la resposta és correcta.
      if (!response.ok) {
        throw new Error('Error');
      }
      return response.json();
    })
    .then(data => {
      // Si la resposta és vàlida (pel·lícula trobada), es mostra la informació.
      if (data["Response"] === "True") {
        document.title = data["Title"];  // S'actualitza el títol de la pàgina amb el nom de la pel·lícula.
        title = data["Title"];
        
        // Es genera el HTML per mostrar la informació de la pel·lícula.
        let d = `<div class="pt-2 row-fluid mb-3 align-text-bottom">
                  <h2 class="text-light col-auto my-auto"><strong>${data["Title"]} (${data["Year"]})</strong></h3>
                `;
        
        // Si la pel·lícula té un director, es mostra.
        if (data["Director"] !== "N/A") {
          d += `<h4 class="text-light col-auto my-auto">directed by <strong class="fs-3">${data["Director"]}</strong></h4>`;
        }
        d += `</div>`;
        
        // Si la pel·lícula té una durada, es mostra.
        if (data["Runtime"] !== "N/A") {
          d += `<div class="row-fluid badge text-bg-success mb-3">
                  <h5 class="text-light col-auto text-align-center">${data["Runtime"]}</h5>
                </div>`;
        }
        
        // Es mostra la informació de gèneres si n'hi ha.
        if (data["Genre"] !== "N/A") {
          d += `<div class="row-fluid mb-3">
                  <h5 class="text-light col-auto text-align-center">${data["Genre"]}</h5>
                </div>`;
        }
        
        // Es mostra el guionista si n'hi ha.
        if (data["Writer"] !== "N/A") {
          d += `<div class="row-fluid mb-3">
                  <h5 class="text-light col-auto text-align-center">Written by ${data["Writer"]}</h5>
                </div>`;
        }
        
        // Es mostra el resum si existeix.
        if (data["Plot"] !== "N/A") {
          d += `<div class="row-fluid mb-3">
                  <h5 class="text-light col-auto text-align-center lh-base">${data["Plot"]}</h5>
                </div>`;
        }
        
        // Es mostra la llista d'actors si existeix.
        if (data["Actors"] !== "N/A") {
          d += `<div class="row-fluid mb-3">
                  <h5 class="text-light col-auto text-align-center">Starring: ${data["Actors"]}</h5>
                </div>`;
        }
        
        // Es mostra premis o guardons si n'hi ha.
        if (data["Awards"] !== "N/A") {
          d += `<div class="row-fluid mb-3">
                  <h5 class="text-light col-auto text-align-center">Awards: ${data["Awards"]}</h5>
                </div>`;
        }
        
        // Es mostra la informació d'efectes comercials si existeix.
        if (data["BoxOffice"] !== "N/A") {
          d += `<div class="row-fluid mb-3">
                  <h5 class="text-light col-auto text-align-center">Earnings: ${data["BoxOffice"]}</h5>
                </div>`;
        }
        
        // La informació es mostra a la pàgina.
        $("#details").html(d);
        
        // Es genera el contingut per mostrar la imatge de la pel·lícula i les valoracions.
        let s = ``;
        if (data["Poster"] === "N/A") {
          poster = "/media/no-image.png";
          s += `<img id="poster" src="/media/no-image.png" alt="$No poster">`
        } else {
          poster = data["Poster"];
          s += `<img id="poster" src="${poster}" alt="${data["Title"]} poster">`
        }
        
        // Es mostren les valoracions si existeixen.
        if (data["Ratings"].length != 0) {
          s += `<table class="w-parent table-responsive" id="ratings">`;
          if (data["Ratings"][0] != null) {
            s += `<tr>
                    <td><a href="https://www.imdb.com/title/${data["imdbID"]}" target="_blank"><img class="logo" src="media/imdb.png" alt=""></a></td>
                    <td class="rating">${data["Ratings"][0]["Value"]} (${data["imdbVotes"]}  votes)</td>
                  </tr>`;
          }
          if (data["Ratings"][1] != null) {
            s += `<tr>
                    <td><a href="https://www.rottentomatoes.com/m/${data["Title"].toLowerCase().replace(/[\W_]+/g, "_")}" target="_blank"><img class="logo" src="media/rotten_tomatoes.png" alt=""></a></td>
                    <td class="rating">${data["Ratings"][1]["Value"]}</td>
                  </tr>`;
          }
          if (data["Ratings"][2] != null) {
            s += `<tr>
                    <td><a href="https://www.metacritic.com/movie/${data["Title"].toLowerCase().replace(/[^a-zA-Z0-9\-]+/g, "-")}" target="_blank"><img class="logo" src="media/metacritic.png" alt=""></a></td>
                    <td class="rating">${data["Ratings"][2]["Value"]}</td>
                  </tr>`;
          }
          s += `</table>`;
        }
        
        // Es mostra la taula de valoracions a la pàgina.
        $("#image-ratings").html(s);
      } else {
        // Si no es troba la pel·lícula, es mostra un missatge d'error.
        $("#details").html("<h3 class='text-light'>Pel·lícula no trobada!</h3>");
      }
    })
    .catch(error => {
      // Si hi ha algun error amb la petició, es mostra un missatge d'error.
      $("#details").html("<h3 class='text-light'>Error al carregar la informació de la pel·lícula!</h3>");
    });
}

// S'invoca la funció init quan la pàgina es carrega.
$(document).ready(init);