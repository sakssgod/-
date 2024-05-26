<<<<<<< HEAD
=======
/* itw-2023/2024
grupo:06
jiayi li 62244 PL25
Oujie Wu 62228 PL25
Adriano Neves 62242 PL21 */

>>>>>>> c515123c01500ba76f0fd94dcfa9ab3dc64df064
var errors = 0;

// New feature
var matches = 0;
var totalGameTime = 60; // Total time for the game in seconds
var timer = null;
var startTime = null;
var points = 0; // Add score variable
var isFlipping = false;

var cardList = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10"
]

var cardSet;
var board = [];
var rows = 4;
var columns = 5;
var card1Selected;
var card2Selected;

window.onload = function() {
    // shuffleCards();
    // startGame();

    initializeBoard();  // Initialize board showing the back side
    // Check if user is logged in
    checkLoginStatus();
    document.getElementById('startButton').onclick = function() {
        if (isLoggedIn()) {
            startGame();
        } else {
            alert('Please login or register to start the game.');
        }
    };
    document.getElementById('resetButton').onclick = resetGame;
    document.getElementById('logoutButton').onclick = logoutUser;
    initializeBoard();  // Initialize board showing the back side

    // Add button event listeners
    document.getElementById('flipCardButton').onclick = function() {
        flipCardFromInput();
    };

    // Add event listener
    document.getElementById('setTimeButton').onclick = setGameTime;
}

// Player sets time
function setGameTime() {
    var newTime = parseInt(document.getElementById('gameTimeInput').value);
    if (newTime >= 20 && newTime <= 3600) {
        totalGameTime = newTime;
        document.getElementById('timeLeft').innerText = totalGameTime.toString();
    } else {
        alert("Please enter a time between 20 and 3600 seconds.");
    }
}

function disableTimeSetting() {
    document.getElementById('gameTimeInput').disabled = true;
    document.getElementById('setTimeButton').disabled = true;
}

function enableTimeSetting() {
    document.getElementById('gameTimeInput').disabled = false;
    document.getElementById('setTimeButton').disabled = false;
}

// Card flipping logic with keyboard input
function flipCardFromInput(key = null) {
    let input;
    if (key === null) {
        input = document.getElementById('cardInput').value;
    } else {
        input = key;
    }

    let index = parseInt(input) - 1;  // Array index starts from 0, input is from 1 to 20, so we need to subtract 1
    if (index >= 0 && index < 20) {
        // Calculate card's row and column
        let row = Math.floor(index / 5);  // Each row has 5 columns
        let column = index % 5;

        let cardContainerId = row.toString() + "-" + column.toString();
        let cardContainer = document.querySelector(`#board .card-container[id='${cardContainerId}'] .card`);

        if (cardContainer && cardContainer.querySelector('.back').src.includes('back')) {  // Only trigger if the card is face down
            flipCard(cardContainer);  // Call flipCard function to flip the card
        }
    } else {
        alert("Please enter a number between 1 and 20.");
    }

    if (key === null) {
        document.getElementById('cardInput').value = '';  // Clear input field for next input
    }
}

// Check user login status
function checkLoginStatus() {
    const userStatus = document.getElementById('userStatus');
    const signInMenu = document.getElementById('signInMenu');
    const logoutMenu = document.getElementById('logoutMenu');
    const userProfile = document.getElementById('userProfile');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const profileMenu = document.getElementById('profileMenu');
    const gameplayHistoryMenu = document.getElementById('gameplayHistoryMenu');
    
    if (isLoggedIn()) {
        const loggedInUser = localStorage.getItem('loggedInUser');
        const loggedInUserAvatar = localStorage.getItem('loggedInUserAvatar');

        // Print the value of loggedInUserAvatar to console
        // console.log('loggedInUserAvatar:', loggedInUserAvatar);
        
        userStatus.textContent = 'Welcome, ' + loggedInUser;
        userAvatar.src = loggedInUserAvatar || '/FLIPCARD_GAME/images/NoneUser.jpeg';
        userName.textContent = loggedInUser;
        
        signInMenu.style.display = 'none';
        logoutMenu.style.display = 'inline';
        userProfile.style.display = 'inline';
        profileMenu.style.display = 'inline';
        gameplayHistoryMenu.style.display = 'inline';
        displayGameData(); // Add call
    } else {
        userStatus.textContent = 'You are not logged in.';
        userAvatar.src = '/FLIPCARD_GAME/images/NoneUser.jpeg';
        userName.textContent = 'Guest';

        signInMenu.style.display = 'inline';
        logoutMenu.style.display = 'none';
        userProfile.style.display = 'none';
        profileMenu.style.display = 'none';
        gameplayHistoryMenu.style.display = 'none';
        document.getElementById('gameDataContainer').innerHTML = ''; // Clear game data
    }
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('loggedInUser') !== null;
}

// Handle user logout
function logoutUser() {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedInUserAvatar');
    alert('You have been logged out.');
    // Reset page state
    resetGame();
    checkLoginStatus();
}

