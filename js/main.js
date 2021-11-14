/**
 * This class will manage the game system
 */
class Player {
    turn = true;
    symbol = '';
    rivalSymbol = '';
    autopilot = false;
    hard = false;
    endGame = false;

    getSymbol() {
        return this.symbol;
    }

    /**
     * Main player symbol
     * @param {String} symbol 
     */
    setSymbol(symbol) {
        this.symbol = symbol;
    }

    getRivalSymbol() {
        return this.rivalSymbol;
    }

    /**
     * Rival Symbol
     * @param {String} rivalSymbol 
     */
    setRivalSymbol(rivalSymbol) {
        this.rivalSymbol = rivalSymbol;
    }

    getTurn() {
        return this.turn;
    }

    /**
     * Mark the time of the shifts
     * @param {Boolean} turn 
     */
    setTurn(turn) {
        this.turn = turn;
    }

    getAutopilot() {
        return this.autopilot;
    }

    /**
     * It will select if the autplay for 1 player is activated
     * @param {Boolean} autopilot 
     */
    setAutopilot(autopilot) {
        this.autopilot = autopilot;
    }

    getHard() {
        return this.hard;
    }

    /**
     * Select if you want easy or difficult mode with autoplay
     * @param {String} hard 
     */
    setHard(hard) {
        this.hard = hard;
    }

    getEndGame() {
        return this.endGame;
    }

    /**
     * Control when the game ends
     * @param {Boolean} endGame 
     */
    setEndGame(endGame) {
        this.endGame = endGame;
    }

