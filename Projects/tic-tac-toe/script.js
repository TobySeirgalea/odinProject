const newGameButton             = document.querySelector(".newGameButton");
const dialogSubmitButton        = document.querySelector("#dialogSubmitButton");
const dialogToGetGameParameters = document.querySelector("#gameParametersDialog");


function removeGameboardContainer(){
    const gameBoardContainer = document.querySelector(".gameBoardContainer");
    if (gameBoardContainer){
        document.body.removeChild(gameBoardContainer);
    }
};

function createGameboardContainer(){
    const newGameBoardContainer = document.createElement("div");
    newGameBoardContainer.classList.add("gameBoardContainer");
    document.body.appendChild(newGameBoardContainer);
}

newGameButton.addEventListener("click", (event) => {
    removeGameboardContainer();
    createGameboardContainer();
    dialogToGetGameParameters.showModal();
});

dialogSubmitButton.addEventListener("click", (event) => {
    event.preventDefault();
    const dimensions = document.querySelector("#dimensionsInput").value;
    const selectedSymbol = document.querySelector("#selectSymbol").value;

    const gameParameters = {
        dimension: Number(dimensions),
        userSymbol: selectedSymbol,
        computerSymbol: selectedSymbol === "X" ? "O" : "X",
    };

    dialogToGetGameParameters.close();
    ticTacToe(gameParameters).play();
});

function gameboard(boardDimension, aGame){
    const gameBoard = [];
    let dimension = boardDimension; 
    let game      = aGame;

    const createGameboard = () => {
        for (let row = 0; row < dimension; row++){
            const rowArray = [];
            for (let column = 0; column < dimension; column++){
                rowArray.push(newCellOf(() => clickedCell(row,column)));
            }
            gameBoard.push(rowArray);
        }
        return gameBoard; 
    };

    function clickedCell(i, j){
        if (isPositionEmpty(i, j)){
            game.updatePlayerSelectedPosition(i, j);
        }
        else{
            game.playerSelectedInvalidPosition();
        }            
    };

    const isPositionEmpty = (row, column) => {
        return isValidGameboardPosition(row, column) && gameBoard[row][column].isCellEmpty();
    };

    const occupyPositionWith = (row, column, aPlayer) => {
        gameBoard[row][column].occupyPositionWith(aPlayer);
    };

    const isFilled = () =>{
        return allPositionsSatisfies((rowNumber, columnNumber, cell) => !cell.isCellEmpty());
    };

    const allPositionsInRangeSatisfies = (predicate, rowInit, rowLimit, columnInit, columnLimit) => {
        let answer = true;
        for (let rowNumber = rowInit; rowNumber < Math.min(rowLimit, dimension); rowNumber++){
            for (let columnNumber = columnInit; columnNumber < Math.min(columnLimit, dimension); columnNumber++){
                if (!answer){
                    return answer;
                }
                answer &= predicate(rowNumber, columnNumber, gameBoard[rowNumber][columnNumber]);
            }
        }
        return answer;
    };

    const allPositionsSatisfies = (predicate) => {
        return allPositionsInRangeSatisfies(predicate, 0, dimension, 0, dimension);
    };

    const someRowSatisfies = (predicate) => {
        return gameBoard.some(row => row.every(column => predicate(column)));
    };

    const someColumnSatisfies = (predicate) => {
        let answer = false;
        for (let column = 0; column < dimension; column++){
            answer |= gameBoard.every(row => predicate(row[column]));
        }
        return answer;
    };

    const printGameboard = () => {
        let boardString = "";
        gameBoard.forEach(row => {
            row.forEach(cell => boardString = cell.addSymbolToString(boardString));
            boardString += `\n`;
        });
        console.log(boardString);
    };
   
    function isValidGameboardPosition(row, column) {
        return row >= 0 && row < dimension && column >= 0 && column < dimension;
    }
 
    return {createGameboard, isPositionEmpty, occupyPositionWith, isFilled, allPositionsInRangeSatisfies, allPositionsSatisfies, someRowSatisfies, someColumnSatisfies, clickedCell, printGameboard};
};

function player(selectedSymbol, selectedTurnRoutine){
    const symbol = selectedSymbol;
    const playTurn = () => selectedTurnRoutine();
    const isPlayerSymbol = (aSymbol) => symbol === aSymbol.toUpperCase();
    return {isPlayerSymbol, playTurn};
};

function newCellOf(cellClickRoutine){
    let occupant = undefined;
    let symbol = "-";
    let button = document.createElement("button");
    button.classList.add("inactiveCell");
    button.addEventListener("click", cellClickRoutine);
    document.querySelector(".gameBoardContainer").appendChild(button);

    const occupyPositionWith = (aPlayer) => {
        occupant           = aPlayer;
        symbol             = aPlayer.isPlayerSymbol("X") ? "X" : "O";
        button.textContent = symbol;
        const styleClass   = symbol === "X" ? "crossSymbolCell" : "circleSymbolCell";
        button.classList.add(styleClass);
        button.classList.remove("inactiveCell")
    };

    const isCellEmpty = () => {
        return occupant === undefined;
    };

    const addSymbolToString = (aString) => {
        return aString + symbol;
    };

    const isOccupiedBy = (aPlayer) => aPlayer.isPlayerSymbol(symbol); 

    return {occupyPositionWith, isCellEmpty, addSymbolToString, isOccupiedBy};
}

