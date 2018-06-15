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
var artists = [];
var userId = '';
var userLoggedIn = false;

function getFavorites() {
    database.ref('User/' + userId).on("child_added", function (childSnapshot) {

        let artist = childSnapshot.val().favoriteArtist;

        if (artist && artists.indexOf(artist.toLowerCase()) < 0) {

            var artistDiv = $(`<div class="card" style="width: 18rem; align-self: center; margin-bottom: 20px;" id="fav-` + artist.replace(' ', '') + `">
            <img class="card-img-top" src="${childSnapshot.val().artistImage}" alt="${artist}" id="artistImage">
            <div class="card-body"><h5 class="card-title" id="artistName">${artist}</h5></div></div>`);
            artistDiv.on("click", onArtistClicked);

            $("#faveTable").append(artistDiv);

            artists.push(artist.toLowerCase());

        }

    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
}

function onArtistClicked(event) {
    var artistName = event.currentTarget.innerText;

    var url = window.location.href;

    var newUrl = url.replace('favorites.html', 'index.html?artist=' + artistName.replace(' ', '+'));

    window.location = newUrl;
};

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

    getFavorites();
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        window.location.reload();
    });
}