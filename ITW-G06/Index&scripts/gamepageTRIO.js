/* itw-2023/2024
grupo:06
jiayi li 62244 PL25
Oujie Wu 62228 PL25
Adriano Neves 62242 PL21 */
var errors = 0;


//新东西
var matches = 0;
var totalGameTime = 60; // Total time for the game in seconds
var timer = null;
var startTime = null;
var points = 0; // 添加分数变量
var isFlipping = false;
var trioGameData = {}; // 新的字典，用于保存玩家的游戏数据



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
var rows = 5;
var columns = 6;
var card1Selected;
var card2Selected;
var card3Selected;

window.onload = function() {
    // shuffleCards();
    // startGame();

    initializeBoard();  // 初始化棋盘显示背面
    // 检查用户是否已登录
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
    initializeBoard();  // 初始化棋盘显示背面

    // 新增按钮事件监听器
    document.getElementById('flipCardButton').onclick = function() {
        flipCardFromInput();
    };

    // 新增的事件监听器
    document.getElementById('setTimeButton').onclick = setGameTime;
}

//玩家设置时间
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

//键盘翻牌逻辑
//键盘翻牌逻辑
function flipCardFromInput(key = null) {
    let input;
    if (key === null) {
        input = document.getElementById('cardInput').value;
    } else {
        input = key;
    }

    let index = parseInt(input) - 1;  // 数组索引从0开始，输入是1到30，所以需要减1
    if (index >= 0 && index < 30) {
        // 计算卡片的行和列
        let row = Math.floor(index / 6);  // 因为每行6列
        let column = index % 6;

        let cardContainerId = row.toString() + "-" + column.toString();
        let cardContainer = document.querySelector(`#board .card-container[id='${cardContainerId}'] .card`);

        if (cardContainer && cardContainer.querySelector('.back').src.includes('back')) {  // 只有当卡片为背面时才触发
            flipCard(cardContainer);  // 调用flipCard函数翻转卡片
        }
    } else {
        alert("Please enter a number between 1 and 30.");
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
    if (isLoggedIn()) {
        userStatus.textContent = 'Welcome, ' + localStorage.getItem('loggedInUser');
        signInMenu.style.display = 'none';
        logoutMenu.style.display = 'inline';
        displayTrioGameData(); // 新增调用
    } else {
        userStatus.textContent = 'You are not logged in.';
        signInMenu.style.display = 'inline';
        logoutMenu.style.display = 'none';
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
    cardSet = cardList.concat(cardList).concat(cardList); // 三张相同的卡牌
    for (let i = cardSet.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [cardSet[i], cardSet[j]] = [cardSet[j], cardSet[i]]; // ES6 destructuring
    }
    console.log(cardSet);
}


function startGame() {

    disableTimeSetting(); // 禁用时间设置

    matches = 0;
    errors = 0;
    points = 0; // 重置分数
    document.getElementById('errors').innerText = errors;
    document.getElementById('points').innerText = points; // 更新分数显示
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('resetButton').style.display = 'inline';
    startTime = new Date();
    timer = setInterval(updateTimer, 1000);
    shuffleCards();
    setupBoard();
}

// 新东西
function resetGame() {
    enableTimeSetting(); // 启用时间设置

    document.getElementById('board').innerHTML = ''; // 清空棋盘
    clearInterval(timer);
    document.getElementById('startButton').style.display = 'inline';
    document.getElementById('resetButton').style.display = 'none';
    document.getElementById('timePassed').innerText = '0';
    document.getElementById('timeLeft').innerText = totalGameTime.toString();
    matches = 0; // Reset matches
    errors = 0; // Reset errors
    points = 0; // 重置分数
    document.getElementById('errors').innerText = errors;
    document.getElementById('points').innerText = points; // 更新分数显示
    
    // 重置选中的卡牌
    card1Selected = null;
    card2Selected = null;

    board = []; // 再次清空board数组
    initializeBoard();  // 重置后再次初始化棋盘显示背面
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
function updateTimer() {
    let now = new Date();
    let elapsed = Math.floor((now - startTime) / 1000);
    let timeLeft = totalGameTime - elapsed;
    document.getElementById('timePassed').innerText = elapsed.toString();
    document.getElementById('timeLeft').innerText = timeLeft.toString();
    
    if (timeLeft <= 0) {
        clearInterval(timer);
        alert("Time's up! Game over.");
        saveTrioGameData(errors, elapsed, timeLeft, points);
        resetGame();
    }
}

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
function saveTrioGameData(errors, timePassed, timeLeft, points) {
    if (!isLoggedIn()) return;

    const loggedInUser = localStorage.getItem('loggedInUser');
    const gameData = JSON.parse(localStorage.getItem('trioGameData')) || {};

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
    localStorage.setItem('trioGameData', JSON.stringify(gameData));

    displayTrioGameData();
}


//显示用户游戏记录数据
function displayTrioGameData() {
    const gameDataContainer = document.getElementById('gameDataContainer');
    gameDataContainer.innerHTML = '';

    if (!isLoggedIn()) return;

    const loggedInUser = localStorage.getItem('loggedInUser');
    const gameData = JSON.parse(localStorage.getItem('trioGameData')) || {};

    if (!gameData[loggedInUser] || gameData[loggedInUser].length === 0) {
        gameDataContainer.innerHTML = '<p>No trio game data available.</p>';
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
    } else if (!card3Selected) {
        card3Selected = card;
        isFlipping = true; // 开始翻牌过程，禁用进一步的卡牌点击
        setTimeout(checkMatch, 600); // 等待1秒再检查匹配情况
    }
}


function checkMatch() {
    const card1Img = card1Selected.querySelector(".front").src;
    const card2Img = card2Selected.querySelector(".front").src;
    const card3Img = card3Selected.querySelector(".front").src;

    const mismatchRandomSongIndex = Math.floor(Math.random() * 4) + 1;
    const randomSongIndex = Math.floor(Math.random() * 3) + 1;
    const matchSong = document.getElementById(`match${randomSongIndex}`);
    const mismatchSong = document.getElementById(`mismatch${mismatchRandomSongIndex}`);

    const card1Container = card1Selected.parentElement;
    const card2Container = card2Selected.parentElement;
    const card3Container = card3Selected.parentElement;

    if (card1Img === card2Img && card2Img === card3Img) {
        card1Container.classList.add("match-container");
        card2Container.classList.add("match-container");
        card3Container.classList.add("match-container");

        matches += 1;
        points += 1;
        document.getElementById('points').innerText = points;
        matchSong.play();

        setTimeout(() => {
            card1Container.classList.remove("match-container");
            card2Container.classList.remove("match-container");
            card3Container.classList.remove("match-container");

            if (matches === 10) {
                clearInterval(timer);
                alert("Congratulations! You've matched all cards!");
                saveTrioGameData(errors, Math.floor((new Date() - startTime) / 1000), totalGameTime - Math.floor((new Date() - startTime) / 1000), points);
                resetGame();
            }

            card1Selected = null;
            card2Selected = null;
            card3Selected = null;
            isFlipping = false;
        }, 600);
    } else {
        card1Container.classList.add("nomatch-container");
        card2Container.classList.add("nomatch-container");
        card3Container.classList.add("nomatch-container");

        mismatchSong.play();

        setTimeout(() => {
            card1Container.classList.remove("nomatch-container");
            card2Container.classList.remove("nomatch-container");
            card3Container.classList.remove("nomatch-container");

            card1Selected.classList.remove("flip");
            card2Selected.classList.remove("flip");
            card3Selected.classList.remove("flip");

            errors += 1;
            document.getElementById("errors").innerText = errors;

            card1Selected = null;
            card2Selected = null;
            card3Selected = null;
            isFlipping = false;
        }, 600);
    }
}


function update() {
    //if cards aren't the same, flip both back
    if (card1Selected.src === card2Selected.src) {
        matches += 1; // Increase match count
        points += 1; // 增加分数
        document.getElementById('points').innerText = points; // 更新分数显示
        
        if (matches === 10) {
            clearInterval(timer);
            alert("Congratulations! You've matched all cards!");
            saveTrioGameData(errors, Math.floor((new Date() - startTime) / 1000), totalGameTime - Math.floor((new Date() - startTime) / 1000), points);
            resetGame();
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


