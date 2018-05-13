var HEXSIDE_LENGTH = null;
var HEXDELTA_X = null;
var HEXDELTA_Y = null;
var HEXSTROKE = null;
var HEXBOARDER = null;

function setHexboardParameters(sideLength, stroke, boarder) {
    HEXSIDE_LENGTH = sideLength || 15;
    HEXDELTA_X = Math.cos(Raphael.rad(30)) * HEXSIDE_LENGTH;
    HEXDELTA_Y = Math.cos(Raphael.rad(60)) * HEXSIDE_LENGTH;
    HEXSTROKE = stroke || 2;
    HEXBOARDER = boarder || 10;
}

function hexboardWidth(boardLength) {
    return (boardLength * 2) - 1;
}

function hexboardHeight(boardLength) {
    return (boardLength * 2) - 1;
}

function inHexboardSpace(x, y, boardLenght) {
    return x + y >= (boardLenght - 1) &&
        x + y < ((hexboardHeight(boardLenght) + hexboardWidth(boardLenght)) - boardLenght);
}

function drawHexboard(board, boardLenght) {
    calculateHexes(board, boardLenght);
    var bw = hexboardWidth(boardLenght);
    var bh = hexboardHeight(boardLenght);
    var x_max = (HEXBOARDER * 2) + (bw * 2 * HEXDELTA_X);
    var y_max = (HEXBOARDER * 2) + (bh * 2 * HEXDELTA_Y) + (bh * HEXSIDE_LENGTH);
    var paper = Raphael(0, 0, x_max, y_max);

    for (var j = 0; j < board.length; j++) {
        var cell = board[j];
        var hexPath = "M" + cell.nw[0] + "," + cell.nw[1];
        hexPath += "L" + cell.sw[0] + "," + cell.sw[1];
        hexPath += "L" + cell.s[0] + "," + cell.s[1];
        hexPath += "L" + cell.se[0] + "," + cell.se[1];
        hexPath += "L" + cell.ne[0] + "," + cell.ne[1];
        hexPath += "L" + cell.n[0] + "," + cell.n[1];
        hexPath += "L" + cell.nw[0] + "," + cell.nw[1];
        var p = paper.path(hexPath);
        p.attr("stroke-width", HEXSTROKE);
        p.attr("stroke-linecap", "round");
        p.attr("stroke-linejoin", "round");
        board[j].p = p;
    }

    for (var j = 0; j < board.length; j++) {
        var cell = board[j];
        if ("drawers" in board[j]) {
            for (var i = 0; i < board[j].drawers.length; i++) {
                var drawer = board[j].drawers[i];
                var passthroughs = drawer.splice(1, drawer.length - 1);
                var params = [paper, board[j]].concat(passthroughs);
                drawer[0].apply(this, params);
            }
        }
    }
};

function calculateHexes(board, boardLenght) {
    for (var i = 0; i < board.length; i++) {
        var xoff = HEXBOARDER + (board[i].x * 2 * HEXDELTA_X) +
            ((board[i].y - boardLenght + 1) * HEXDELTA_X);
        var yoff = HEXBOARDER + (board[i].y * HEXDELTA_Y) +
            (board[i].y * HEXSIDE_LENGTH);
        board[i].nw = hexNW(xoff, yoff);
        board[i].sw = hexSW(xoff, yoff);
        board[i].s = hexS(xoff, yoff);
        board[i].se = hexSE(xoff, yoff);
        board[i].ne = hexNE(xoff, yoff);
        board[i].n = hexN(xoff, yoff);
        board[i].m = hexM(xoff, yoff);
    }
}

function hexNW(xoff, yoff) {
    return [xoff, yoff + HEXDELTA_Y];
}

function hexSW(xoff, yoff) {
    return [xoff, yoff + HEXDELTA_Y + HEXSIDE_LENGTH];
}

function hexS(xoff, yoff) {
    return [xoff + HEXDELTA_X, yoff + (2 * HEXDELTA_Y) + HEXSIDE_LENGTH];
}

function hexSE(xoff, yoff) {
    return [xoff + (2 * HEXDELTA_X), yoff + HEXDELTA_Y + HEXSIDE_LENGTH];
}

function hexNE(xoff, yoff) {
    return [xoff + (2 * HEXDELTA_X), yoff + HEXDELTA_Y];
}

function hexN(xoff, yoff) {
    return [xoff + HEXDELTA_X, yoff];
}

function hexM(xoff, yoff) {
    return [xoff + HEXDELTA_X, yoff + HEXDELTA_Y + (HEXSIDE_LENGTH / 2)];
}
