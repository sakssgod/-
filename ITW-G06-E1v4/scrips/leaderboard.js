//const local=localStorage.getItem("gameData")
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
      
      console.log("Key:", key, "Points:", points);
    }
  }
} else {
  console.log("No data found in local storage.");
}

function editCell(){
    var cell = document.querySelector("#n1.points");

    if (cell){
        cell.innerHTML=points;
    }
}