// 读取local storage中的数据
const gameDataString = localStorage.getItem('gameData');
const trioGameDataString = localStorage.getItem('trioGameData');

// 检查数据是否存在
if (gameDataString && trioGameDataString) {
    // 解析JSON字符串为对象
    const gameData = JSON.parse(gameDataString);
    const trioGameData = JSON.parse(trioGameDataString);

    // 调试：打印读取到的数据
    console.log("Normal Game Data:", gameData);
    console.log("Trio Game Data:", trioGameData);

    // 计算玩家的错误总数
    const calculateTotalErrors = (playerData) => {
        return playerData.reduce((totalErrors, game) => totalErrors + game.errors, 0);
    };

    // 处理玩家数据并计算总错误数
    const processPlayerErrors = (data) => {
        const result = {};
        for (const player in data) {
            if (data.hasOwnProperty(player)) {
                result[player] = calculateTotalErrors(data[player]);
            }
        }
        return result;
    };

    // 处理Normal Ranking数据
    const normalPlayerErrors = processPlayerErrors(gameData);
    console.log("Normal Player Errors:", normalPlayerErrors);

    // 处理Trio Ranking数据
    const trioPlayerErrors = processPlayerErrors(trioGameData);
    console.log("Trio Player Errors:", trioPlayerErrors);
} else {
    console.log("No game data found in local storage.");
}
