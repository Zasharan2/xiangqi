// xiangqi
 
// getting canvas and context
var c = document.getElementById("gameCanvas");
var ctx = c.getContext("2d");

var pDesc = document.getElementById("pieceDesc");

// disable right click context menu on canvas
c.addEventListener('contextmenu', (event)=>{
    event.preventDefault();
});

// mouse vars
var mX;
var mY;
 
// mouse event listener
window.addEventListener("mousemove", function(event) {
    mX = event.clientX - c.getBoundingClientRect().left;
    mY = event.clientY - c.getBoundingClientRect().top;
});
 
// click vars
var mouseDown;
var mouseButton;
 
// click event listeners
window.addEventListener("mousedown", function(event){
    mouseDown = true;
    mouseButton = event.button;
    onMouseDown();
});
window.addEventListener("mouseup", function(){
    mouseDown = false;
});

// pieces
var pieces = document.getElementById("pieces");

// screen
var screen = 1;

// board
var board = [
["rbn","nbn","bbn","abn","kbn","abn","bbn","nbn","rbn"],
["nnn","nnn","nnn","nnn","nnn","nnn","nnn","nnn","nnn"],
["nnn","cbn","nnn","nnn","nnn","nnn","nnn","cbn","nnn"],
["pbn","nnn","pbn","nnn","pbn","nnn","pbn","nnn","pbn"],
["nnn","nnn","nnn","nnn","nnn","nnn","nnn","nnn","nnn"],
["nnn","nnn","nnn","nnn","nnn","nnn","nnn","nnn","nnn"],
["prn","nnn","prn","nnn","prn","nnn","prn","nnn","prn"],
["nnn","crn","nnn","nnn","nnn","nnn","nnn","crn","nnn"],
["nnn","nnn","nnn","nnn","nnn","nnn","nnn","nnn","nnn"],
["rrn","nrn","brn","arn","krn","arn","brn","nrn","rrn"]]

var selected = [-2, -2];
var selected2;

var turns = true;
var turn = "r";

var check;
var checkColour;

var flying_general;

var checkmate;

// draw blank board function
function drawBlankBoard() {
    // set outline
    ctx.strokeStyle = "rgba(0, 0, 0)";
    ctx.lineWidth = 5;

    // background
    ctx.beginPath();
    ctx.fillStyle = "rgba(200, 100, 0)";
    ctx.fillRect(0, 0, 500, 550);
    ctx.strokeRect(0, 0, 500, 550);

    // board base
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 175, 60)";
    ctx.strokeRect(50, 50, 400, 450);
    ctx.fillRect(50, 50, 400, 450);

    // set outline
    ctx.strokeStyle = "rgba(0, 0, 0)";
    ctx.lineWidth = 2;

    // vertical lines
    for(var i = 100; i < 450; i += 50) {
        ctx.moveTo(i, 50);
        ctx.lineTo(i, 250);
        ctx.moveTo(i, 300);
        ctx.lineTo(i, 500);
    }

    // horizontal lines
    for(var i = 100; i < 500; i += 50) {
        ctx.moveTo(50, i);
        ctx.lineTo(450, i);
    }

    // diagonal lines
    ctx.moveTo(200, 50);
    ctx.lineTo(300, 150);
    ctx.moveTo(300, 50);
    ctx.lineTo(200, 150);
    ctx.moveTo(200, 400);
    ctx.lineTo(300, 500);
    ctx.moveTo(300, 400);
    ctx.lineTo(200, 500);

    // draw lines
    ctx.stroke();
}

