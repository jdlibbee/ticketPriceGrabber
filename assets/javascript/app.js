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


    $("#favoriteBody").append("<div>" + childSnapshot.val().favoriteArtist + "</div>");


}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

// $("#favorites").on("click", function (event) {


//     event.preventDefault();


//     var artistName = $("#artistSearch").val().trim();



//     database.ref().push({
//         artistName: artistName,
//         dateAdded: firebase.database.ServerValue.TIMESTAMP,
//     });

//     addToFavorites(artistName);
// });

// function addToFavorites(artistName) {
//     var queryURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${artistName}&key=AIzaSyBeCwFnkkp4dfqchIwcEIMuueNGfREt3lo`;

//     $.ajax({
//         url: queryURL,
//         method: "GET"
//     })
//         .then(function (response) {


//             console.log(response);
//             $("#favoriteBody").append("<img id=\"favorite-img\" src=\"\" alt=\"\">" + "<p>" + artistName + "</p>");
//             $("#favorite-img").attr('src', response.items[0].snippet.thumbnails.medium.url);
//             $("#favorite-img").attr('alt', artistName);
//         });

// }

//spotify function
// function spotify() {
//     var settings = {
//         "async": true,
//         "crossDomain": true,
//         "url": "https://accounts.spotify.com/api/token",
//         "method": "POST",
//         "headers": {
//             "Content-Type": "application/x-www-form-urlencoded",
//             "Authorization": "Basic N2ExYjBjZTdiMmI3NDcyNTgxNWQ3OTQ2ZTk3ZGM5MmE6MDUzYjJiZmJjMjg0NDliMWJlNDYzNjViMzEzYWZkZjM=",
//             "Cache-Control": "no-cache",
//             "Postman-Token": "1a6ba0e7-3b06-429a-afe8-cbbd11e5997d"
//         },
//         "data": {
//             "grant_type": "client_credentials"
//         }
//     }

//     $.ajax(settings).done(function (response) {
//         console.log(response);
//     });
// }


//SeatGeek Section
function seatGeek(artistName) {

    var newName = artistName.replace(" ", "-");

    var queryURL = "https://api.seatgeek.com/2/events?performers.slug=" + newName + "&client_id=MTE4MzAzNjZ8MTUyODI1MDQ4OS4xOA";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        $("#ticketTable").empty();
        // console.log(response);
        for (var i = 0; i < response.events.length; i++) {

            // console.log(response);
            // console.log("date/time: " + response.events[i].datetime_local);
            // console.log("venue name: " + response.events[i].venue.name);
            // console.log("venue state: " + response.events[i].venue.state);
            // console.log("url: " + response.events[i].url);
            // console.log("average price: " + response.events[i].stats.average_price);



            $('#ticketTable').append(
                "<tr>" +
                "<td> " + response.events[i].venue.name + " </td>" +
                "<td> " + response.events[i].venue.state + " </td>" +
                "<td> " + response.events[i].datetime_local + " </td>" +
                "<td>" + "$ " + response.events[i].stats.average_price + "</td>" +
                "<td>" + "<button>" + "Get Tickets" + "</button" + "</td>" +
                "</tr>"

            )

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