    /**
     * This function will be assigned to each cell of the game board, in this way with this
     * we make reference to locate ourselves inside the board
     */
    takeCell() {
        let arrDivs = game.getBoardDivs();
        let arrPlays = game.getBoard();
        let autoplay = player.getAutopilot();
        let width = 0, height = 0;
        let numberLines = document.getElementsByClassName('board')[0].childElementCount;
        let lastPlayer = player.getSymbol();
        let end = player.getEndGame();

        for (let i = 0; i < numberLines; i++) {
            if (arrDivs[i].includes(this)) {
                height = i;
                width = arrDivs[i].indexOf(this);
                if (player.turn == true && arrPlays[height][width] == 0) {
                    lastPlayer = player.getSymbol();
                    arrPlays = player.movementPlayer(arrPlays, height, width, this, lastPlayer, false)
                    if (autoplay && !end) {
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

    /**
     * This function will receive the necessary parameters to carry out the movement
     * @param {Array} arrPlays 
     * @param {Number} height 
     * @param {Number} width 
     * @param {HTMLElement} label 
     * @param {String} actualPlayer 
     * @param {Number} turn 
     * @returns
     */
    movementPlayer(arrPlays, height, width, label, actualPlayer, turn) {
        arrPlays[height][width] = actualPlayer;
        player.drawPlayer(actualPlayer, label);
        player.setTurn(turn)
        game.selectorDance(actualPlayer)
        return arrPlays;
    }

    /**
     * Receive and return the array with the AI move
     * @param {Array} arrPlays 
     * @returns 
     */
    movementIA(arrPlays) {
        let end = player.getEndGame();
        let dif = player.getHard();
        if (!end) {
            if (dif) {
                arrPlays = player.measuredMovement(arrPlays);
            } else {
                arrPlays = player.randomMovement(arrPlays);
            }
        }
        return arrPlays
    }

    /**
     * Random move that will look for the first empty square
     * @param {Array} arrPlays 
     * @returns 
     */
    randomMovement(arrPlays) {
        let condition = true;
        let height = 0, width = 0;
        let cell = game.getBoardDivs();
        let IA = player.getRivalSymbol();

        while (condition) {
            let randomHeight = Math.floor(Math.random() * document.getElementById('panel-game').childElementCount);
            let randomWidth = Math.floor(Math.random() * document.getElementsByClassName('line')[0].childElementCount);
            if (arrPlays[randomHeight][randomWidth] === 0) {
                condition = false;
                height = randomHeight;
                width = randomWidth;
                arrPlays = player.movementPlayer(arrPlays, height, width, cell[height][width], IA, true);
            }
        }

        player.checkWin(arrPlays, height, width, IA);
        arrPlays = player.checkBoard(arrPlays);
        return arrPlays
    }

    /**
     * Measured movement that will check first horizontally and then vertically
     * If it does not find a move to cut, it will go on to make a random move
     * @param {Array} arrPlays 
     * @returns 
     */
    measuredMovement(arrPlays) {
        let measuredHeight = document.getElementById('panel-game').childElementCount;
        let measuredWidth = document.getElementsByClassName('line')[0].childElementCount;
        let cell = game.getBoardDivs();
        let condition = true;
        let humanPlayer = player.getSymbol(), IA = player.getRivalSymbol();
        let height = 0, width = 0, count = 0;

        //We make a small for with the height of the panel
        for (let i = 0; i < measuredHeight; i++) {
            if (condition) {
                //If the horizontal line has the player's symbol and 0s (empty) we go through it with a for
                if (arrPlays[i].includes(humanPlayer) && arrPlays[i].includes(0)) {
                    //We will count each player symbol and to the second if the next one is empty, we proceed
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

                //If condition is still true, now we go vertically through the panel
                if (condition) {
                    if (arrPlays[i].includes(humanPlayer)) {
                        if (arrPlays[i + 1] !== undefined && arrPlays[i + 1].includes(humanPlayer)) {
                            let index = arrPlays[i + 1].indexOf(humanPlayer);
                            if (arrPlays[i + 2] !== undefined && arrPlays[i + 2][index] == 0) {
                                console.log('movimiento medido vertical 1')
                                condition = false; height = i + 2; width = index;
                                arrPlays = player.movementPlayer(arrPlays, height, width, cell[height][width], IA, true);
                                break;
                            }
                        }
                    }
                }
            }
        }

        //If after the two searches no movement is made, we make a random one
        if (condition) {
            console.log('movimiento random')
            arrPlays = player.randomMovement(arrPlays);
        }

        player.checkWin(arrPlays, height, width, IA);
        arrPlays = player.checkBoard(arrPlays);
        return arrPlays;
    }

    /**
     * Check if the board is complete, if it is, it will reset it, if not it will return it as is
     * @param {Array} arrPlays 
     * @returns 
     */
    checkBoard(arrPlays) {
        let check = true;
        let end = player.getEndGame();

        for (let i = 0; i < arrPlays.length; i++) {
            if (arrPlays[i].includes(0)) {
                check = false;
            }
        }
        if (check && !end) {
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

    /**
     * Check if the last player meets the victory conditions
     * @param {Array} arrPlays 
     * @param {Number} height 
     * @param {Number} width 
     * @param {String} lastPlayer 
     */
    checkWin(arrPlays, height, width, lastPlayer) {
        const ref = arrPlays;
        let acc = 0;
        let acc1 = 0, acc2 = 0, acc3 = 0, acc4 = 0;

        acc1 = this.checkThisSide(ref, height, width, acc, lastPlayer, 0)
        acc2 = this.checkThisSide(ref, height, width, acc, lastPlayer, 1)
        if (this.checkThis(acc1, acc2)) {
            game.reportVictory(lastPlayer);
            player.setEndGame(true);
        }

        acc1 = this.checkThisTop(ref, height, width, acc, lastPlayer, 0);
        acc2 = this.checkThisTop(ref, height, width, acc, lastPlayer, 1);
        if (this.checkThis(acc1, acc2)) {
            game.reportVictory(lastPlayer);
            player.setEndGame(true);
        }

        acc1 = this.checkThisDiagonal(ref, height, width, acc, lastPlayer, 0);
        acc2 = this.checkThisDiagonal(ref, height, width, acc, lastPlayer, 1);
        acc3 = this.checkThisDiagonal(ref, height, width, acc, lastPlayer, 2);
        acc4 = this.checkThisDiagonal(ref, height, width, acc, lastPlayer, 3);
        if (this.checkThis(acc1, acc2)) {
            game.reportVictory(lastPlayer);
            player.setEndGame(true);
        }
        if (this.checkThis(acc3, acc4)) {
            game.reportVictory(lastPlayer);
            player.setEndGame(true);
        }
    }

    /**
     * This function will only be used to simplify checkWin
     * @param {Number} n1 
     * @param {Number} n2 
     * @returns 
     */
    checkThis(n1, n2) {
        if (n1 + n2 > game.getNumber()) {
            return true
        } else {
            return false
        }
    }

    /**
     * Recursively we will count in the array of moves how many times
     * the player's symbol is repeated continuously. For this we return the acc (accumulator)
     * @param {Array} ref 
     * @param {Number} height 
     * @param {Number} width 
     * @param {Number} acc 
     * @param {String} lastPlayer 
     * @param {Number} option 
     * @returns 
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

    /**
     * Recursively we will count in the array of moves how many times
     * the player's symbol is repeated continuously. For this we return the acc (accumulator)
     * @param {Array} ref 
     * @param {Number} height 
     * @param {Number} width 
     * @param {Number} acc 
     * @param {String} lastPlayer 
     * @param {Number} option 
     * @returns 
     */
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

    /**
     * Recursively we will count in the array of moves how many times
     * the player's symbol is repeated continuously. For this we return the acc (accumulator)
     * @param {Array} ref 
     * @param {Number} height 
     * @param {Number} width 
     * @param {Number} acc 
     * @param {String} lastPlayer 
     * @param {Number} option 
     * @returns 
     */
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

    /**
     * We receive the player's symbol and the label where we are going to place it, and we proceed to draw it
     * @param {String} playerSymbol 
     * @param {HTMLElement} label 
     */
    drawPlayer(playerSymbol, label) {
        if (label.firstChild) {
            if (label.firstElementChild.classList.contains('player-preview')) {
                label.firstElementChild.remove();
            }
        }

        let movement = document.createElement('div');
        let symbolPlayer = document.createElement('p');
        symbolPlayer.innerHTML = playerSymbol;
        movement.appendChild(symbolPlayer);
        movement.classList.add('player');
        label.appendChild(movement);
    }

    /**
     * Provides a preview of the symbol
     */
    drawPreviewPlayer() {
        let playerSymbolPreview = '';
        let inTurn = player.getTurn();
        inTurn ? playerSymbolPreview = player.getSymbol() : playerSymbolPreview = player.getRivalSymbol();

        if (!this.firstChild) {
            let container = document.createElement('div');
            container.classList.add('player-preview')
            let p = document.createElement('p');
            p.innerHTML = playerSymbolPreview;
            container.appendChild(p);
            this.appendChild(container);
        }
    }

    /**
     * Remove the class preview
     */
    removePreview() {
        if (this.firstChild.classList.contains('player-preview')) {
            this.firstChild.remove();
        }
    }

}

/**
 * This class will manage all the panels of the game
 */
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

    /**
     * Array that will store the moves separately so as not to rely on the HTML in the count
     * @param {Array} board 
     */
    setBoard(board) {
        this.board = board
    }

    getBoardDivs() {
        return this.boardDivs;
    }

    /**
     * Array that will store the game's divs for easier reference
     * @param {Array} boardDivs 
     */
    setBoardDivs(boardDivs) {
        this.boardDivs = boardDivs;
    }

    /**
     * This function will create both arrays used during the game, like this
     * although we are forced to double for, at least we take advantage of it.
     */
    setBoards() {
        let height = document.getElementsByClassName('board')[0].childElementCount;
        let width = document.getElementsByClassName('line')[0].childElementCount;

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

    /**
     * This function will start the game by resetting the game board and arrays.
     */
    newGame() {
        let panelPlay = document.getElementById('panel');
        this.removeAll();
        this.makeBoard();
        this.selectorDance(player.getSymbol(), 1);
        this.setBoards();
        player.setTurn(true);
        player.setEndGame(false);
        panelPlay.classList.remove('no-visible');
    }

    /**
     * Depending on the player symbol will move to one side or the other, we add an option to reuse
     * the same function both in the beginning and in the course of the game
     * @param {String} symbol 
     * @param {Number} option 
     */
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

    /**
     * It will show the victory window if the conditions are met by receiving the player's symbol winner
     * @param {String} symbol 
     */
    reportVictory(symbol) {
        let board = document.getElementById('panel');
        let boardWin = document.getElementById('panel-win');
        let winner = document.getElementById('winner');
        let button = document.getElementById('retry');
        board.classList.add('no-visible');
        winner.innerHTML = symbol;
        boardWin.classList.remove('no-visible');
        button.addEventListener('click', this.retryGame)
    }

    /**
     * Function that will take us back to the initial screen
     */
    retryGame() {
        let boardWin = document.getElementById('panel-win')
        let boardWelcome = document.getElementById('panel-welcome')
        boardWin.classList.add('no-visible');
        boardWelcome.classList.remove('no-visible');
    }

    /**
     * Function that will erase the elements of the game panel for the reset
     */
    removeAll() {
        let board = document.getElementById('panel-game');
        while (board.firstChild) {
            board.removeChild(board.firstChild);
        }
    }

    /**
     * Function that will serve to draw each line of the board
     * @returns 
     */
    makeLine() {
        let number = 3;
        let line = document.createElement('div')
        line.classList = 'line'
        for (let i = 0; i < number; i++) {
            let cell = document.createElement('div')
            cell.classList = 'cell'
            cell.addEventListener('click', player.takeCell);
            cell.addEventListener('mouseover', player.drawPreviewPlayer)
            cell.addEventListener('mouseleave', player.removePreview)
            line.appendChild(cell);
        }
        return line;
    }

    /**
     * Function that calls the makeLine function as many times as necessary to form the board
     */
    makeBoard() {
        let number = 3;
        let board = document.getElementsByClassName('board')[0];
        for (let i = 0; i < number; i++) {
            board.appendChild(this.makeLine());
        }
    }

    /**
     * Function to choose the symbol of the main player
     */
    selectSymbol() {
        let father = this.parentElement;
        if (this.innerText == 'O') {
            player.setSymbol('O');
            player.setRivalSymbol('X');
            console.log('seleccionada O')
        } else {
            player.setSymbol('X');
            player.setRivalSymbol('O');
            console.log('seleccionada X')
        }
        nextPage(0);
    }

    /**
     * Function to choose how many players there will be, it serves to set the player before the game
     */
    selectNumPlayers() {
        let father = this.parentElement;
        if (this.innerText == '1') {
            player.setAutopilot(true);
            console.log('autopiloto activado')
            nextPage(1);
        } else {
            player.setAutopilot(false);
            father.parentElement.classList.add('no-visible')
            console.log('autopiloto desactivado')
            game.newGame();
        }
    }

    /**
     * Identical to the select player, it will serve to set the player according to the difficulty you are looking for
     */
    selectDif() {
        let father = this.parentElement;
        if (this.innerText === 'Easy') {
            player.setHard(false);
            console.log('modo facil')
        } else {
            player.setHard(true);
            console.log('modo dificil')
        }
        game.newGame();
        father.parentElement.classList.add('no-visible')
    }

    /**
     * Function that gives all the buttons their respective events, so we avoid placing this setting outside,
     * Marked as const so that its value cannot be modified
     */
    prepareEvents() {
        const selections = document.getElementsByClassName('selection');
        for (let element of selections) {
            element.addEventListener('click', game.selectSymbol);
        }
        const selectionsPlayers = document.getElementsByClassName('selection-players');
        for (let element of selectionsPlayers) {
            element.addEventListener('click', game.selectNumPlayers);
        }
        const selectionDif = document.getElementsByClassName('selection-dif');
        for (let element of selectionDif) {
            element.addEventListener('click', game.selectDif);
        }
    }
}

//We declare the player: the logic of the game, and the game: the game board
let player = new Player();
let game = new Game();

//We place the button events
game.prepareEvents();

/**
 * Number will serve to know from which side this function is called to act accordingly.
 * @param {Number} option 
 */
function nextPage(option = 0) {
    let welcome = document.getElementById('panel-welcome');
    let panelPlayers = document.getElementById('panel-players')
    let panelDif = document.getElementById('panel-dif')

    switch (option) {
        case 0:
            welcome.classList.add('no-visible');
            if (panelPlayers.classList.contains('no-visible')) {
                panelPlayers.classList.remove('no-visible');
            }
            break;
        case 1:
            panelPlayers.classList.add('no-visible')
            if (panelDif.classList.contains('no-visible')) {
                panelDif.classList.remove('no-visible');
            }
            break;
        default:
            console.log('out of range');
            break;

    }
}