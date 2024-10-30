function searchClicked(){
    let query = $("#search").val().toString();
    if(query !== ""){
        query.replace(" ", "_")
        fetch(`http://www.omdbapi.com/?t=${query}&apikey=1140ed56`)
        .then(response => {
            if (!response.ok) {
              throw new Error('Error');
            }
            return response.json();
          })
          .then(data => {
            $("#details").html(`
              <h3 id="title">${data["Title"]}</h3>
              <h4 id="director">&nbsp directed by &nbsp <strong>${data["Director"]}</strong></h4>
              <h6 id="plot">${data["Plot"]}</h6>
            `);
            $("#image-ratings").html(`
              <img id="poster" src="${data["Poster"]}" alt="${data["Title"]} poster">
              <table id="ratings">
                <tr>
                  <td><a href="https://www.imdb.com/title/${data["imdbID"]}" target="_blank"><img class="logo" src="/media/imdb.svg" alt=""></a></td>
                  <td class="rating">${data["Ratings"][0]["Value"]}</td>
                </tr>
                <tr>
                  <td><img class="logo" src="/media/rotten_tomatoes.svg" alt=""></td>
                  <td class="rating">${data["Ratings"][1]["Value"]}</td>
                </tr>
                <tr>
                  <td><img class="logo" src="/media/metacritic.svg" alt=""></td>
                  <td class="rating">${data["Ratings"][2]["Value"]} </td>
                </tr>
              </table>
              `);
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