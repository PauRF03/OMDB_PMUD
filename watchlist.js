let films = []

function init() {
    /*$("#searchBtn").click(searchClicked);
    $("#search").on('keypress', function (e) {
        if (e.keyCode == 13) searchClicked();
    });*/
    films = JSON.parse(localStorage["watchlist"]);
    for(let i = 0; i < films.length; i++){
        if(i % 5 != 0){

        }else{
            
        }
    }
}

$(document).ready(init);