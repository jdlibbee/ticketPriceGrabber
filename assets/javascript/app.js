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
    spotify();

})


//spotify function
function spotify() {
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
    });
    var settings2 = {
        "async": true,
        "crossDomain": true,
        "url": `https://api.spotify.com/v1/search?q=${lookup}&type=track&market=US&limit=5`,
        "method": "GET",
        "headers": {
            "Authorization": `Bearer  BQA-OxoRrlIxXk6YdKJqBY2WwpzgD9tE7U3JPAuU0Ol40uED8-HglUgc5V39VCF5VbcKOuFA67T7ITH2w7M`,
            "Cache-Control": "no-cache",
            "Postman-Token": "5f5d2a21-2c25-4f8f-9310-fff567e5cdaa"
        }
    }

    $.ajax(settings2).then(function (searchResults) {
        console.log(searchResults);
        for (var i = 0; i < searchResults.tracks.items.length; i++) {
            // if (searchResults.error.status == 401) {
            //     // var settings = {
            //     //     "async": true,
            //     //     "crossDomain": true,
            //     //     "url": "https://accounts.spotify.com/api/token",
            //     //     "method": "POST",
            //     //     "headers": {
            //     //         "Content-Type": "application/x-www-form-urlencoded",
            //     //         "Authorization": "Basic N2ExYjBjZTdiMmI3NDcyNTgxNWQ3OTQ2ZTk3ZGM5MmE6MDUzYjJiZmJjMjg0NDliMWJlNDYzNjViMzEzYWZkZjM=",
            //     //         "Cache-Control": "no-cache",
            //     //         "Postman-Token": "1a6ba0e7-3b06-429a-afe8-cbbd11e5997d"
            //     //     },
            //     //     "data": {
            //     //         "grant_type": "client_credentials"
            //     //     }
            //     // }

            //     // $.ajax(settings).done(function (authKey) {
            //     //     console.log(authKey);
            //     //     var artist = search;
            //     //     console.log(artist);
            //     //     auth = authKey.access_token;
            //     //     console.log("auth = " + auth);
            //     // });
            // } else {
            // }
            console.log(searchResults.tracks.items[i].name);
            $('#artist').html(`<h5 class="card-title">${lookup}</h5>`);
            $('#songs').html(`
                <ol class="card-text" type="1">
                    <li><button class="btn btn-light ml-2"><a href="${searchResults.tracks.items[0].preview_url}" target="_blank">${searchResults.tracks.items[0].name}</a></buttion></li>
                    <li><button class="btn btn-light ml-2"><a href="${searchResults.tracks.items[1].preview_url}" target="_blank">${searchResults.tracks.items[1].name}</a></buttion></li>
                    <li><button class="btn btn-light ml-2"><a href="${searchResults.tracks.items[2].preview_url}" target="_blank">${searchResults.tracks.items[2].name}</a></buttion></li>
                    <li><button class="btn btn-light ml-2"><a href="${searchResults.tracks.items[3].preview_url}" target="_blank">${searchResults.tracks.items[3].name}</a></buttion></li>
                    <li><button class="btn btn-light ml-2"><a href="${searchResults.tracks.items[4].preview_url}" target="_blank">${searchResults.tracks.items[4].name}</a></buttion></li>
                </ol>

                    `);
        }
    });
}