function onMouseDown() {
    if ((Math.floor(mX - 25) / 50) > -1 && (Math.floor(mX - 25) / 50) < 9 && (Math.floor(mY - 25) / 50) > -1 && (Math.floor(mY - 25) / 50 < 10)) {
        if (selected[0] == -2 || selected[1] == -2) {
            selected = [Math.floor((mX - 25) / 50), Math.floor((mY - 25) / 50)];
            if (board[selected[1]][selected[0]] != "nnn" && ((!turns) || (turns && board[selected[1]][selected[0]][1] == turn))) {
                calcSelected(selected[0], selected[1]);
            } else {
                selected = [-2, -2];
                if (check) {
                    pDesc.innerHTML = "Check";
                } else {
                    pDesc.innerHTML = "";
                }
            }
        } else {
            selected2 = [Math.floor((mX - 25) / 50), Math.floor((mY - 25) / 50)];
            if (board[selected2[1]][selected2[0]] == "nnn") {
                for (var i = 0; i < 10; i++) {
                    for (var j = 0; j < 9; j++) {
                        board[i][j] = board[i][j][0] + board[i][j][1] + "n";
                    }
                }
                if (check) {
                    pDesc.innerHTML = "Check";
                } else {
                    pDesc.innerHTML = "";
                }
            } else {
                if (board[selected2[1]][selected2[0]][2] == "m") {
                    p = board[selected2[1]][selected2[0]];
                    board[selected2[1]][selected2[0]] = board[selected[1]][selected[0]];
                    board[selected[1]][selected[0]] = "nnn";
                    check = false;
                    flying_general = false;
                    pDesc.innerHTML = "";
                    for (var i = 0; i < 10; i++) {
                        for (var j = 0; j < 9; j++) {
                            if (board[i][j][0] != "n" && board[i][j][1] != "n") {
                                calcSelected(j, i);
                                for (var i2 = 0; i2 < 10; i2++) {
                                    for (var j2 = 0; j2 < 9; j2++) {
                                        if (board[i2][j2][0] == "k" && board[i2][j2][2] == "m") {
                                            check = true;
                                            checkColour = board[i2][j2][1];
                                            pDesc.innerHTML = "Check";
                                        }
                                        board[i2][j2] = board[i2][j2][0] + board[i2][j2][1] + "n";
                                    }
                                }
                            }
                        }
                    }
                    if ((check && checkColour == turn) || flying_general) {
                        pDesc.innerHTML = "Illegal Move";
                        board[selected[1]][selected[0]] = board[selected2[1]][selected2[0]];
                        board[selected2[1]][selected2[0]] = p;
                        flying_general = false;
                        check = false;
                    } else {
                        pDesc.innerHTML = "";
                        if (turns) {
                            if (turn == "b") {
                                turn = "r";
                            } else {
                                turn = "b";
                            }
                        }
                        selected = [-2, -2];
                    }
                    for (var i = 0; i < 10; i++) {
                        for (var j = 0; j < 9; j++) {
                            board[i][j] = board[i][j][0] + board[i][j][1] + "n";
                        }
                    }
                } else {
                    selected = selected2;
                    for (var i = 0; i < 10; i++) {
                        for (var j = 0; j < 9; j++) {
                            board[i][j] = board[i][j][0] + board[i][j][1] + "n";
                        }
                    }
                    if ((!turns) || (turns && board[selected[1]][selected[0]][1] == turn)) {
                        calcSelected(selected[0], selected[1]);
                    } else {
                        if (check) {
                            pDesc.innerHTML = "Check";
                        } else {
                            pDesc.innerHTML = "";
                        }
                    }
                }
            }
        }
    }
}

// draw board function
function drawBoard() {
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j][0] != "n" || board[i][j][1] != "n") {
                var piece = "";
                var col = 0;
                switch (board[i][j][1]) {
                    case "b": {
                        col = 0;
                        break;
                    }
                    case "r": {
                        col = 1;
                        break;
                    }
                    default: {
                        break;
                    }
                }
                switch (board[i][j][0]) {
                    case "r": {
                        if (col == 0) {
                            piece = "車";
                        } else {
                            piece = "俥";
                        }
                        break;
                    }
                    case "b": {
                        if (col == 0) {
                            piece = "象";
                        } else {
                            piece = "相";
                        }
                        break;
                    }
                    case "n": {
                        if (col == 0) {
                            piece = "馬";
                        } else {
                            piece = "傌";
                        }
                        break;
                    }
                    case "a": {
                        if (col == 0) {
                            piece = "士";
                        } else {
                            piece = "仕";
                        }
                        break;
                    }
                    case "k": {
                        if (col == 0) {
                            piece = "將";
                        } else {
                            piece = "帥";
                        }
                        break;
                    }
                    case "c": {
                        if (col == 0) {
                            piece = "砲";
                        } else {
                            piece = "炮";
                        }
                        break;
                    }
                    case "p": {
                        if (col == 0) {
                            piece = "卒";
                        } else {
                            piece = "兵";
                        }
                        break;
                    }
                    default: {
                        break;
                    }
                }
                drawPiece(j, i, piece, col);
            }
            if (board[i][j][2] == "m") {
                drawOption(j, i);
            }
        }
    }
}

