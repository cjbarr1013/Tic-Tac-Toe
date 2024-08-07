function Gameboard() {
    const rows = 3;
    const columns = 3;
    let board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Square());
        };
    };

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

    const printBoard = () => {
        for (let i = 0; i < columns; i++) {
            console.log(
                board[i][0].getValue(), 
                board[i][1].getValue(), 
                board[i][2].getValue()
            );
        };
    };

    return {checkSquare, placePiece, checkForWinner, checkForTie, printBoard};
};

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

function Controller() {
    let board = Gameboard();
    const player1 = Player("George");
    const player2 = Player("Billy");
    
    player1.changeTurn();

    const switchActivePlayer = () => {
        player1.changeTurn();
        player2.changeTurn();
    };

    const getActivePlayer = () => player1.isTurn() ? player1 : player2;

    const printNewTurn = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    const isWinner = () => board.checkForWinner();

    const isTie = () => board.checkForTie();

    const playRound = () => {
        printNewTurn();

        while (true) {
            const row = parseInt(prompt("Row? (1-3)"));
            const col = parseInt(prompt("Column? (1-3)"));
            if (!board.checkSquare([row-1, col-1])) {
                board.placePiece(getActivePlayer(), [row-1, col-1]);
                break;
            } else {
                console.log("There is already a piece in that square!");
            };
        };

        switchActivePlayer();
    };

    return {isWinner, isTie, playRound}
};

function displayGame() {

};

const game = Controller();

while (!game.isWinner() && !game.isTie()) {
    game.playRound();
};

if (game.isWinner()) {
    console.log(`${game.isWinner().name} has won!`);
} else if (game.isTie()) {
    console.log("The game has ended in a tie!");
};

