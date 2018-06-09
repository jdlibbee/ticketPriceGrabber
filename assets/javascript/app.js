//Firebase
var config = {
    apiKey: "AIzaSyCqEnzaaYtKA0jk5bRBoCxs0HolhFlOwFA",
    authDomain: "ticket-price-grabber-6f86d.firebaseapp.com",
    databaseURL: "https://ticket-price-grabber-6f86d.firebaseio.com",
    projectId: "ticket-price-grabber-6f86d",
    storageBucket: "",
    messagingSenderId: "34076773600"
};
firebase.initializeApp(config);

var database = firebase.database();

var lookup = "";
var auth = "";



//onclick function
$("#search").on("click", function (event) {


    event.preventDefault();


    var artistName = $("#artistSearch").val().trim();



    database.ref().push({
        artistName: artistName,
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
    });
    seatGeek(artistName);
    youtubeResponse(artistName);
    lookup = artistName;
    $("#artistSearch").attr("placeholder", "Search Artist Name").val("");
    getAuth();



});

$("#favorites").on("click", function (event) {
    event.preventDefault();


    var favoriteArtist = $("#artistSearch").val().trim();



    database.ref().push({
        favoriteArtist: favoriteArtist,
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
    });


});

database.ref().on("child_added", function (childSnapshot) {

    if (childSnapshot.val().favoriteArtist) {
        $("#favoriteBody").append("<div>" + childSnapshot.val().favoriteArtist + "</div>");
    }



}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});


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

//SeatGeek Section
function seatGeek(artistName) {

    var newName = artistName.replace(" ", "-");

    // var replace = artist.replace(" ", "-");
    // console.log(artist);
    var queryURL = "https://api.seatgeek.com/2/events?performers.slug=" + newName + "&client_id=MTE4MzAzNjZ8MTUyODI1MDQ4OS4xOA";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response.events)
        $("#ticketTable").empty();

        if (response.events.length === 0) {
            $('#ticketTable').append(
                "<tr>" +
                "<td> " + "No results Found." + " </td>")
        } else {

            for (var i = 0; i < response.events.length; i++) {
                // console.log(response);
                // console.log("date/time: " + response.events[i].datetime_local);
                // console.log("venue name: " + response.events[i].venue.name);
                // console.log("venue state: " + response.events[i].venue.state);
                // console.log("url: " + response.events[i].url);
                // console.log("average price: " + response.events[i].stats.average_price);


                $('#ticketTable').append(
                    "<tr>" +
                    "<td> " + "<a href=" + response.events[i].venue.url + " target=\"blank\" id=\"venueLinks\">" + response.events[i].venue.name + "</a>" + " </td>" +
                    "<td> " + response.events[i].venue.state + " </td>" +
                    "<td> " + response.events[i].datetime_local.slice(0, -9) + " </td>" +
                    "<td>" + "$ " + response.events[i].stats.average_price + "</td>" +
                    "<td>" + "<button> <a href=" + response.events[i].url + " target=\"blank\">Get Tickets</a> </button>" + "</td>" +
                    "</tr>"

                )
            }
        };
    });
}
//YouTube section

function youtubeResponse(artistName) {

    var queryURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${artistName}&key=AIzaSyBeCwFnkkp4dfqchIwcEIMuueNGfREt3lo`;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(response);
            if (response == null || response.items.length < 1) {
                $("#youTubeBody").html("you suck!"); // change html to display a message showing no videos for the artist searched.
                return;
            }
            $("#youTubeBody").empty();

            var itemNumber = 0;
            $("#youTubeBody").append("<iframe id=\"yt-player\" type=\"text/html\" width=\"100%\" height=\"350px\" src=\"\" frameborder=\"0\"></iframe>"
                + "<button type=\"submit\" class=\"btn btn-secondary ml-2\" id=\"next-video\">Next Video</button>");

            $("#yt-player").attr('src', "https://www.youtube.com/embed/" + response.items[itemNumber].id.videoId + "?autoplay=1")

            $("#next-video").on("click", function (event) {

                event.preventDefault();
                itemNumber++
                if (itemNumber == 10) {
                    itemNumber = 0;
                    $("#yt-player").attr('src', "https://www.youtube.com/embed/" + response.items[itemNumber].id.videoId + "?autoplay=1")
                }
                else {
                    $("#yt-player").attr('src', "https://www.youtube.com/embed/" + response.items[itemNumber].id.videoId + "?autoplay=1")
                }


            });

        });

}