// Initialize board showing the back side of the cards
function initializeBoard() {
    document.getElementById('board').innerHTML = ''; // Clear the board
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let card = document.createElement("img");
            card.id = r.toString() + "-" + c.toString();
            card.src = "back.jpg";  // Show card back side
            card.classList.add("card");
            document.getElementById('board').appendChild(card);
        }
    }
}

function shuffleCards() {
    cardSet = cardList.concat(cardList); // two of each card
    for (let i = cardSet.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [cardSet[i], cardSet[j]] = [cardSet[j], cardSet[i]]; // ES6 destructuring
    }
    console.log(cardSet);
}

function startGame() {
    disableTimeSetting(); // Disable time setting

    matches = 0;
    errors = 0;
    points = 0; // Reset score
    document.getElementById('errors').innerText = errors;
    document.getElementById('points').innerText = points; // Update score display
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('resetButton').style.display = 'inline';
    startTime = new Date();
    timer = setInterval(updateTimer, 1000);
    shuffleCards();
    setupBoard();
}

// New feature
function resetGame() {
    enableTimeSetting(); // Enable time setting

    document.getElementById('board').innerHTML = ''; // Clear the board
    clearInterval(timer);
    document.getElementById('startButton').style.display = 'inline';
    document.getElementById('resetButton').style.display = 'none';
    document.getElementById('timePassed').innerText = '0';
    document.getElementById('timeLeft').innerText = totalGameTime.toString();
    matches = 0; // Reset matches
    errors = 0; // Reset errors
    points = 0; // Reset score
    document.getElementById('errors').innerText = errors;
    document.getElementById('points').innerText = points; // Update score display
    
    // Reset selected cards
    card1Selected = null;
    card2Selected = null;

    board = []; // Clear the board array again
    initializeBoard();  // Reinitialize board showing the back side after reset
}

// New feature
function setupBoard() {
    document.getElementById('board').innerHTML = ''; // Clear the board for a new game
    board = []; // Clear the board array
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let cardImg = cardSet.pop();
            row.push(cardImg); // JS

            let cardElement = createCardElement(cardImg, r.toString() + "-" + c.toString());
            document.getElementById("board").appendChild(cardElement);
        }
        board.push(row);
    }
}

function hideCards() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let card = document.getElementById(r.toString() + "-" + c.toString());
            card.src = "back.jpg";
        }
    }
}

// Calculate play time and countdown
function updateTimer() {
    let now = new Date();
    let elapsed = Math.floor((now - startTime) / 1000);
    let timeLeft = totalGameTime - elapsed;
    document.getElementById('timePassed').innerText = elapsed.toString();
    document.getElementById('timeLeft').innerText = timeLeft.toString();
    
    if (timeLeft <= 0) {
        clearInterval(timer);
        alert("Time's up! Game over.");
        saveGameData(errors, elapsed, timeLeft, points);
        resetGame();
    }
}

// Select cards 1 and 2
function selectCard() {
    if (this.src.includes("back")) {
        if (!card1Selected) {
            card1Selected = this;

            let coords = card1Selected.id.split("-"); //"0-1" -> ["0", "1"]
            let r = parseInt(coords[0]);
            let c = parseInt(coords[1]);

            card1Selected.src = board[r][c] + ".jpg";
        }
        else if (!card2Selected && this != card1Selected) {
            card2Selected = this;

            let coords = card2Selected.id.split("-"); //"0-1" -> ["0", "1"]
            let r = parseInt(coords[0]);
            let c = parseInt(coords[1]);

            card2Selected.src = board[r][c] + ".jpg";
            setTimeout(update, 1000);
        }
    }
}

// Save user game record data
function saveGameData(errors, timePassed, timeLeft, points) {
    if (!isLoggedIn()) return;

    const loggedInUser = localStorage.getItem('loggedInUser');
    const gameData = JSON.parse(localStorage.getItem('gameData')) || {};

    if (!gameData[loggedInUser]) {
        gameData[loggedInUser] = [];
    }

    const gameRecord = {
        errors: errors,
        timePassed: timePassed,
        timeLeft: timeLeft,
        points: points,
        date: new Date().toLocaleString()
    };

    gameData[loggedInUser].push(gameRecord);
    localStorage.setItem('gameData', JSON.stringify(gameData));

    displayGameData();
}

// Display user game record data
function displayGameData() {
    const gameDataContainer = document.getElementById('gameDataContainer');
    gameDataContainer.innerHTML = '';

    if (!isLoggedIn()) return;

    const loggedInUser = localStorage.getItem('loggedInUser');
    const gameData = JSON.parse(localStorage.getItem('gameData')) || {};

    if (!gameData[loggedInUser] || gameData[loggedInUser].length === 0) {
        gameDataContainer.innerHTML = '<p>No game data available.</p>';
        return;
    }

    gameData[loggedInUser].forEach(record => {
        const recordElement = document.createElement('div');
        recordElement.className = 'game-record';
        recordElement.innerHTML = `
            <p>Date: ${record.date}</p>
            <p>Errors: ${record.errors}</p>
            <p>Time Passed: ${record.timePassed} seconds</p>
            <p>Time Left: ${record.timeLeft} seconds</p>
            <p>Points: ${record.points}</p>
        `;
        gameDataContainer.appendChild(recordElement);
    });
}

