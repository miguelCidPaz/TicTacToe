
class Player {
    constructor(num, symbol, rivalSymbol) {
        num = num;
        symbol = symbol;
        rivalSymbol = rivalSymbol;
    }
    turn = true;

    getPlayer() {
        return `player ${this.num} con symbol ${this.symbol}`
    }

    setTurn(turn) {
        this.turn = turn;
    }

    takeCell() {
        //Sacamos desde aqui los arrays creados en el newGame()
        //arrPlays servira para marcar la jugada, arrDivs para encontrar los indices
        let arrDivs = game.getBoardDivs();
        let arrPlays = game.getBoard();
        let numberLines = document.getElementsByClassName('board')[0].childElementCount;

        //console.log(arrDivs[0].includes(this));
        for (let i = 0; i < numberLines; i++) {
            if (arrDivs[i].includes(this)) {
                let numberCell = arrDivs[i].indexOf(this);
                if (player.turn == true && (arrDivs[i][arrDivs[i].indexOf(this)].innerText != '', undefined, player.rivalSymbol)) {
                    arrPlays[i][numberCell] = player.symbol;
                    player.setTurn(false)
                } else {
                    arrPlays[i][numberCell] = player.rivalSymbol;
                    player.setTurn(true)
                }
                game.setBoard = arrPlays;
                return true
            }
        }


    }

}

class Game {
    constructor(board) {
        board = board;
    }
    boardDivs = [];

    getBoard() {
        return this.board;
    }

    //Con esto crearemos el board que guarda este objeto
    setBoard() {
        let height = document.getElementsByClassName('board')[0].childElementCount;
        let width = document.getElementsByClassName('line')[0].childElementCount;

        /**
         * Creamos dos arrays bidimensionales
         * uno para seguir las jugadas y realizar los checks
         * otro para lograr la posicion de cada click
         */
        let arr = [], line = [];
        let arr2 = [], line2 = [];
        for (let i = 0; i < height; i++) {
            let father = document.getElementsByClassName('line');
            for (let j = 0; j < width; j++) {
                line.push(0);
                console.log(j)
                line2.push(father[i].children[j]);
            }
            arr.push(line);
            arr2.push(line2);
            line = [], line2 = [];
        }
        this.boardDivs = arr2;
        this.board = arr;
    }


    getBoardDivs() {
        return this.boardDivs;
    }

    newGame() {
        makeBoard();
        this.setBoard()
    }
}

//Deberian moverse y almacenarse en algun objeto, por lo menos el player
let player = new Player();
let game = new Game();

//Coloca los primeros eventos en los botones de seleccion
let selections = document.getElementsByClassName('selection');
for (let element of selections) {
    element.addEventListener('click', selectSymbol);
}
function selectSymbol() {
    if (this.innerText == 'X') {
        player.num = 1;
        player.symbol = 'X';
        player.rivalSymbol = 'O';
    } else {
        player.num = 1;
        player.symbol = 'O';
        player.rivalSymbol = 'X';
    }

    nextPage();
    game.newGame();
}

//Pasa pagina, debera modificarse conforme se añadan ventanas
function nextPage() {
    let welcome = document.getElementsByClassName('modal-welcome')[0];
    let board = document.getElementsByClassName('board-game')[0];
    welcome.classList.add('no-visible');
    board.classList.remove('no-visible');
}

//Crea una linea
function makeLine() {
    let number = 3;
    let line = document.createElement('div')
    line.classList = 'line'
    for (let i = 0; i < number; i++) {
        let cell = document.createElement('div')
        cell.classList = 'cell'
        cell.addEventListener('click', player.takeCell);
        line.appendChild(cell);
    }
    return line;
}

//Junta las lineas para formar el 3 en raya
function makeBoard() {
    let number = 3;
    let board = document.getElementsByClassName('board')[0];
    for (let i = 0; i < number; i++) {
        board.appendChild(makeLine());
    }
}