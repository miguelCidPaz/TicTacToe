function player(num, symbol) {
    let player = { num, symbol }
    return player;
}

class makeGame {
    constructor() {
        let table = [];
        let line = [];
    }

    newGame() {
        makeBoard();
        let arr = document.getElementsByClassName('board')[0].children;
        for (let element of arr) {
            let childrens = element.children
            for (let item of childrens) {
                item.addEventListener('click', function (player1, player2) {
                    console.log(this)
                })
            }
        }
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

let game = new makeGame();
game.newGame();

const player1 = player(1, "X");
const player2 = player(2, "O");