// Create card container, add children, back and front cards
function createCardElement(cardImg, id) {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");
    cardContainer.id = id;  // Set card-container id
    
    const card = document.createElement("div");
    card.classList.add("card");

    const front = document.createElement("img");
    front.classList.add("front");
    front.src = cardImg + ".jpg";

    const back = document.createElement("img");
    back.classList.add("back");
    back.src = "back.jpg";

    card.appendChild(front);
    card.appendChild(back);
    cardContainer.appendChild(card);

    card.addEventListener("click", () => flipCard(card));

    return cardContainer;
}

function flipCard(card) {
    if (isFlipping || card.classList.contains("flip")) {
        return;
    }

    card.classList.add("flip");

    if (!card1Selected) {
        card1Selected = card;
    } else if (!card2Selected) {
        card2Selected = card;
        isFlipping = true; // Start flipping process, disable further card clicks
        setTimeout(checkMatch, 600); // Wait 1 second before checking for a match
    }
}

function checkMatch() {
    // Define the front card in the class "card" as card1Img
    const card1Img = card1Selected.querySelector(".front").src;
    const card2Img = card2Selected.querySelector(".front").src;

    // Add logic to randomly play a song
    // Add logic to randomly play an extra song
    const mismatchRandomSongIndex = Math.floor(Math.random() * 4) + 1;  // Randomly choose 1, 2, or 3
    const randomSongIndex = Math.floor(Math.random() * 3) + 1;  
    const matchSong = document.getElementById(`match${randomSongIndex}`);
    const mismatchSong = document.getElementById(`mismatch${mismatchRandomSongIndex}`);

    // Define the parent element of card1selected, which is the class "card-container", as card1Container
    const card1Container = card1Selected.parentElement;
    const card2Container = card2Selected.parentElement;
    
    // When the front cards 1 and 2 in the class "card" are the same
    if (card1Img === card2Img) {
        // Add CSS to the class "card-container"
        card1Container.classList.add("match-container");
        card2Container.classList.add("match-container");

        matches += 1;
        points += 1;
        document.getElementById('points').innerText = points;
        // Play success match sound
        matchSong.play();
        // Remove added CSS to avoid bugs
        setTimeout(() => {
            card1Container.classList.remove("match-container");
            card2Container.classList.remove("match-container");
            
            // When all 10 cards are matched
            if (matches === 10) {
                clearInterval(timer);
                alert("Congratulations! You've matched all cards!");
                saveGameData(errors, Math.floor((new Date() - startTime) / 1000), totalGameTime - Math.floor((new Date() - startTime) / 1000), points);
                resetGame();
            }

            card1Selected = null;
            card2Selected = null;
            isFlipping = false; // End flipping process, allow further card clicks
        }, 600);

    // When front cards are not the same
    } else {
        // Add CSS
        card1Container.classList.add("nomatch-container");
        card2Container.classList.add("nomatch-container");

        // Play fail match sound
        mismatchSong.play();

        // Remove CSS
        setTimeout(() => {
            card1Container.classList.remove("nomatch-container");
            card2Container.classList.remove("nomatch-container");

            card1Selected.classList.remove("flip");
            card2Selected.classList.remove("flip");

            errors += 1;
            document.getElementById("errors").innerText = errors;

            card1Selected = null;
            card2Selected = null;
            isFlipping = false; // End flipping process, allow further card clicks
        }, 600);
    }
}

function update() {
    // If cards aren't the same, flip both back
    if (card1Selected.src === card2Selected.src) {
        matches += 1; // Increase match count
        points += 1; // Increase score
        document.getElementById('points').innerText = points; // Update score display
        
        if (matches === 10) {
            clearInterval(timer);
            alert("Congratulations! You've matched all cards!");
            saveGameData(errors, Math.floor((new Date() - startTime) / 1000), totalGameTime - Math.floor((new Date() - startTime) / 1000), points);
            resetGame();
        }
    } else {
        card1Selected.src = "back.jpg";
        card2Selected.src = "back.jpg";
        errors += 1;
        document.getElementById("errors").innerText = errors;
    }

    card1Selected = null;
    card2Selected = null;
}

document.addEventListener('DOMContentLoaded', function() {
    const themeButton = document.getElementById('themeButton');
    const themeOptions = document.getElementById('themeOptions');

    themeButton.addEventListener('click', function() {
        if (themeOptions.style.display === 'none') {
            themeOptions.style.display = 'block';
        } else {
            themeOptions.style.display = 'none';
        }
    });
});
