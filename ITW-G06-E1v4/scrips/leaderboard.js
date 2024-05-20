// Retrieve the data from local storage
var localStorageData = localStorage.getItem("gameData");

// Check if there is data in local storage
if (localStorageData) {
  // Parse the JSON string into a JavaScript object
  var dataObject = JSON.parse(localStorageData);

  // Iterate over the keys of the object
  for (var key in dataObject) {
    if (dataObject.hasOwnProperty(key)) {
      // Access the "points" value for each key
      var points = dataObject[key][0].points;
      var timeleft= dataObject[key][0].timeLeft
      console.log("Key:", key, "Points:", points,"timeLeft",timeleft);
    }
  }
} else {
  console.log("No data found in local storage.");
}

function editCell(){
    var cell = document.querySelector("#n1.points");
    var cell2= document.querySelector("#n1.time");
    if (cell){
        cell.innerHTML=points;
    }
    if (cell2){
        cell2.innerHTML=timeleft;
    }
}