// draw option function
function drawOption(x, y) {
    // set outline
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 4;

    // draw circle
    ctx.beginPath();
    ctx.arc((x + 1) * 50, (y + 1) * 50, 10, 0, 2 * Math.PI);

    // outline circle
    ctx.stroke();

    // mouse hover
    if (Math.floor((mX - 25) / 50) == x && Math.floor((mY - 25) / 50) == y) {
        // set colour
        ctx.fillStyle = "#ffffff80";

        // draw circle
        ctx.beginPath();
        ctx.arc((x + 1) * 50, (y + 1) * 50, 10, 0, 2 * Math.PI);

        // fill circle
        ctx.fill();
    }
}

// draw piece function
function drawPiece(x, y, p, c) {
    // set outline
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;

    // set colour
    ctx.fillStyle = "#fedaa4"

    // draw circle
    ctx.beginPath();
    ctx.arc((x + 1) * 50, (y + 1) * 50, 25, 0, 2 * Math.PI);

    // fill & outline circle
    ctx.fill();
    ctx.stroke();

    // set outline
    if (c == 0) {
        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#000000";
    } else {
        ctx.strokeStyle = "#cc0000";
        ctx.fillStyle = "#cc0000";
    }
    ctx.lineWidth = 2;

    // draw circle
    ctx.beginPath();
    ctx.arc((x + 1) * 50, (y + 1) * 50, 21, 0, 2 * Math.PI);

    // outline circle
    ctx.stroke();

    // write letter
    ctx.beginPath();
    ctx.font = "25px Verdana";
    ctx.fillText(p, (x + 1) * 50 - 12.5, (y + 1) * 50 + 9);

    // mouse hover
    if (Math.floor((mX - 25) / 50) == x && Math.floor((mY - 25) / 50) == y) {
        // set colour
        ctx.fillStyle = "#ffffff80";

        // draw circle
        ctx.beginPath();
        ctx.arc((x + 1) * 50, (y + 1) * 50, 25, 0, 2 * Math.PI);

        // fill circle
        ctx.fill();
    }
}

function drawTurnText() {
    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(3, 3, 80, 12);
    ctx.font = "10px Verdana";
    if (turn == "r") {
        ctx.fillStyle = "#ff0000";
        ctx.fillText("Red to move", 5, 12);
    } else if (turn == "b") {
        ctx.fillStyle = "#000000";
        ctx.fillText("Black to move", 5, 12);
    }
}

