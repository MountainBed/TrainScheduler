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
    var regex = /([01]\d|2[0-3]):([0-5]\d)/;

    if (regex.test(portFirst)) {
      var portObj = {
        name: portName,
        destination: portDest,
        first: portFirst,
        frequency: portFreq
      };

      database.ref().push(portObj);

      $("#portkey-name-input").val("");
      $("#destination-input").val("");
      $("#first-input").val("");
      $("#freq-input").val("");

      alert("New portkey has been registered!");
    } else {
      alert("First Portkey is not a valid time. Please enter your time in military time.");
      $("#first-input").val("");
    }
  });

  database.ref().on("child_added", function (childSnapshot, prevChildKey) {
    var portName = childSnapshot.val().name;
    var portDest = childSnapshot.val().destination;
    var portFirst = childSnapshot.val().first;
    var portFreq = childSnapshot.val().frequency;

    var diffTime = moment().diff(moment(portFirst), "minutes");
    console.log(diffTime);

    var remainderTime = diffTime % portFreq;
    var untilTime = portFreq - remainderTime;

    var portNext = moment().add(untilTime, "minutes");
    var portNextConv = moment(portNext).format("hh:mm A");

    var minAway = moment(portNext).diff(moment(), "minutes");

    if (diffTime <= 0) {
      portNextConv = moment(portFirst).format("hh:mm A");
      minAway = Math.abs(diffTime);
    }

    $("#portkey-table > tbody").append("<tr><td>" + portName + "</td><td>" + portDest + "</td><td>" + portFreq + "</td><td>" + portNextConv + "</td><td>" + minAway + "</td></tr>");
  });
});
