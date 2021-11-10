
class Player {
    turn = true;
    symbol = '';
    rivalSymbol = '';
    autopilot = true;

    getSymbol() {
        return this.symbol;
    }

    setSymbol(symbol) {
        this.symbol = symbol;
    }

    getRivalSymbol() {
        return this.rivalSymbol;
    }

    setRivalSymbol(rivalSymbol) {
        this.rivalSymbol = rivalSymbol;
    }

    setTurn(turn) {
        this.turn = turn;
    }

    getAutopilot() {
        return this.autopilot;
    }

    setAutopilot(autopilot) {
        this.autopilot = autopilot;
    }

    takeCell() {
        //Sacamos desde aqui los arrays creados en el newGame()
        //arrPlays servira para marcar la jugada, arrDivs para encontrar los indices
        let arrDivs = game.getBoardDivs();
        let arrPlays = game.getBoard();
        let width = 0, height = 0;
        let numberLines = document.getElementsByClassName('board')[0].childElementCount;
        let lastPlayer = player.getSymbol();

        for (let i = 0; i < numberLines; i++) {
            if (arrDivs[i].includes(this)) {
                height = i;
                width = arrDivs[i].indexOf(this);
                if (player.turn == true && arrPlays[height][width] == 0) {
                    lastPlayer = player.getSymbol();
                    arrPlays = player.movementPlayer(arrPlays, height, width, this, lastPlayer, false)
                    if (player.getAutopilot) {
                        setTimeout(() => {
                            arrPlays = player.movementIA(arrPlays, height, width);
                        }, 200);
                    }
                } else if (arrPlays[height][width] == 0) {
                    lastPlayer = player.getRivalSymbol();
                    arrPlays = player.movementPlayer(arrPlays, height, width, this, lastPlayer, true)
                }
                game.setBoard(arrPlays);
                player.checkWin(arrPlays, height, width, lastPlayer);
            }
        }
        arrPlays = player.checkBoard(arrPlays);
    }

    movementPlayer(arrPlays, height, width, label, actualPlayer, turn) {
        arrPlays[height][width] = actualPlayer;
        player.drawPlayer(actualPlayer, label);
        player.setTurn(turn)
        game.selectorDance(actualPlayer)
        return arrPlays;
    }

    //Tenemos que comprobar en que posicion coloco el jugador -> ArrPlays[height][width]
    //Recorrer las casillas circundantes a la ultima jugada -> Usaremos la busqueda que usamos para checkwin
    //Si solo tenemos 1 simbolo rival cerca, colocaremos aleatoriamente -> acc = 1 random
    //Si tenemos 2 simbolos colocaremos la marca para detener la jugada  -> acc = 2 colocamos primer 0
    movementIA(arrPlays) {
        let hardMode = true

        if (!hardMode) {
            arrPlays = player.randomMovement(arrPlays);
        } else {
            arrPlays = player.measuredMovement(arrPlays);
        }

        return arrPlays
    }

    randomMovement(arrPlays) {
        let condition = true;
        let height = 0, width = 0;
        let cell = game.getBoardDivs();
        let IA = player.getRivalSymbol();

        while (condition) {
            let randomHeight = Math.floor(Math.random() * document.getElementById('panel-game').childElementCount);
            let randomWidth = Math.floor(Math.random() * document.getElementsByClassName('line')[0].childElementCount);
            if (arrPlays[randomHeight] !== undefined) {
                if (arrPlays[randomHeight][randomWidth] !== undefined) {
                    if (arrPlays[randomHeight][randomWidth] === 0) {
                        condition = false;
                        height = randomHeight;
                        width = randomWidth;
                        arrPlays = player.movementPlayer(arrPlays, randomHeight, randomWidth, cell[randomHeight][randomWidth], IA, true);
                    }
                }
            }
        }

        player.checkWin(arrPlays, height, width, IA);
        arrPlays = player.checkBoard(arrPlays);
        return arrPlays
    }

