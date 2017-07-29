$(document).ready(function () {
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDhSiPM4j-ZFEtJ8UktDeMuB6BJwdTfYio",
    authDomain: "portkey-pass-scheduler.firebaseapp.com",
    databaseURL: "https://portkey-pass-scheduler.firebaseio.com",
    projectId: "portkey-pass-scheduler",
    storageBucket: "",
    messagingSenderId: "22210828612"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  $("#submit-port").on("click", function (event) {
    event.preventDefault();

    var portName = $("#portkey-name-input").val().trim();
    var portDest = $("#destination-input").val().trim();
    var portFirst = moment($("#first-input").val().trim(), "HH:mm").format("");
    var portFreq = $("#freq-input").val().trim();

    var portObj = {
      name: portName,
      destination: portDest,
      first: portFirst,
      frequency: portFreq
    };

    database.ref().push(portObj);

    alert("New portkey has been registered!");

    $("#portkey-name-input").val("");
    $("#destination-input").val("");
    $("#first-input").val("");
    $("#freq-input").val("");
  });

  database.ref().on("child_added", function (childSnapshot, prevChildKey) {
    var portName = childSnapshot.val().name;
    var portDest = childSnapshot.val().destination;
    var portFirst = childSnapshot.val().first;
    var portFreq = childSnapshot.val().frequency;

    var diffTime = moment().diff(moment(portFirst), "minutes");

    var remainderTime = diffTime % portFreq;
    var untilTime = portFreq - remainderTime;

    var portNext = moment().add(untilTime, "minutes");
    var portNextConv = moment(portNext).format("hh:mm A");

    var minAway = moment(portNext).diff(moment(), "minutes");

    $("#portkey-table > tbody").append("<tr><td>" + portName + "</td><td>" + portDest + "</td><td>" + portFreq + "</td><td>" + portNextConv + "</td><td>" + minAway + "</td></tr>");
  });
});
