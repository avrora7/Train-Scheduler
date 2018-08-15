var config = {
  apiKey: "AIzaSyBI59aPKRw6i0neIp-OPePIkSPWSy-5g28",
  authDomain: "fir-test-2a0ff.firebaseapp.com",
  databaseURL: "https://fir-test-2a0ff.firebaseio.com",
  projectId: "fir-test-2a0ff",
  storageBucket: "fir-test-2a0ff.appspot.com",
  messagingSenderId: "682334390973"
};
firebase.initializeApp(config);

var database = firebase.database()

var trainName;
var destination;
var frequency;
var firstTrainTime;

$("#submit").on("click", function (event) {
  event.preventDefault();

  trainName = $("#trainName").val().trim();
  destination = $("#destination").val().trim();
  frequency = parseInt($("#frequency").val().trim());
  firstTrainTime = $("#firstTrainTime").val().trim(); 
  
  if (trainName == "") {
    alert("Enter train name");
    return;
  }

  if (destination == "") {
    alert("Enter destination");
    return;
  }

  if (!moment($("#firstTrainTime").val().trim(), "HH:mm").isValid()) {
    alert("Enter a valid first train time (HH:mm)");
    return;
  }

  if (Number.isNaN(frequency)) {
    alert("Frequency must be a number");
    return;
  }

  if (frequency <= 0) {
    alert("Frequency must be bigger than 0");
    return;
  }

  database.ref().push({
    trainName: trainName,
    destination: destination,
    frequency: frequency,
    firstTrainTime: firstTrainTime,
  });

});

database.ref().on("child_added", function(event) {

  console.log(JSON.stringify(event));

  var newRow = $("<tr>")
  var tdTrainName = $("<td>")
  tdTrainName.text(event.val().trainName)
  var tdDestination = $("<td>")
  tdDestination.text(event.val().destination)
  var tdFrequency = $("<td>")
  tdFrequency.text(event.val().frequency)
  var tdNextArrival = $("<td>")

    var firstTimeConverted = moment(event.val().firstTrainTime, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    console.log(JSON.stringify(currentTime));
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % event.val().frequency;
    var tMinutesTillTrain = event.val().frequency - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format('LT');
  
  tdNextArrival.text(nextTrain) 
  var tdMinutesAway = $("<td>")
  tdMinutesAway.text(tMinutesTillTrain)
  newRow.append(tdTrainName, tdDestination, tdFrequency, tdNextArrival, tdMinutesAway)
  $("tbody").append(newRow)
})