    measuredMovement(arrPlays) {
        let measuredHeight = document.getElementById('panel-game').childElementCount;
        let measuredWidth = document.getElementsByClassName('line')[0].childElementCount;
        let cell = game.getBoardDivs();
        let condition = true;
        let humanPlayer = player.getSymbol(), IA = player.getRivalSymbol();
        let height = 0, width = 0, count = 0;

        //Realizamos un pequeño for con el alto del panel
        for (let i = 0; i < measuredHeight; i++) {
            if (condition) {
                //Si la linea horizontal tiene simbolo del jugador y 0s (vacios) lo recorremos con un for
                if (arrPlays[i].includes(humanPlayer) && arrPlays[i].includes(0)) {
                    //Contaremos cada symbol de jugador y al segundo si el siguiente esta vacio, procedemos
                    for (let j = 0; j < measuredWidth; j++) {
                        if (arrPlays[i][j] === humanPlayer) {
                            count++;
                            if (count == 2 && arrPlays[i][j + 1] === 0) {
                                console.log('movimiento medido horizontal')
                                condition = false; height = i; width = j + 1;
                                arrPlays = player.movementPlayer(arrPlays, height, width, cell[height][width], IA, true);
                            }
                        }
                    }
                    count = 0;
                }

                //Si condition sigue en true ahora recorremos verticalmente el panel
                if (condition) {
                    if (arrPlays[i].includes(humanPlayer)) {
                        if (arrPlays[i + 1] !== undefined && arrPlays[i + 1].includes(humanPlayer)) {
                            let index = arrPlays[i].indexOf(humanPlayer);
                            for (let j = index; j < measuredWidth; j++) {
                                if (arrPlays[j][i] === 0) {
                                    console.log('movimiento medido vertical')
                                    condition = false; height = j; width = i;
                                    arrPlays = player.movementPlayer(arrPlays, height, width, cell[height][width], IA, true);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        //Si tras las dos busquedas no se realiza ningun movimiento, realizamos uno random
        if (condition) {
            console.log('movimiento random')
            arrPlays = player.randomMovement(arrPlays);
        }

        player.checkWin(arrPlays, height, width, IA);
        arrPlays = player.checkBoard(arrPlays);
        return arrPlays;
    }

    //Comprobamos si el tablero esta completo
    checkBoard(arrPlays) {
        let check = true;
        for (let i = 0; i < arrPlays.length; i++) {
            if (arrPlays[i].includes(0)) {
                check = false;
            }
        }
        if (check) {
            for (let i = 0; i < arrPlays.length; i++) {
                for (let j = 0; j < arrPlays[i].length; j++) {
                    arrPlays[i][j] = 0;
                }
            }
            game.newGame();
            return arrPlays;
        }
        return arrPlays;
    }

    //Recibimos los valores para conocer la tirada sin necesidad de volver a localizarla
    checkWin(arrPlays, height, width, lastPlayer) {
        const ref = arrPlays;//Obtiene el tablero de juegos
        let acc = 0;//Acumulara la cuenta
        let acc1 = 0, acc2 = 0, acc3 = 0, acc4 = 0;

        //Revisamos lateralmente
        acc1 = this.checkThisSide(ref, height, width, acc, lastPlayer, 0)
        acc2 = this.checkThisSide(ref, height, width, acc, lastPlayer, 1)
        this.checkThis(acc1, acc2) ? game.reportVictory(lastPlayer) : '';

        //Revisamos verticalmente
        acc1 = this.checkThisTop(ref, height, width, acc, lastPlayer, 0);
        acc2 = this.checkThisTop(ref, height, width, acc, lastPlayer, 1);
        this.checkThis(acc1, acc2) ? game.reportVictory(lastPlayer) : '';

        //Revisamos las diagonales de la jugada
        acc1 = this.checkThisDiagonal(ref, height, width, acc, lastPlayer, 0);
        acc2 = this.checkThisDiagonal(ref, height, width, acc, lastPlayer, 1);
        acc3 = this.checkThisDiagonal(ref, height, width, acc, lastPlayer, 2);
        acc4 = this.checkThisDiagonal(ref, height, width, acc, lastPlayer, 3);
        this.checkThis(acc1, acc2) ? game.reportVictory(lastPlayer) : '';
        this.checkThis(acc3, acc4) ? game.reportVictory(lastPlayer) : '';
    }

    checkThis(n1, n2) {
        if (n1 + n2 > game.getNumber()) {
            return true
        } else {
            return false
        }
    }

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
    board = [];
    boardDivs = [];
    numberForWin = 3;

    getNumber() {
        return this.numberForWin
    }

    getBoard() {
        return this.board;
    }

    setBoard(board) {
        this.board = board
    }

    getBoardDivs() {
        return this.boardDivs;
    }

    setBoardDivs(boardDivs) {
        this.boardDivs = boardDivs;
    }

    //Con esto crearemos el board que guarda este objeto
    setBoards() {
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
        this.setBoard(arr);
        this.setBoardDivs(arr2);
    }


    newGame() {
        this.removeAll();
        this.makeBoard();
        this.selectorDance(player.getSymbol(), 1);
        this.setBoards();
        player.setTurn(true)
    }

    selectorDance(symbol, option = 0) {
        let position = document.getElementById('position');
        if (symbol === 'X') {
            if (position.classList.contains('to-left')) {
                position.classList.remove('to-left')
            }
            if (option == 0) {
                position.classList.add('to-right')
            } else {
                position.classList.add('to-left');
            }

        } else {
            if (position.classList.contains('to-right')) {
                position.classList.remove('to-right')
            }
            if (option == 0) {
                position.classList.add('to-left');
            } else {
                position.classList.add('to-right')
            }
        }
    }

    reportVictory(symbol) {
        let board = document.getElementById('panel')
        let boardWin = document.getElementById('panel-win');
        let winner = document.getElementById('winner')
        let button = document.getElementById('retry')
        board.classList.add('no-visible');
        winner.innerHTML = symbol;
        boardWin.classList.remove('no-visible');
        button.addEventListener('click', this.retryGame)
    }

    retryGame() {
        let boardWin = document.getElementById('panel-win')
        let boardWelcome = document.getElementById('panel-welcome')
        boardWin.classList.add('no-visible');
        boardWelcome.classList.remove('no-visible');
    }

    removeAll() {
        let board = document.getElementById('panel-game');
        while (board.firstChild) {
            board.removeChild(board.firstChild);
        }
    }

    //Crea una linea
    makeLine() {
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
    makeBoard() {
        let number = 3;
        let board = document.getElementsByClassName('board')[0];
        for (let i = 0; i < number; i++) {
            board.appendChild(this.makeLine());
        }
    }

    selectSymbol() {
        if (this.innerText == 'X') {
            player.setSymbol('X');
            player.setRivalSymbol('O');
        } else {
            player.setSymbol('O');
            player.setRivalSymbol('X');
        }

        nextPage();
        game.newGame();
    }
}

//Deberian moverse y almacenarse en algun objeto, por lo menos el player
let player = new Player();
let game = new Game();

//Coloca los primeros eventos en los botones de seleccion
const selections = document.getElementsByClassName('selection');
for (let element of selections) {
    element.addEventListener('click', game.selectSymbol);
}

//Pasa pagina, debera modificarse conforme se añadan ventanas
function nextPage() {
    let welcome = document.getElementsByClassName('modal-welcome')[0];
    let board = document.getElementsByClassName('board-game')[0];
    welcome.classList.add('no-visible');
    board.classList.remove('no-visible');
}