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
$("#search").on("click", function () {

})


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
var artist = "metallica";
var replace = artist.replace(" ", "-");
console.log(artist);
var queryURL = "https://api.seatgeek.com/2/events?performers.slug=" + replace + "&client_id=MTE4MzAzNjZ8MTUyODI1MDQ4OS4xOA";

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {
    for (var i = 1; i < response.events.length; i++) {

        // console.log(response);
        console.log("date/time: " + response.events[i].datetime_local);
        console.log("venue name: " + response.events[i].venue.name);
        console.log("venue state: " + response.events[i].venue.state);
        console.log("url: " + response.events[i].url);
        console.log("average price: " + response.events[i].stats.average_price);



        $('#ticketTable').append(
            "<tr>" +

            "<td> " + response.events[i].venue.name + " </td>" +
            "<td> " + response.events[i].venue.state + " </td>" +
            "<td> " + response.events[i].datetime_local + " </td>" +
            "<td>" + "$ " + response.events[i].stats.average_price + "</td>"
            // "<td></td>" +

            // "</tr>"

        )
    };
});