function calcSelected(x, y) {
    switch (board[y][x][0]) {
        case "r": {
            pDesc.innerHTML = "Rook<br>The rook in Xiangqi operates the same as the Rook in International Chess.";
            var i = y;
            while (true) {
                i++;
                if (i > 9) {
                    break;
                }
                if (board[i][x][1] == "n") {
                    board[i][x] = board[i][x][0] + board[i][x][1] + "m";
                } else {
                    if (board[i][x][1] == board[y][x][1]) {
                        break;
                    }
                    if (board[i][x][1] != board[y][x][1]) {
                        board[i][x] = board[i][x][0] + board[i][x][1] + "m";
                        break;
                    }
                }
            }
            i = y;
            while (true) {
                i--;
                if (i < 0) {
                    break;
                }
                if (board[i][x][1] == "n") {
                    board[i][x] = board[i][x][0] + board[i][x][1] + "m";
                } else {
                    if (board[i][x][1] == board[y][x][1]) {
                        break;
                    }
                    if (board[i][x][1] != board[y][x][1]) {
                        board[i][x] = board[i][x][0] + board[i][x][1] + "m";
                        break;
                    }
                }
            }
            i = x;
            while (true) {
                i++;
                if (i > 8) {
                    break;
                }
                if (board[y][i][1] == "n") {
                    board[y][i] = board[y][i][0] + board[y][i][1] + "m";
                } else {
                    if (board[y][i][1] == board[y][x][1]) {
                        break;
                    }
                    if (board[y][i][1] != board[y][x][1]) {
                        board[y][i] = board[y][i][0] + board[y][i][1] + "m";
                        break;
                    }
                }
            }
            i = x;
            while (true) {
                i--;
                if (i < 0) {
                    break;
                }
                if (board[y][i][1] == "n") {
                    board[y][i] = board[y][i][0] + board[y][i][1] + "m";
                } else {
                    if (board[y][i][1] == board[y][x][1]) {
                        break;
                    }
                    if (board[y][i][1] != board[y][x][1]) {
                        board[y][i] = board[y][i][0] + board[y][i][1] + "m";
                        break;
                    }
                }
            }

            break;
        }

        case "b": {
            pDesc.innerHTML = "Bishop<br>The bishop in Xiangqi moves exactly two spaces diagonally at a time. It may not move if a piece is in between the destination and the bishop. Bishops can capture opponents by landing directly on top of their piece.";
            if (board[y][x][1] == "b") {
                if (y + 2 < 5) {
                    if (board[y + 1][x + 1] == "nnn" && board[y + 2][x + 2][1] != "b") {
                        board[y + 2][x + 2] = board[y + 2][x + 2][0] + board[y + 2][x + 2][1] + "m";
                    }
                    if (board[y + 1][x - 1] == "nnn" && board[y + 2][x - 2][1] != "b") {
                        board[y + 2][x - 2] = board[y + 2][x - 2][0] + board[y + 2][x - 2][1] + "m";
                    }
                }
                if (y - 2 > -1) {
                    if (board[y - 1][x + 1] == "nnn" && board[y - 2][x + 2][1] != "b") {
                        board[y - 2][x + 2] = board[y - 2][x + 2][0] + board[y - 2][x + 2][1] + "m";
                    }
                    if (board[y - 1][x - 1] == "nnn" && board[y - 2][x - 2][1] != "b") {
                        board[y - 2][x - 2] = board[y - 2][x - 2][0] + board[y - 2][x - 2][1] + "m";
                    }
                }
            }
            if (board[y][x][1] == "r") {
                if (y + 2 < 10) {
                    if (board[y + 1][x + 1] == "nnn" && board[y + 2][x + 2][1] != "r") {
                        board[y + 2][x + 2] = board[y + 2][x + 2][0] + board[y + 2][x + 2][1] + "m";
                    }
                    if (board[y + 1][x - 1] == "nnn" && board[y + 2][x - 2][1] != "r") {
                        board[y + 2][x - 2] = board[y + 2][x - 2][0] + board[y + 2][x - 2][1] + "m";
                    }
                }
                if (y - 2 > 4) {
                    if (board[y - 1][x + 1] == "nnn" && board[y - 2][x + 2][1] != "r") {
                        board[y - 2][x + 2] = board[y - 2][x + 2][0] + board[y - 2][x + 2][1] + "m";
                    }
                    if (board[y - 1][x - 1] == "nnn" && board[y - 2][x - 2][1] != "r") {
                        board[y - 2][x - 2] = board[y - 2][x - 2][0] + board[y - 2][x - 2][1] + "m";
                    }
                }
            }

            break;
        }

        case "n": {
            pDesc.innerHTML = "Knight<br>The knight in Xiangqi can move one unit vertically or horizontally, and then diagonally. The knight may not move if a piece blocks it directly horizontally or directly vertically. The knight may capture an opponent's piece by landing directly on top of it.";
            if (x - 2 > -1) {
                if (y - 1 > -1) {
                    if (board[y][x - 1] == "nnn" && board[y - 1][x - 2][1] != board[y][x][1]) {
                        board[y - 1][x - 2] = board[y - 1][x - 2][0] + board[y - 1][x - 2][1] + "m";
                    }
                }
                if (y + 1 < 10) {
                    if (board[y][x - 1] == "nnn" && board[y + 1][x - 2][1] != board[y][x][1]) {
                        board[y + 1][x - 2] = board[y + 1][x - 2][0] + board[y + 1][x - 2][1] + "m";
                    }
                }
            }
            if (x + 2 < 9) {
                if (y - 1 > -1) {
                    if (board[y][x + 1] == "nnn" && board[y - 1][x + 2][1] != board[y][x][1]) {
                        board[y - 1][x + 2] = board[y - 1][x + 2][0] + board[y - 1][x + 2][1] + "m";
                    }
                }
                if (y + 1 < 10) {
                    if (board[y][x + 1] == "nnn" && board[y + 1][x + 2][1] != board[y][x][1]) {
                        board[y + 1][x + 2] = board[y + 1][x + 2][0] + board[y + 1][x + 2][1] + "m";
                    }
                }
            }
            if (y - 2 > -1) {
                if (x - 1 > -1) {
                    if (board[y - 1][x] == "nnn" && board[y - 2][x - 1][1] != board[y][x][1]) {
                        board[y - 2][x - 1] = board[y - 2][x - 1][0] + board[y - 2][x - 1][1] + "m";
                    }
                }
                if (x + 1 < 9) {
                    if (board[y - 1][x] == "nnn" && board[y - 2][x + 1][1] != board[y][x][1]) {
                        board[y - 2][x + 1] = board[y - 2][x + 1][0] + board[y - 2][x + 1][1] + "m";
                    }
                }
            }
            if (y + 2 < 10) {
                if (x - 1 > -1) {
                    if (board[y + 1][x] == "nnn" && board[y + 2][x - 1][1] != board[y][x][1]) {
                        board[y + 2][x - 1] = board[y + 2][x - 1][0] + board[y + 2][x - 1][1] + "m";
                    }
                }
                if (x + 1 < 9) {
                    if (board[y + 1][x] == "nnn" && board[y + 2][x + 1][1] != board[y][x][1]) {
                        board[y + 2][x + 1] = board[y + 2][x + 1][0] + board[y + 2][x + 1][1] + "m";
                    }
                }
            }

            break;
        }

        case "c": {
            pDesc.innerHTML = "Cannon<br>The cannon in Xiangqi moves the same as a rook in International Chess, but it's method of capture is different. In order to capture a piece, a cannon must have another piece in between it and it's target in a straight line horizontally or vertically.";
            var i = y;
            while (true) {
                i++;
                if (i > 9) {
                    break;
                }
                if (board[i][x][1] == "n") {
                    board[i][x] = board[i][x][0] + board[i][x][1] + "m";
                } else {
                    while (true) {
                        i++;
                        if (i > 9) {
                            break;
                        }
                        if (board[i][x][1] != "n" && board[i][x][1] != board[y][x][1]) {
                            board[i][x] = board[i][x][0] + board[i][x][1] + "m";
                            break;
                        } else {
                            if (board[i][x][1] != "n") {
                                break;
                            }
                        }

                    }
                    break;
                }
            }
            i = y;
            while (true) {
                i--;
                if (i < 0) {
                    break;
                }
                if (board[i][x][1] == "n") {
                    board[i][x] = board[i][x][0] + board[i][x][1] + "m";
                } else {
                    while (true) {
                        i--;
                        if (i < 0) {
                            break;
                        }
                        if (board[i][x][1] != "n" && board[i][x][1] != board[y][x][1]) {
                            board[i][x] = board[i][x][0] + board[i][x][1] + "m";
                            break;
                        } else {
                            if (board[i][x][1] != "n") {
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            i = x;
            while (true) {
                i++;
                if (i > 8) {
                    break;
                }
                if (board[y][i][1] == "n") {
                    board[y][i] = board[y][i][0] + board[y][i][1] + "m";
                } else {
                    while (true) {
                        i++;
                        if (i > 8) {
                            break;
                        }
                        if (board[y][i][1] != "n" && board[y][i][1] != board[y][x][1]) {
                            board[y][i] = board[y][i][0] + board[y][i][1] + "m";
                            break;
                        } else {
                            if (board[y][i][1] != "n") {
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            i = x;
            while (true) {
                i--;
                if (i < 0) {
                    break;
                }
                if (board[y][i][1] == "n") {
                    board[y][i] = board[y][i][0] + board[y][i][1] + "m";
                } else {
                    while (true) {
                        i--;
                        if (i < 0) {
                            break;
                        }
                        if (board[y][i][1] != "n" && board[y][i][1] != board[y][x][1]) {
                            board[y][i] = board[y][i][0] + board[y][i][1] + "m";
                            break;
                        } else {
                            if (board[y][i][1] != "n") {
                                break;
                            }
                        }
                    }
                    break;
                }
            }

            break;
        }

        case "p": {
            pDesc.innerHTML = "Pawn<br>The pawn in Xiangqi can move one space vertically towards the opposite side. Once the pawn crosses the river, it can additionally move left and right one space. It captures opposing pieces by moving on top of them.";
            if (board[y][x][1] == "b") {
                if (y + 1 < 10) {
                    if (board[y + 1][x][1] != "b") {
                        board[y + 1][x] = board[y + 1][x][0] + board[y + 1][x][1] + "m";
                    }
                }
                if (y > 4) {
                    if (x + 1 < 9) {
                        if (board[y][x + 1][1] != "b") {
                            board[y][x + 1] = board[y][x + 1][0] + board[y][x + 1][1] + "m";
                        }
                    }
                    if (x - 1 > -1) {
                        if (board[y][x - 1][1] != "b") {
                            board[y][x - 1] = board[y][x - 1][0] + board[y][x - 1][1] + "m";
                        }
                    }
                }
            }
            if (board[y][x][1] == "r") {
                if (y - 1 > -1) {
                    if (board[y - 1][x][1] != "r") {
                        board[y - 1][x] = board[y - 1][x][0] + board[y - 1][x][1] + "m";
                    }
                }
                if (y < 5) {
                    if (x + 1 < 9) {
                        if (board[y][x + 1][1] != "r") {
                            board[y][x + 1] = board[y][x + 1][0] + board[y][x + 1][1] + "m";
                        }
                    }
                    if (x - 1 > -1) {
                        if (board[y][x - 1][1] != "r") {
                            board[y][x - 1] = board[y][x - 1][0] + board[y][x - 1][1] + "m";
                        }
                    }
                }
            }

            break;
        }

        case "a": {
            pDesc.innerHTML = "Advisor<br>The advisor in Xiangqi can move one space diagonally at a time. It may not exit the palace, which is the box that has diagonal lines connecting the corners. The advisor captures an opponent's piece by moving on top of it.";
            if (board[y][x][1] == "b") {
                if (x - 1 > 2) {
                    if (y - 1 > -1) {
                        if (board[y - 1][x - 1][1] != board[y][x][1]) {
                            board[y - 1][x - 1] = board[y - 1][x - 1][0] + board[y - 1][x - 1][1] + "m";
                        }
                    }
                    if (y + 1 < 3) {
                        if (board[y + 1][x - 1][1] != board[y][x][1]) {
                            board[y + 1][x - 1] = board[y + 1][x - 1][0] + board[y + 1][x - 1][1] + "m";
                        }
                    }
                }
                if (x + 1 < 6) {
                    if (y - 1 > -1) {
                        if (board[y - 1][x + 1][1] != board[y][x][1]) {
                            board[y - 1][x + 1] = board[y - 1][x + 1][0] + board[y - 1][x + 1][1] + "m";
                        }
                    }
                    if (y + 1 < 3) {
                        if (board[y + 1][x + 1][1] != board[y][x][1]) {
                            board[y + 1][x + 1] = board[y + 1][x + 1][0] + board[y + 1][x + 1][1] + "m";
                        }
                    }
                }
            }
            if (board[y][x][1] == "r") {
                if (x - 1 > 2) {
                    if (y - 1 > 6) {
                        if (board[y - 1][x - 1][1] != board[y][x][1]) {
                            board[y - 1][x - 1] = board[y - 1][x - 1][0] + board[y - 1][x - 1][1] + "m";
                        }
                    }
                    if (y + 1 < 10) {
                        if (board[y + 1][x - 1][1] != board[y][x][1]) {
                            board[y + 1][x - 1] = board[y + 1][x - 1][0] + board[y + 1][x - 1][1] + "m";
                        }
                    }
                }
                if (x + 1 < 6) {
                    if (y - 1 > 6) {
                        if (board[y - 1][x + 1][1] != board[y][x][1]) {
                            board[y - 1][x + 1] = board[y - 1][x + 1][0] + board[y - 1][x + 1][1] + "m";
                        }
                    }
                    if (y + 1 < 10) {
                        if (board[y + 1][x + 1][1] != board[y][x][1]) {
                            board[y + 1][x + 1] = board[y + 1][x + 1][0] + board[y + 1][x + 1][1] + "m";
                        }
                    }
                }
            }

            break;
        }

        case "k": {
            pDesc.innerHTML = "King<br>The king is the most important piece of Xiangqi. Upon its checkmate, the opponent wins. The king can move one unit horizontally or vertically, but is confined to the palace, which is the box that has diagonal lines connecting the corners. The king captures a piece by moving directly on top of it. If the two kings are unobstructed within the same column, they may check each other.";
            if (board[y][x][1] == "b") {
                var i = y;
                while(true) {
                    i++;
                    if (i > 9) {
                        break;
                    }
                    if (board[i][x] != "nnn" && board[i][x][0] != "k") {
                        break;
                    } else {
                        if (board[i][x][0] == "k") {
                            board[i][x] = board[i][x][0] + board[i][x][1] + "m";
                            flying_general = true;
                            break;
                        }
                    }
                }

                if (y - 1 > -1) {
                    if (board[y - 1][x][1] != board[y][x][1]) {
                        board[y - 1][x] = board[y - 1][x][0] + board[y - 1][x][1] + "m";
                    }
                }
                if (y + 1 < 3) {
                    if (board[y + 1][x][1] != board[y][x][1]) {
                        board[y + 1][x] = board[y + 1][x][0] + board[y + 1][x][1] + "m";
                    }
                }
                if (x - 1 > 2) {
                    if (board[y][x - 1][1] != board[y][x][1]) {
                        board[y][x - 1] = board[y][x - 1][0] + board[y][x - 1][1] + "m";
                    }
                }
                if (x + 1 < 6) {
                    if (board[y][x + 1][1] != board[y][x][1]) {
                        board[y][x + 1] = board[y][x + 1][0] + board[y][x + 1][1] + "m";
                    }
                }
            }
            if (board[y][x][1] == "r") {
                var i = y;
                while(true) {
                    i--;
                    if (i < 0) {
                        break;
                    }
                    if (board[i][x] != "nnn" && board[i][x][0] != "k") {
                        break;
                    } else {
                        if (board[i][x][0] == "k") {
                            board[i][x] = board[i][x][0] + board[i][x][1] + "m";
                            flying_general = true;
                            break;
                        }
                    }
                }

                if (y - 1 > 6) {
                    if (board[y - 1][x][1] != board[y][x][1]) {
                        board[y - 1][x] = board[y - 1][x][0] + board[y - 1][x][1] + "m";
                    }
                }
                if (y + 1 < 10) {
                    if (board[y + 1][x][1] != board[y][x][1]) {
                        board[y + 1][x] = board[y + 1][x][0] + board[y + 1][x][1] + "m";
                    }
                }
                if (x - 1 > 2) {
                    if (board[y][x - 1][1] != board[y][x][1]) {
                        board[y][x - 1] = board[y][x - 1][0] + board[y][x - 1][1] + "m";
                    }
                }
                if (x + 1 < 6) {
                    if (board[y][x + 1][1] != board[y][x][1]) {
                        board[y][x + 1] = board[y][x + 1][0] + board[y][x + 1][1] + "m";
                    }
                }
            }

            break;
        }

        default: {
            break;
        }
    }
}

// main function
function main() {
    switch (screen) {
        // menu
        case 0: {
            break;
        }
        // game
        case 1: {
            drawBlankBoard();

            drawBoard();

            drawTurnText();

            break;
        }
        default: {
            // blank screen
            ctx.beginPath();
            ctx.fillStyle = "rgba(200, 100, 0)";
            ctx.fillRect(0, 0, 550, 600);
            break;
        }
    }
}

// run function
function run() {
    main();
    window.requestAnimationFrame(run);
}
window.requestAnimationFrame(run);