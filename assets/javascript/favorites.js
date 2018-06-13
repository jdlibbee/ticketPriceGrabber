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

database.ref().on("child_added", function (childSnapshot) {
    $(document).ready(function () {

        if (childSnapshot.val().favoriteArtist) {
            $("#favoriteBody").append(`<div class="form-inline justify-content-center" id="favoriteArtist">
            <img src="${childSnapshot.val().artistImage}" alt="${childSnapshot.val().favoriteArtist}">
            <h1>${childSnapshot.val().favoriteArtist}</h1>
            </div>`);
        }
    })



}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});
