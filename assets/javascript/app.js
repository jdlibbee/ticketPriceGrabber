var lookup = "";
var auth = "";
//onclick function
$("#search").on("click", function (event) {
    event.preventDefault();
    var search = $("#artistSearch").val().trim();
    lookup = search;
    console.log(lookup);
    console.log(search);
    $("#artistSearch").attr("placeholder", "Search Artist Name").val("");
    getAuth();

})


//spotify function
function getAuth() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://accounts.spotify.com/api/token",
        "method": "POST",
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic N2ExYjBjZTdiMmI3NDcyNTgxNWQ3OTQ2ZTk3ZGM5MmE6MDUzYjJiZmJjMjg0NDliMWJlNDYzNjViMzEzYWZkZjM=",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache",
            "Postman-Token": "9db9990f-d2e7-49ed-abbc-a326d861cdb7"
        },
        "data": {
            "grant_type": "client_credentials"
        }
    }

    $.ajax(settings).done(function (authKey) {
        console.log(authKey);
        auth = authKey.access_token;
        console.log("auth = " + auth);
        getData();
    });
}
// function spotify() {
//     getData();
// }
function getData() {
    var dataSettings = {
        "async": true,
        "crossDomain": true,
        "url": `https://api.spotify.com/v1/search?q=${lookup}&type=track&market=US&limit=5`,
        "method": "GET",
        "headers": {
            "Authorization": `Bearer  ${auth}`,
            "Cache-Control": "no-cache",
            "Postman-Token": "5f5d2a21-2c25-4f8f-9310-fff567e5cdaa"
        }
    }
    console.log("hello2");
    $.ajax(dataSettings).then(function (searchResults) {
        console.log(searchResults);

        console.log(searchResults.tracks.items);

        $('#artist').html(`<h5 class="card-title">${lookup}</h5>`);
        $('#songs').html(`<ol class="card-text" id="button" type="1"></ol>`);
        for (var i = 0; i < searchResults.tracks.items.length; i++) {
            $('#button').append(`<li><button class="btn btn-light ml-2"><a href="${searchResults.tracks.items[i].preview_url}" target="_blank">${searchResults.tracks.items[i].name}</a></buttion></li>`);
        }
    }).fail(async function (jqXHR, textStatus, errorThrown) {
        alert("Request failed: " + textStatus);
        console.log(errorThrown, jqXHR);
        if (jqXHR.status == 401) {
            console.log("hello");
            await getAuth();
            getData();
        };
    })

};

