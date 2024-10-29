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
            $("#queryText").text(JSON.stringify(data));
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