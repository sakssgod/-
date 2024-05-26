
var errors = 0;


//新东西
var matches = 0;



var points = 0; // 添加分数变量
var isFlipping = false;
var players = [
    { name: 'Player 1', account: '', errors: 0, points: 0 },
    { name: 'Player 2', account: '', errors: 0, points: 0 }
];
var currentPlayerIndex = 0;

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
var columns =5;
var card1Selected;
var card2Selected;

window.onload = function() {
    initializeBoard();
    checkLoginStatus();

    document.getElementById('player1LoginButton').onclick = function() {
        loginPlayer(0, document.getElementById('player1Account').value);
    };

    document.getElementById('player2LoginButton').onclick = function() {
        loginPlayer(1, document.getElementById('player2Account').value);
    };

    document.getElementById('startButton').onclick = function() {
        if (players[0].account && players[1].account) {
            startGame();
        } else {
            alert('Both players need to log in to start the game.');
        }
    };

    document.getElementById('resetButton').onclick = resetGame;
    document.getElementById('logoutButton').onclick = logoutUser;
    document.getElementById('flipCardButton').onclick = function() {
        flipCardFromInput();
    };
    
}


function loginPlayer(playerIndex, account) {
    if (account) {
        players[playerIndex].account = account;
        document.getElementById('userStatus').innerText = `${players[0].name}: ${players[0].account} | ${players[1].name}: ${players[1].account}`;
    } else {
        alert('Please enter a valid account.');
    }
}

//玩家设置时间




function updatePlayerDisplay() {
    document.getElementById('errors').innerText = players[currentPlayerIndex].errors;
    document.getElementById('points').innerText = players[currentPlayerIndex].points;
    document.getElementById('player1Points').innerText = players[0].points;
    document.getElementById('player1Errors').innerText = players[0].errors;
    document.getElementById('player2Points').innerText = players[1].points;
    document.getElementById('player2Errors').innerText = players[1].errors;
    document.getElementById('currentPlayerName').innerText = players[currentPlayerIndex].name;
}

//键盘翻牌逻辑
function flipCardFromInput(key = null) {
    let input;
    if (key === null) {
        input = document.getElementById('cardInput').value;
    } else {
        input = key;
    }

    let index = parseInt(input) - 1;  // 数组索引从0开始，输入是1到20，所以需要减1
    if (index >= 0 && index < 20) {
        // 计算卡片的行和列
        let row = Math.floor(index / 5);  // 因为每行5列
        let column = index % 5;

        let cardContainerId = row.toString() + "-" + column.toString();
        let cardContainer = document.querySelector(`#board .card-container[id='${cardContainerId}'] .card`);

        if (cardContainer && cardContainer.querySelector('.back').src.includes('back')) {  // 只有当卡片为背面时才触发
            flipCard(cardContainer);  // 调用flipCard函数翻转卡片
        }
    } else {
        alert("Please enter a number between 1 and 20.");
    }

    if (key === null) {
        document.getElementById('cardInput').value = '';  // 清除输入字段，准备下一次输入
    }
}



// 检查用户登录状态
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

        userStatus.textContent = 'Welcome, ' + localStorage.getItem('loggedInUser');
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

// 检查是否已登录
function isLoggedIn() {
    return localStorage.getItem('loggedInUser') !== null;
}

// 处理用户登出
function logoutUser() {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedInUserAvatar');
    alert('You have been logged out.');
    // 重置页面状态
    resetGame();
    checkLoginStatus();
}

// 初始化棋盘显示背面
function initializeBoard() {
    document.getElementById('board').innerHTML = ''; // 清空棋盘
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let card = document.createElement("img");
            card.id = r.toString() + "-" + c.toString();
            card.src = "back.jpg";  // 显示卡牌背面
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
  
    matches = 0;
    players[0].errors = 0;
    players[0].points = 0;
    players[1].errors = 0;
    players[1].points = 0;
    currentPlayerIndex = 0;
    updatePlayerDisplay();

    document.getElementById('errors').innerText = players[0].errors;
    document.getElementById('points').innerText = players[0].points;
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('resetButton').style.display = 'inline';
    startTime = new Date();


    shuffleCards();
    setupBoard();
}