function ticTacToe({dimension: boardDimension, userSymbol: playerSymbol, computerSymbol: computerPlayerSymbol}){    
    let dimension      = boardDimension;
    let userSymbol     = playerSymbol;
    let computerSymbol = computerPlayerSymbol;
    let gameBoard;
    const userPosition = 0; 
    const computerPosition = 1;
    let players = new Array(2);
    let winner = undefined;
    let currentTurn = Math.round(Math.random() * 100) % 2; //Random selection of initial turn
    
    const initializeGameboard = () => {
        const gameBoardContainer = document.querySelector(".gameBoardContainer");
        gameBoardContainer.style.gridTemplate = `repeat(${dimension}, 1fr) / repeat(${dimension}, 1fr)`;
        gameBoard = gameboard(dimension, {updatePlayerSelectedPosition, playerSelectedInvalidPosition});
        gameBoard.createGameboard();
    };

    const play = () => {
        initializeGameboard();
        players[userPosition]      = player(userSymbol, askPlayerToPlayTurn);
        players[computerPosition]  = player(computerSymbol, askComputerToPlayTurn);
        console.log(`${currentTurn === 0 ? "user" : "computer"} starts!`);
        players[currentTurn].playTurn();
        };
    
    const updateWinner = () => {
        if (checkIfPlayerWins(players[currentTurn])){
            winner = players[currentTurn];
            console.log("Winner", winner);
            const theme   = `${currentTurn === computerPosition ? "loserTheme" : "winnerTheme"}`;
            const message = `${currentTurn === computerPosition ? "Computer wins" : "You are the winner!"}`;
            informResultToUser(message, theme);
        }
    };

    const informResultToUser = (message, theme) => {
        const resultMessageDialog = document.createElement("dialog");
        const resultMessage = document.createElement("h2"); 
        resultMessageDialog.appendChild(resultMessage);
        resultMessage.textContent = message;
        document.body.appendChild(resultMessageDialog);
        const acceptButton = document.createElement("button");
        resultMessageDialog.classList.add(theme);
        resultMessageDialog.appendChild(acceptButton);
        acceptButton.addEventListener("click", (event) => {
            resultMessageDialog.close();
            removeGameboardContainer();
        });
        acceptButton.textContent = "Accept";
        resultMessageDialog.showModal();
    };

    const checkIfPlayerWins = (aPlayer) => {
        return (gameBoard.someColumnSatisfies(cell => cell.isOccupiedBy(aPlayer)) || 
                gameBoard.someRowSatisfies(cell => cell.isOccupiedBy(aPlayer))    || 
                gameBoard.allPositionsSatisfies((row, column, cell) => (row === column  && cell.isOccupiedBy(aPlayer)) || row !== column) ||
                gameBoard.allPositionsSatisfies((row, column, cell) => (row === dimension - 1 - column && cell.isOccupiedBy(aPlayer)) || row !== dimension-1-column));
    };

    const askPlayerToPlayTurn = () => {
        console.log("Your turn, select a position:");
    };

    const askComputerToPlayTurn = () => {
        let row;
        let column;
        do {
            row    = Math.round(Math.random() * 100) % dimension;
            column = Math.round(Math.random() * 100) % dimension;
        } while(!gameBoard.isPositionEmpty(row, column));
        console.log(`Computer choice: (row:${row}, column: ${column})`);
        gameBoard.clickedCell(row, column);
    };

    const updatePlayerSelectedPosition = (row, column) => {
        gameBoard.occupyPositionWith(row, column, players[currentTurn]);
        updateGameStatus();
    };

    const updateGameStatus = () =>{
        //gameBoard.printGameboard();
        updateWinner();
        if (winner === undefined && !gameBoard.isFilled()){
            nextTurn();
        }
        else if (gameBoard.isFilled() && winner === undefined){
            informResultToUser("Draw", "drawTheme");
        }

    };
    
    const nextTurn = () => {
        currentTurn = (currentTurn + 1) % 2;
        players[currentTurn].playTurn();
    };

    const playerSelectedInvalidPosition = (row, column) => {
        console.log("Position invalid, please select another one");
    };

    return {play};

    //Al llamar a ticTacToe() todos los métodos definidos dentro de esta factory function están disponibles, sin importar su orden en el código, para pasárselos a otras funciones u factories. Las funciones arrow/lambda tienen scope léxico, por lo que capturan todo el entorno donde son definidas, es decir que van a capturar y tener en su scope las otras funciones de esta factory. Si a alguna función le pasamos en una función dentro de esta factory un objeto con alguno de los métodos/atributos de la factory, este tendrá acceso a ellos para invocarlos, y tendrán el scope del ticTacToe/objeto resultante de la factory function. Por eso al pasarle a gameboard solo un objeto con esas funciones, le estoy permitiendo invocarlas y que se ejecuten con entorno de esta función y modificando al resultante de esta factory. 
};