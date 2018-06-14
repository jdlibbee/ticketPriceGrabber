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

var userId = '';

//Google Auth
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    userLoggedIn = true;
    var userImage = profile.getImageUrl();
    userId = profile.getId();
    $(".g-signin2").html(`<img src=${userImage} id="userImage"></img>`);

    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        window.location.reload();
    });
}

var lookup = "";
var auth = "";
var userLoggedIn = false;

// // trying to create url for a favorite click
$("document").ready(function () {
    var url = window.location.href;
    var urlSelections = url.split('?');
    if (urlSelections.length > 1) {
        var parameter = urlSelections[1].split('=');
        if (parameter.length <= 1)
            return;
        if (parameter[0] != 'artist')
            return;
    }
    var artistName = parameter[1].replace('+', ' ');
    getApis(artistName);
});
var albumImage = "";


//onclick function
$("#search").on("click", function (event) {


    event.preventDefault();


    var artistName = $("#artistSearch").val().trim();

    getApis(artistName);
    $("#favorites").show();
});

$("#favorites").on("click", function (event) {
    event.preventDefault();


    var favoriteArtist = lookup;
    var artistImage = albumImage;
    console.log(favoriteArtist);

    if (favoriteArtist == '')
        return;

    database.ref('User/' + userId).push({
        favoriteArtist: favoriteArtist,
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
        artistImage: artistImage,
        userId: userId,
    });

});

//Check for login before entering favorites page
$("#starIcon").on("click", function (event) {
    event.preventDefault();

    if (userLoggedIn === false) {
        $("#exampleModal").modal('show');
    } else {
        window.open("favorites.html", "_self");
    }

});

function getApis(artistName) {

    if (artistName === "") {
        return;
    }

    seatGeek(artistName);
    youtubeResponse(artistName);
    lookup = artistName;
    $("#artistSearch").attr("placeholder", "Search Artist Name").val("");
    getAuth();


}
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
        albumImage = searchResults.tracks.items[0].album.images[1].url;
        console.log(searchResults.tracks.items[0].album.images[1].url);
        console.log("Hello 3");

        $('#artist').html(`<h5 class="card-title" id="artistTitle">${lookup}  <hr></hr></h5>`);
        $('#songs').html(`<div class="card-text" id="button" type="1"></div><hr></hr>`);
        $('#player').html(`<iframe class="song-play" src="https://open.spotify.com/embed?uri=${searchResults.tracks.items[0].uri}" width="100%" height="350" frameborder="0" allowtransparency="true"></iframe>`);

        // for (var i = 0; i < searchResults.tracks.items.length; i++) {
        //     $('#button').append(`<button class="btn btn-light ml-2" id="songButton" data-id="${searchResults.tracks.items[i].uri}">${searchResults.tracks.items[i].name}</buttion>`);
        // }
        $('#button').append(`<button class="btn btn-light ml-2" id="buttonOne" data-id="${searchResults.tracks.items[0].uri}">${searchResults.tracks.items[0].name}</buttion>`);
        $('#button').append(`<button class="btn btn-light ml-2" id="buttonTwo" data-id="${searchResults.tracks.items[1].uri}">${searchResults.tracks.items[1].name}</buttion>`);
        $('#button').append(`<button class="btn btn-light ml-2" id="buttonThree" data-id="${searchResults.tracks.items[2].uri}">${searchResults.tracks.items[2].name}</buttion>`);
        $('#button').append(`<button class="btn btn-light ml-2" id="buttonFour" data-id="${searchResults.tracks.items[3].uri}">${searchResults.tracks.items[3].name}</buttion>`);
        $('#button').append(`<button class="btn btn-light ml-2" id="buttonFive" data-id="${searchResults.tracks.items[4].uri}">${searchResults.tracks.items[4].name}</buttion>`);

        $("#buttonOne").on("click", function (event) {
            event.preventDefault();
            $('#player').html(`<ol class="card-text" id="button" type="1"></ol><hr></hr> <iframe class="song-play" src="https://open.spotify.com/embed?uri=${searchResults.tracks.items[0].uri}" width="100%" height="380" frameborder="0" allowtransparency="true"></iframe>`);
        })
        $("#buttonTwo").on("click", function (event) {
            event.preventDefault();
            $('#player').html(`<ol class="card-text" id="button" type="1"></ol><hr></hr> <iframe class="song-play" src="https://open.spotify.com/embed?uri=${searchResults.tracks.items[1].uri}" width="100%" height="380" frameborder="0" allowtransparency="true"></iframe>`);
        })
        $("#buttonThree").on("click", function (event) {
            event.preventDefault();
            $('#player').html(`<ol class="card-text" id="button" type="1"></ol><hr></hr> <iframe class="song-play" src="https://open.spotify.com/embed?uri=${searchResults.tracks.items[2].uri}" width="100%" height="380" frameborder="0" allowtransparency="true"></iframe>`);
        })
        $("#buttonFour").on("click", function (event) {
            event.preventDefault();
            $('#player').html(`<ol class="card-text" id="button" type="1"></ol><hr></hr> <iframe class="song-play" src="https://open.spotify.com/embed?uri=${searchResults.tracks.items[3].uri}" width="100%" height="380" frameborder="0" allowtransparency="true"></iframe>`);
        })
        $("#buttonFive").on("click", function (event) {
            event.preventDefault();
            $('#player').html(`<ol class="card-text" id="button" type="1"></ol><hr></hr> <iframe class="song-play" src="https://open.spotify.com/embed?uri=${searchResults.tracks.items[4].uri}" width="100%" height="380" frameborder="0" allowtransparency="true"></iframe>`);
        })


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
                $("#youTubeBody").html("No video results for your search.");
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