// 新东西
function resetGame() {
    document.getElementById('board').innerHTML = ''; // 清空棋盘

    document.getElementById('startButton').style.display = 'inline';
    document.getElementById('resetButton').style.display = 'none';

    matches = 0;

    card1Selected = null;
    card2Selected = null;
    board = [];
    initializeBoard(); // 重新初始化棋盘
}





// 新东西
function setupBoard() {
    document.getElementById('board').innerHTML = ''; // 清空棋盘以准备新游戏
    board = []; // 清空board数组
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

// 计算游玩时间以及倒计时


//选择卡牌1和2
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



//保存用户游戏记录数据
function saveGameData(player1Errors, player1Points, player2Errors, player2Points, winner) {
    const gameData = JSON.parse(localStorage.getItem('1v1gameData')) || [];

    const gameRecord = {
        player1: {
            account: players[0].account,
            errors: player1Errors,
            points: player1Points
        },
        player2: {
            account: players[1].account,
            errors: player2Errors,
            points: player2Points
        },
        winner: winner, // 添加获胜玩家的信息
        date: new Date().toLocaleString()
    };

    gameData.push(gameRecord);
    localStorage.setItem('1v1gameData', JSON.stringify(gameData));
}



//显示用户游戏记录数据
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
            <p>Points: ${record.points}</p>
        `;
        gameDataContainer.appendChild(recordElement);
    });
}

//创建卡牌容器，创建子元素，背面卡以及正面
function createCardElement(cardImg, id) {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");
    cardContainer.id = id;  // 设置card-container的id
    
    const card = document.createElement("div");
    card.classList.add("card");
    //card.id = id;

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
        isFlipping = true; // 开始翻牌过程，禁用进一步的卡牌点击
        setTimeout(checkMatch, 600); // 等待1秒再检查匹配情况
    }
}


function checkMatch() {
    const card1Img = card1Selected.querySelector(".front").src;
    const card2Img = card2Selected.querySelector(".front").src;

    const mismatchRandomSongIndex = Math.floor(Math.random() * 4) + 1;
    const randomSongIndex = Math.floor(Math.random() * 3) + 1;
    const matchSong = document.getElementById(`match${randomSongIndex}`);
    const mismatchSong = document.getElementById(`mismatch${mismatchRandomSongIndex}`);

    const card1Container = card1Selected.parentElement;
    const card2Container = card2Selected.parentElement;

    if (card1Img === card2Img) {
        card1Container.classList.add("match-container");
        card2Container.classList.add("match-container");

        matches += 1;
        players[currentPlayerIndex].points += 1;
        document.getElementById('points').innerText = players[currentPlayerIndex].points;
        matchSong.play();

        setTimeout(() => {
            card1Container.classList.remove("match-container");
            card2Container.classList.remove("match-container");

            if (matches === 10) {
                endGame();
            }

            card1Selected = null;
            card2Selected = null;
            isFlipping = false;
        }, 600);
    } else {
        card1Container.classList.add("nomatch-container");
        card2Container.classList.add("nomatch-container");

        mismatchSong.play();

        setTimeout(() => {
            card1Container.classList.remove("nomatch-container");
            card2Container.classList.remove("nomatch-container");

            card1Selected.classList.remove("flip");
            card2Selected.classList.remove("flip");

            players[currentPlayerIndex].errors += 1;
            document.getElementById("errors").innerText = players[currentPlayerIndex].errors;

            card1Selected = null;
            card2Selected = null;
            isFlipping = false;

            // 切换到另一玩家
            currentPlayerIndex = (currentPlayerIndex + 1) % 2;
            updatePlayerDisplay();
        }, 600);
    }
}



function endGame() {
    const winner = determineWinner();
    saveGameData(players[0].errors, players[0].points, players[1].errors, players[1].points, winner);
    resetGame();
}

function determineWinner() {
    const player1 = players[0];
    const player2 = players[1];
    let winner;
    if (player1.points > player2.points || (player1.points === player2.points && player1.errors < player2.errors)) {
        alert("Player 1 wins!");
        winner = players[0].name;
    } else if (player2.points > player1.points || (player2.points === player1.points && player2.errors < player1.errors)) {
        alert("Player 2 wins!");
        winner = players[1].name;
    } else {
        alert("It's a tie!");
        winner = "No one won, It's a Tie! Both players are amazing!";
    }
    return winner;
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


