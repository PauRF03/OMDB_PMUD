function searchClicked(){
    let query = $("#search").val().toString();
    if(query !== ""){
        query.replace(" ", "_")
        fetch(`http://www.omdbapi.com/?t=${query}&plot=full&apikey=1140ed56`)
        .then(response => {
            if (!response.ok) {
              throw new Error('Error');
            }
            return response.json();
          })
          .then(data => {
            $("#details").html(`
              <div class="data-container">
                <h3 id="title">${data["Title"]}</h3>
                <h4 id="director">&nbsp directed by &nbsp <strong>${data["Director"]}</strong></h4>
              </div>
              <h4 id="runtime">${data["Runtime"]}</h4>
              <h4 id="year">${data["Genre"]}</h4>
              <h4 id="year">(${data["Year"]})</h4>
              <h4 id="writer">Written by ${data["Writer"]}</h4>
              <div class="data-container">
                <h6 id="plot">${data["Plot"]}</h6>
              </div>
              <div class="data-container">
                <h6 id="starring">Starring:&nbsp ${data["Actors"]}</h6>
              </div>
              <div class="data-container">
                <h6 id="awards">Awards:&nbsp ${data["Awards"]}</h6>
              </div>
            `);
            let s = `
              <img id="poster" src="${data["Poster"]}" alt="${data["Title"]} poster">
              <table id="ratings">`;
            if(data["Ratings"][0] != null){
              s += `<tr>
                  <td><a href="https://www.imdb.com/title/${data["imdbID"]}" target="_blank"><img class="logo" src="/media/imdb.svg" alt=""></a></td>
                  <td class="rating">${data["Ratings"][0]["Value"]}</td>
                </tr>`;      
            }
            if(data["Ratings"][1] != null){
              s += `<tr>
                  <td><img class="logo" src="/media/rotten_tomatoes.svg" alt=""></td>
                  <td class="rating">${data["Ratings"][1]["Value"]}</td>
                </tr>`;      
            }
            if(data["Ratings"][2] != null){
              s+= `<tr>
                  <td><img class="logo" src="/media/metacritic.svg" alt=""></td>
                  <td class="rating">${data["Ratings"][2]["Value"]} </td>
                </tr>`;      
            }
            s += `</table>`;
            $("#image-ratings").html(s);
          })
          .catch(error => {
            console.error('Error:', error);
          });
        
    }
}

function init(){
    $("#searchBtn").click(searchClicked);
}

$(document).ready(init);