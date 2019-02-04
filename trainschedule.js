// Initialize Firebase
var config = {
  apiKey: "AIzaSyA69IP48TowTveB1sGyR1jZuPMVzgi0fNw",
  authDomain: "trainschedule-af0f3.firebaseapp.com",
  databaseURL: "https://trainschedule-af0f3.firebaseio.com",
  projectId: "trainschedule-af0f3",
  storageBucket: "trainschedule-af0f3.appspot.com",
  messagingSenderId: "719105102819"
};

firebase.initializeApp(config);

var database = firebase.database();

//Create on.click to grab all the data from the new train form
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  //User input
  var trainName = $("#train-name-input").val().trim();
  var trainDest = $("#destination-input").val().trim();
  var trainFirst =moment($("#first-train-input").val().trim(), "HH:mm").subtract(1, "years").format("X");
  var trainFreq = $("#frequency-input").val().trim();

  //Put the data in an object to send to the database
  var newTrain = {
    train: trainName,
    destination: trainDest,
    first: trainFirst,
    frequency: trainFreq
  };

  //Uploads the object to the database
  database.ref().push(newTrain);

  //Console logging
  console.log(newTrain.train);
  console.log(newTrain.destination);
  console.log(newTrain.first);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  //Clears each of the form boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");

});

//Create a way to send the data to the database and creates a row
database.ref().on("child_added", function (childSnapshot) {

  console.log(childSnapshot.val());

  //storing everything into a variable  
  var trainName = childSnapshot.val().train;
  var trainDest = childSnapshot.val().destination;
  var trainFirst = childSnapshot.val().first;
  var trainFreq = childSnapshot.val().frequency;

  //train info
  console.log(trainName);
  console.log(trainDest);
  console.log(trainFirst);
  console.log(trainFreq);

  //Difference between now and the first train, divided by (modulus) the train frequency
  var trainDiff = moment().diff(moment.unix(trainFirst), "minutes") % trainFreq;
  console.log(trainDiff);

  //Minutes until arrive is the train frequency - trainDiff
  var trainMin = trainFreq - trainDiff;
  // console.log(trainMin);

  // To calculate the arrival time, add the minutes to the next train to the currrent time
  var trainArrive = moment().add(trainMin, "m").format("hh:mm A");
  // console.log(trainArrive);

  //createing new rows
var newRow = $("<tr>").append(
  $("<td>").text(trainName),
  $("<td>").text(trainDest),
  $("<td>").text(trainFreq),
  $("<td>").text(trainArrive),
  $("<td>").text(trainMin),
);

//append to the schedule table
$("#schedule-table > tbody").append(newRow);


})

