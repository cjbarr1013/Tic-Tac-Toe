// Game objects
const board = (function () {
    const rows = 3;
    const columns = 3;
    let board;

    const resetBoard = () => {
        board = [];

        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Square());
            };
        };
    }
    resetBoard();

    const getBoard = () => board;

    const checkSquare = (loc) => board[loc[0]][loc[1]].getValue() === 0 ? false : true;

    const placePiece = (player, loc) => {
        board[loc[0]][loc[1]].addPiece(player);
    };

    const checkForWinner = () => {
        for (let i = 0; i < columns; i++) {
            // Horizontal
            if (board[i][0].getValue() == board[i][1].getValue() &&
                board[i][1].getValue() == board[i][2].getValue() &&
                typeof(board[i][0].getValue()) == 'object') {
                    return board[i][0].getValue();
            }
            // Vertical
            if (board[0][i].getValue() == board[1][i].getValue() &&
                board[1][i].getValue() == board[2][i].getValue() &&
                typeof(board[0][i].getValue()) == 'object') {
                    return board[0][i].getValue();
            }
            // Diagonal
            if (board[0][0].getValue() == board[1][1].getValue() &&
                board[1][1].getValue() == board[2][2].getValue() &&
                typeof(board[0][0].getValue()) == 'object') {
                    return board[0][0].getValue();
            }
            if (board[0][2].getValue() == board[1][1].getValue() &&
                board[1][1].getValue() == board[2][0].getValue() &&
                typeof(board[0][2].getValue()) == 'object') {
                    return board[0][2].getValue();
            }
        };
        return false;
    };

    const checkForTie = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (board[i][j].getValue() === 0) {
                    return false;
                }
            };
        };
        return true;
    }

    return {resetBoard, getBoard, checkSquare, placePiece, checkForWinner, checkForTie};
})();

function Square() {
    let value = 0;
    const getValue = () => value;

    const addPiece = (player) => {
        value = player;
    }

    return {getValue, addPiece};
};

function Player(name) {
    let turn = false;
    const isTurn = () => turn;
    const changeTurn = () => isTurn() ? turn = false : turn = true;
    
    let score = 0;
    const getScore = () => score;
    const win = () => score++;

    return {name, isTurn, changeTurn, getScore, win};
};

let game = (function () {
    let active = true;

    const getActivePlayer = (player1, player2) => player1.isTurn() ? player1 : player2;
    const toggleActivePlayer = (player1, player2) => {
        player1.changeTurn();
        player2.changeTurn();
    };

    const isActive = () => active;
    const toggleActive = () => active ? active = false : active = true;

    const isWinner = (board) => board.checkForWinner();
    const isTie = (board) => board.checkForTie();

    const playRound = (board, player1, player2, row, col) => {
        board.placePiece(getActivePlayer(player1, player2), [row, col]);
    };

    return {isActive, toggleActive, getActivePlayer, toggleActivePlayer, 
            isWinner, isTie, playRound};
})();

const display = (function () {
    const userMsg = document.querySelector(".user-msg");
    const scorePlayer1 = document.querySelector("#score-1");
    const scorePlayer2 = document.querySelector("#score-2");
    
    const fillBoard = (board) => {
        for (let i = 0; i < board.getBoard().length; i++) {
            for (let j = 0; j < board.getBoard()[i].length; j++) {
                const square = document.querySelector(`#s${i}${j}`);
                square.textContent = board.getBoard()[i][j].getValue().name;
            };
        };
    };

    const turnMessage = (player) => {
        return userMsg.textContent = `${player.name}, it's your turn.`;
    };

    const winMessage = (player) => {
        return userMsg.textContent = `Congrats ${player.name}, you won! Press RESET to play again.`;
    };

    const tieMessage = () => {
        return userMsg.textContent = "The game has ended in a tie! Press RESET to play again.";
    };

    const toggleReset = (reset, bool) => reset.disabled = bool;

    const updateScore = (player1, player2) => {
        scorePlayer1.textContent = player1.getScore();
        scorePlayer2.textContent = player2.getScore();
    };

    return {fillBoard, winMessage, tieMessage, turnMessage, toggleReset, updateScore};
})();

// Game flow using objects
const player1 = Player("Player 1");
const player2 = Player("Player 2");
const reset = document.querySelector("#reset");

player1.changeTurn();
display.turnMessage(game.getActivePlayer(player1, player2));
display.toggleReset(reset, true);

const squares = document.querySelectorAll(".grid-container > div")
squares.forEach((square) => {
    const row = square.id.split('')[1];
    const col = square.id.split('')[2];
    square.addEventListener("click", () => {
        if (game.isActive() && !board.checkSquare([row, col])) {
            game.playRound(board, player1, player2, row, col);
            display.fillBoard(board);
            checkResults();
            game.toggleActivePlayer(player1, player2);
            if (game.isActive()) {
                display.turnMessage(game.getActivePlayer(player1, player2));
            };
        };
    });
});

reset.addEventListener("click", () => {
    board.resetBoard();
    game.toggleActive();
    display.fillBoard(board);
    display.turnMessage(game.getActivePlayer(player1, player2));
    display.toggleReset(reset, true);
});

function checkResults() {
    if (game.isWinner(board)) {
        game.getActivePlayer(player1, player2).win();
        display.updateScore(player1, player2);
        display.winMessage(game.getActivePlayer(player1, player2));
        game.toggleActive();
        display.toggleReset(reset, false);
    } else if (game.isTie(board)) {
        display.tieMessage();
        game.toggleActive();
        display.toggleReset(reset, false);
    };
};

