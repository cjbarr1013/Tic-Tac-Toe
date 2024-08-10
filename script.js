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

function Player(name, piece, id) {
    let turn = false;
    const isTurn = () => turn;
    const changeTurn = () => isTurn() ? turn = false : turn = true;
    
    let score = 0;
    const getScore = () => score;
    const win = () => score++;

    const getPiece = () => piece;
    const getId = () => id;

    return {name, piece, id, isTurn, changeTurn, getScore, win, getPiece, getId};
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
    const grid = document.querySelector(".grid-container");
    const squares = grid.querySelectorAll(":scope > div");
    const user = document.querySelector("#user");
    const userMsg = document.querySelector("#msg");
    const scorePlayer1 = document.querySelector("#score-1");
    const scorePlayer2 = document.querySelector("#score-2");
    
    const changeColor = (elem, player) => {
        if (player.id === 1) {
            elem.classList.add("p1");
            elem.classList.remove("p2");
        } else {
            elem.classList.add("p2");
            elem.classList.remove("p1");
        };
        changeHoverColor(player)
    };

    const changeHoverColor = (player) => {
        if (player.id === 1) {
            squares.forEach((element) => {
                element.classList.add("p1-hover");
                element.classList.remove("p2-hover");
            });
        } else {
            squares.forEach((element) => {
                element.classList.add("p2-hover");
                element.classList.remove("p1-hover");
            });
        };
    };

    const fillBoard = (board) => {
        for (let i = 0; i < board.getBoard().length; i++) {
            for (let j = 0; j < board.getBoard()[i].length; j++) {
                const square = document.querySelector(`#s${i}${j}`);
                let player = board.getBoard()[i][j].getValue();
                changeColor(square, player);
                square.textContent = player.piece;
            };
        };
    };

    const turnMessage = (player) => {
        changeColor(user, player);
        user.textContent = player.name;
        userMsg.textContent = ", it's your turn.";
    };

    const winMessage = (player) => {
        changeColor(user, player);
        user.textContent = player.name;
        userMsg.textContent = " wins! Press RESET to play again.";
    };

    const tieMessage = () => {
        user.textContent = "";
        userMsg.textContent = "The game has ended in a tie! Press RESET to play again.";
    };

    const toggleReset = (reset, bool) => reset.disabled = bool;

    const updateScore = (player1, player2) => {
        scorePlayer1.textContent = player1.getScore();
        scorePlayer2.textContent = player2.getScore();
    };

    const changeName = (elem, player) => {
        const newName = prompt("What is your name?");
        if (newName != null && newName != "") {
            player.name = newName;
        };
        updateName(elem, player);
    }

    const updateName = (elem, player) => elem.textContent = player.name;

    return {fillBoard, winMessage, tieMessage, turnMessage, 
            toggleReset, updateScore, changeName, updateName};
})();


// Game flow using objects
const player1 = Player("Player 1", "X", 1);
const player2 = Player("Player 2", "O", 2);
const player1Element = document.querySelector("#user-1")
const player2Element = document.querySelector("#user-2")
const reset = document.querySelector("#reset");

player1.changeTurn();
display.updateName(player1Element, player1)
display.updateName(player2Element, player2)
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

player1Element.addEventListener("click", () => {
    display.changeName(player1Element, player1);
    if (game.isActive()) {
        display.turnMessage(game.getActivePlayer(player1, player2));
    };
});

player2Element.addEventListener("click", () => {
    display.changeName(player2Element, player2);
    if (game.isActive()) {
        display.turnMessage(game.getActivePlayer(player1, player2));
    };
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

