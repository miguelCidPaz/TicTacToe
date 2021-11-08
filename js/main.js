
class Player {
    constructor(symbol, rivalSymbol) {
        symbol = symbol;
        rivalSymbol = rivalSymbol;
    }
    turn = true;

    setTurn(turn) {
        this.turn = turn;
    }

    takeCell() {
        //Sacamos desde aqui los arrays creados en el newGame()
        //arrPlays servira para marcar la jugada, arrDivs para encontrar los indices
        let arrDivs = game.getBoardDivs();
        let arrPlays = game.getBoard();
        let width = 0, height = 0;
        let numberLines = document.getElementsByClassName('board')[0].childElementCount;
        let lastPlayer = '';

        //console.log(arrDivs[0].includes(this));
        for (let i = 0; i < numberLines; i++) {
            if (arrDivs[i].includes(this)) {
                height = i;
                width = arrDivs[i].indexOf(this);
                if (player.turn == true && arrPlays[height][width] == 0) {
                    arrPlays[i][width] = player.symbol;
                    lastPlayer = player.symbol;
                    player.drawPlayer(lastPlayer, this);
                    player.setTurn(false)
                    game.selectorDance(lastPlayer)
                } else if (arrPlays[height][width] !== player.symbol && arrPlays[height][width] !== player.rivalSymbol) {
                    console.log(arrPlays[height][width])
                    arrPlays[i][width] = player.rivalSymbol;
                    lastPlayer = player.rivalSymbol;
                    player.drawPlayer(lastPlayer, this);
                    player.setTurn(true)
                    game.selectorDance(lastPlayer)
                }


                game.setBoard = arrPlays;
                console.log(game.getBoard())
                player.checkWin(height, width, lastPlayer);
            }
        }
    }

    //Recibimos los valores para conocer la tirada sin necesidad de volver a localizarla
    checkWin(height, width, lastPlayer) {
        const ref = game.getBoard();//Obtiene el tablero de juegos
        let acc = 0;//Acumulara la cuenta
        let acc1 = 0, acc2 = 0, acc3 = 0, acc4 = 0;

        //Revisamos lateralmente
        acc1 = this.checkThisSide(ref, height, width, acc, lastPlayer, 0)
        acc2 = this.checkThisSide(ref, height, width, acc, lastPlayer, 1)
        this.checkThis(acc1, acc2) ? console.log('Gana player ' + lastPlayer) : '';

        //Revisamos verticalmente
        acc1 = this.checkThisTop(ref, height, width, acc, lastPlayer, 0);
        acc2 = this.checkThisTop(ref, height, width, acc, lastPlayer, 1);
        this.checkThis(acc1, acc2) ? console.log('Gana player ' + lastPlayer) : '';

        //Revisamos las diagonales de la jugada
        acc1 = this.checkThisDiagonal(ref, height, width, acc, lastPlayer, 0);
        acc2 = this.checkThisDiagonal(ref, height, width, acc, lastPlayer, 1);
        acc3 = this.checkThisDiagonal(ref, height, width, acc, lastPlayer, 2);
        acc4 = this.checkThisDiagonal(ref, height, width, acc, lastPlayer, 3);
        this.checkThis(acc1, acc2) ? console.log('Gana player ' + lastPlayer) : '';
        this.checkThis(acc3, acc4) ? console.log('Gana player ' + lastPlayer) : '';
    }

    checkThis(n1, n2) {
        if (n1 + n2 > game.getNumber()) {
            return true
        } else {
            return false
        }
    }

    /**
     * Recibe el arr de referencia, los numeros para marcar la jugada y el acumulador que devolvera
     * @param {Array} ref referencia array jugadas
     * @param {Number} height posicion
     * @param {Number} width posicion
     * @param {Number} acc acumulador
     * @param {String} lastPlayer Simbolo del ultimo jugador
     * @param {Number} option
     */
    checkThisSide(ref, height, width, acc, lastPlayer, option) {
        let referrer = ref[height][width]

        if (option == 0 && referrer === lastPlayer) {
            width++;
            acc++;
            return this.checkThisSide(ref, height, width, acc, lastPlayer, option)
        } else if (option == 1 && referrer === lastPlayer) {
            width--;
            acc++;
            return this.checkThisSide(ref, height, width, acc, lastPlayer, option)
        } else {
            return acc;
        }
    }

    checkThisTop(ref, height, width, acc, lastPlayer, option) {
        if (ref[height] === undefined) {
            return acc;
        }

        let referrer = ref[height][width]
        if (option == 0 && referrer === lastPlayer) {
            height++;
            acc++;
            return this.checkThisTop(ref, height, width, acc, lastPlayer, option)
        } else if (option == 1 && referrer === lastPlayer) {
            height--;
            acc++;
            return this.checkThisTop(ref, height, width, acc, lastPlayer, option)
        } else {
            return acc;
        }
    }

    checkThisDiagonal(ref, height, width, acc, lastPlayer, option) {
        if (ref[height] === undefined) {
            return acc;
        }

        let referrer = ref[height][width]
        if (option == 0 && referrer === lastPlayer) {
            height++;
            width++;
            acc++;
            return this.checkThisDiagonal(ref, height, width, acc, lastPlayer, option)
        } else if (option == 1 && referrer === lastPlayer) {
            height--;
            width--;
            acc++;
            return this.checkThisDiagonal(ref, height, width, acc, lastPlayer, option)
        } else if (option == 2 && referrer === lastPlayer) {
            height++;
            width--;
            acc++;
            return this.checkThisDiagonal(ref, height, width, acc, lastPlayer, option)
        } else if (option == 3 && referrer === lastPlayer) {
            height--;
            width++;
            acc++;
            return this.checkThisDiagonal(ref, height, width, acc, lastPlayer, option)
        } else {
            return acc;
        }
    }

    drawPlayer(playerSymbol, label) {
        let movement = document.createElement('div');
        let symbolPlayer = document.createElement('p');
        symbolPlayer.innerHTML = playerSymbol;
        movement.appendChild(symbolPlayer);
        movement.classList.add('player');
        label.appendChild(movement);
    }

}

class Game {
    constructor(board) {
        board = board;
    }
    boardDivs = [];
    numberForWin = 3;

    getNumber() {
        return this.numberForWin
    }

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
        this.selectorPosition(player.symbol);
    }

    selectorPosition(symbol) {
        let position = document.getElementById('position');
        if (symbol === 'X') {
            position.classList.add('to-right');
        } else {
            position.classList.add('to-left');
        }
    }

    selectorDance(symbol) {
        let position = document.getElementById('position');
        if (symbol === 'X') {
            if (position.classList.contains('to-right')) {
                position.classList.remove('to-right')
            }
            position.classList.add('to-left');
        } else {
            if (position.classList.contains('to-left')) {
                position.classList.remove('to-left')
            }
            position.classList.add('to-right');
        }
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
        player.symbol = 'X';
        player.rivalSymbol = 'O';
    } else {
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