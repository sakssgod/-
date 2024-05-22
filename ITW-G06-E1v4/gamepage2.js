
var errors = 0;


//新东西
var matches = 0;
var totalGameTime = 100; // Total time for the game in seconds
var timer = null;
var startTime = null;
var points = 0; // 添加分数变量
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
var columns =5;
var card1Selected;
var card2Selected;

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
}

//键盘翻牌逻辑
function flipCardFromInput() {
    let input = document.getElementById('cardInput').value;
    let key = parseInt(input);
    if (key >= 1 && key <= 20) {
        let index = key - 1;
        let row = Math.floor(index / 5);
        let column = index % 5;

        let cardId = row.toString() + "-" + column.toString();
        let card = document.getElementById(cardId);

        if (card && card.src.includes('back')) {
            selectCard.call(card);
        }
    } else {
        alert("Please enter a number between 1 and 20.");
    }

    document.getElementById('cardInput').value = '';
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
        displayGameData(); // 新增调用
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

    cardSet = cardList.concat(cardList); // two of each card
    for (let i = cardSet.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [cardSet[i], cardSet[j]] = [cardSet[j], cardSet[i]]; // ES6 destructuring
 
    }
    console.log(cardSet);
}

function startGame() {

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
        saveGameData(errors, elapsed, timeLeft, points);
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

    const card = document.createElement("div");
    card.classList.add("card");
    card.id = id;

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
    //将class “card” 中的正面卡牌定义为 card1Img， 但是这玩意css根本控制不了，我是直接用card的上一级 card-container给css上压力
    const card1Img = card1Selected.querySelector(".front").src;
    const card2Img = card2Selected.querySelector(".front").src;

    // 添加随机播放一首歌曲的逻辑
    // 添加随机播放一首额外歌曲的逻辑
    const randomSongIndex = Math.floor(Math.random() * 3) + 1;  // 随机选择1, 2, 或 3
    const song = document.getElementById(`song${randomSongIndex}`);

    //将card1selected也就是card的上一级爸爸元素，也就是class “card-container”定义为card1Container
    const card1Container = card1Selected.parentElement;
    const card2Container = card2Selected.parentElement;
    
    //当class “card” 中的正面卡牌1和正面卡牌2一样时
    if (card1Img === card2Img) {

        //给 class “card-container“ 添加css
        card1Container.classList.add("match-container");
        card2Container.classList.add("match-container");


        matches += 1;
        points += 1;
        document.getElementById('points').innerText = points;
        // 播放匹配成功的提示音

        //移除添加的css，不然会有bug
        setTimeout(() => {
            card1Container.classList.remove("match-container");
            card2Container.classList.remove("match-container");
            
            //当所有10张卡牌被揭示时
            if (matches === 10) {
                clearInterval(timer);
                alert("Congratulations! You've matched all cards!");
                saveGameData(errors, Math.floor((new Date() - startTime) / 1000), totalGameTime - Math.floor((new Date() - startTime) / 1000), points);
                resetGame();
            }

            card1Selected = null;
            card2Selected = null;
            isFlipping = false; // 结束翻牌过程，允许进一步的卡牌点击
        }, 600);

    //正面卡牌不一样时候
    } else {
        //添加css
        card1Container.classList.add("nomatch-container");
        card2Container.classList.add("nomatch-container");

        // 播放匹配失败的提示音
        song.play();

        //移除css
        setTimeout(() => {
            card1Container.classList.remove("nomatch-container");
            card2Container.classList.remove("nomatch-container");

            card1Selected.classList.remove("flip");
            card2Selected.classList.remove("flip");

            errors += 1;
            document.getElementById("errors").innerText = errors;

            card1Selected = null;
            card2Selected = null;
            isFlipping = false; // 结束翻牌过程，允许进一步的卡牌点击
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
            saveGameData(errors, Math.floor((new Date() - startTime) / 1000), totalGameTime - Math.floor((new Date() - startTime) / 1000), points);
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