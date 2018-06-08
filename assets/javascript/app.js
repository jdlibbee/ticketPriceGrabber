//onclick function
$("#search").on("click", function () {

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
            "Cache-Control": "no-cache",
            "Postman-Token": "1a6ba0e7-3b06-429a-afe8-cbbd11e5997d"
        },
        "data": {
            "grant_type": "client_credentials"
        }
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}