
class Player {
    constructor(num, symbol) {
        num = num;
        symbol = symbol;
    }
    turn = true;

    getPlayer() {
        return `player ${this.num} con symbol ${this.symbol}`
    }

    checkWin() {
        let conditions = 0;
        let board = getBoard();
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.children.length; j++) {

            }
        }
    }
}

class Game {
    constructor(board) {
        board = board;
    }

    getBoard() {
        return this.board;
    }

    //Con esto crearemos el board que guarda este objeto
    setBoard(num1, num2) {
        this.board = arr;
    }
}

let player1 = new Player();
let player2 = new Player();
let game = new Game();

//Coloca los primeros eventos en los botones de seleccion
let selections = document.getElementsByClassName('selection');
for (let element of selections) {
    element.addEventListener('click', selectSymbol);
}
function selectSymbol() {
    if (this.innerText == 'X') {
        player1.num = 1;
        player1.symbol = 'X'

        player2.num = 2;
        player2.symbol = 'O';
    } else {
        player1.num = 1;
        player1.symbol = 'O'

        player2.num = 2;
        player2.symbol = 'X';
    }
}

function makeLine() {
    let number = 3;
    let line = document.createElement('div')
    line.classList = 'line'
    for (let i = 0; i < number; i++) {
        let cell = document.createElement('div')
        cell.classList = 'cell'
        line.appendChild(cell);
    }
    return line;
}

function makeBoard() {
    let number = 3;
    let board = document.getElementsByClassName('board')[0];
    for (let i = 0; i < number; i++) {
        board.appendChild(makeLine());
    }
}