
var errors = 0;


//新东西
var matches = 0;
var totalGameTime = 100; // Total time for the game in seconds
var timer = null;
var startTime = null;
var points = 0; // 添加分数变量


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
    document.getElementById('startButton').onclick = startGame;
    document.getElementById('resetButton').onclick = resetGame;
    initializeBoard();  // 初始化棋盘显示背面
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
    // cardSet = cardList.concat(cardList); //two of each card
    // console.log(cardSet);
    // //shuffle
    // for (let i = 0; i < cardSet.length; i++) {
    //     let j = Math.floor(Math.random() * cardSet.length); //get random index
    //     //swap
    //     let temp = cardSet[i];
    //     cardSet[i] = cardSet[j];
    //     cardSet[j] = temp;
    // }
    

    cardSet = cardList.concat(cardList); // two of each card
    for (let i = cardSet.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [cardSet[i], cardSet[j]] = [cardSet[j], cardSet[i]]; // ES6 destructuring
 
    }
    console.log(cardSet);
}

function startGame() {
    //arrange the board 4x5
    // for (let r = 0; r < rows; r++) {
    //     let row = [];
    //     for (let c = 0; c < columns; c++) {
    //         let cardImg = cardSet.pop();
    //         row.push(cardImg); //JS

    //         // <img id="0-0" class="card" src="water.jpg">
    //         let card = document.createElement("img");
    //         card.id = r.toString() + "-" + c.toString();
    //         card.src = cardImg + ".jpg";
    //         card.classList.add("card");
    //         card.addEventListener("click", selectCard);
    //         document.getElementById("board").append(card);

    //     }
    //     board.push(row);
    // }

    // console.log(board);
    // setTimeout(hideCards, 1000);

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
    document.getElementById('board').innerHTML = '';
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
    initializeBoard();  // 重置后再次初始化棋盘显示背面
}

// 新东西
function setupBoard() {
    document.getElementById('board').innerHTML = ''; // 清空棋盘以准备新游戏
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let cardImg = cardSet.pop();
            row.push(cardImg); // JS

            let card = document.createElement("img");
            card.id = r.toString() + "-" + c.toString();
            card.src = "back.jpg";
            card.classList.add("card");
            card.addEventListener("click", selectCard);
            document.getElementById("board").append(card);
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

// 新东西
function updateTimer() {
    let now = new Date();
    let elapsed = Math.floor((now - startTime) / 1000);
    let timeLeft = totalGameTime - elapsed;
    document.getElementById('timePassed').innerText = elapsed.toString();
    document.getElementById('timeLeft').innerText = timeLeft.toString();
    
    if (timeLeft <= 0) {
        clearInterval(timer);
        alert("Time's up! Game over.");
        resetGame();
    }
}

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


function flipCardFromInput() {
    let input = document.getElementById('cardInput');
    let key = parseInt(input.value);
    if (key >= 1 && key <= 20) {
        // 计算卡片的行和列
        let index = key - 1;  // 数组索引从0开始，输入是1到20，所以需要减1
        let row = Math.floor(index / 5);  // 因为每行5列
        let column = index % 5;

        let cardId = row.toString() + "-" + column.toString();
        let card = document.getElementById(cardId);

        if (card && card.src.includes('back')) {  // 只有当卡片为背面时才触发
            selectCard.call(card);  // 使用.call方法调用selectCard函数
        }
    } else {
        alert("Please enter a number between 1 and 20.");
    }

    input.value = '';  // 清除输入字段，准备下一次输入
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