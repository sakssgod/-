/* itw-2023/2024
group:06
jiayi li 62244 PL25
Oujie Wu 62228 PL25
Adriano Neves 62242 PL21 */

// Read data from local storage
const gameDataString = localStorage.getItem('gameData');
const trioGameDataString = localStorage.getItem('trioGameData');
const valuename = localStorage.getItem("loggedInUser")
// Check if data exists
if (gameDataString && trioGameDataString) {
    // Parse JSON strings into objects
    const gameData = JSON.parse(gameDataString);
    const trioGameData = JSON.parse(trioGameDataString);

    // Debug: print the read data
    console.log("Normal Game Data:", gameData);
    console.log("Trio Game Data:", trioGameData);

    // Calculate the total number of errors for a player
    const calculateTotalErrors = (playerData) => {
        return playerData.reduce((totalErrors, game) => totalErrors + game.errors, 0);
    };

    // Process player data and calculate total errors
    const processPlayerErrors = (data) => {
        const result = {};
        for (const player in data) {
            if (data.hasOwnProperty(player)) {
                result[player] = calculateTotalErrors(data[player]);
            }
        }
        return result;
    };

    // Process Normal Ranking data
    const normalPlayerErrors = processPlayerErrors(gameData);
    console.log("Normal Player Errors:", normalPlayerErrors);

    // Process Trio Ranking data
    const trioPlayerErrors = processPlayerErrors(trioGameData);
    console.log("Trio Player Errors:", trioPlayerErrors);
} else {
    console.log("No game data found in local storage.");
}

function editCell(){
    var points = document.querySelector("#n1.points");
    var time = document.querySelector("#n1.time");
    var errors = document.querySelector("#n1.wins");
    var name = document.querySelector("#n1.name")
    var dataObject = JSON.parse(gameDataString);
    
    name.innerHTML=valuename
    points.innerHTML=dataObject[valuename][0].points;
    time.innerHTML=dataObject[valuename][0].timePassed;
    errors.innerHTML =dataObject[valuename][0].errors;
}
