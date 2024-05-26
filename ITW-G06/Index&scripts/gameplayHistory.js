document.addEventListener("DOMContentLoaded", function() {
    const avatars = document.querySelectorAll(".avatar");
    const loggedInUserAvatar = localStorage.getItem('loggedInUserAvatar');
    
    avatars.forEach((avatar) => {
        avatar.src = loggedInUserAvatar || '/FLIPCARD_GAME/images/NoneUser.jpeg';
    });
    
    // Populate game data tables
    populateGameDataTable('normalModeTable', 'gameData');
    populateGameDataTable('trioModeTable', 'trioGameData');
    
    // Check login status and other initialization
    checkLoginStatus();
});

// Function to populate game data tables
function populateGameDataTable(tableId, storageKey) {
    const tableBody = document.getElementById(tableId).querySelector('tbody');
    const loggedInUser = localStorage.getItem('loggedInUser');
    const gameData = JSON.parse(localStorage.getItem(storageKey)) || {};
    
    if (!gameData[loggedInUser] || gameData[loggedInUser].length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="6">No game data available.</td>';
        tableBody.appendChild(emptyRow);
        return;
    }
    
    gameData[loggedInUser].forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img class="avatar" src="${localStorage.getItem('loggedInUserAvatar') || '/FLIPCARD_GAME/images/NoneUser.jpeg'}" alt="Avatar"></td>
            <td>${record.errors}</td>
            <td>${record.timePassed}</td>
            <td>${record.timeLeft}</td>
            <td>${record.points}</td>
            <td>${record.date}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Existing checkLoginStatus function
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

        userStatus.textContent = 'Welcome, ' + loggedInUser;
        userAvatar.src = loggedInUserAvatar || '/FLIPCARD_GAME/images/NoneUser.jpeg';
        userName.textContent = loggedInUser;
        
        signInMenu.style.display = 'none';
        logoutMenu.style.display = 'inline';
        userProfile.style.display = 'inline';
        profileMenu.style.display = 'inline';
        gameplayHistoryMenu.style.display = 'inline';
        displayGameData(); // 新增调用
    } else {
        userStatus.textContent = 'You are not logged in.';
        userAvatar.src = '/FLIPCARD_GAME/images/NoneUser.jpeg';
        userName.textContent = 'Guest';

        signInMenu.style.display = 'inline';
        logoutMenu.style.display = 'none';
        userProfile.style.display = 'none';
        profileMenu.style.display = 'none';
        gameplayHistoryMenu.style.display = 'none';
        document.getElementById('gameDataContainer').innerHTML = ''; // 清空游戏数据
    }
}

// Function to check if the user is logged in
function isLoggedIn() {
    return localStorage.getItem('loggedInUser') !== null;
}
