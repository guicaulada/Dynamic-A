var SIDE_LENGTH = null;
var DELTA_X = null;
var DELTA_Y = null;
var STROKE = null;
var BOARDER = null;


/**
 * Set the render parameters for the board.
 *
 * @param {number} side_length The length of each hexagonal cell's side.
 *                             Default is 15.
 * @param {number} stroke The width of each stroke.  Default is 2.
 * @param {number} boarder The margin for the board.  Default is 10.
 */
function set_board_parameters(side_length, stroke, boarder) {
    SIDE_LENGTH = side_length || 15;
    DELTA_X = Math.cos(Raphael.rad(30)) * SIDE_LENGTH;
    DELTA_Y = Math.cos(Raphael.rad(60)) * SIDE_LENGTH;
    STROKE = stroke || 2;
    BOARDER = boarder || 10;
}

function board_width(board_length) {
    return (board_length * 2) - 1;
}

function board_height(board_length) {
    return (board_length * 2) - 1;
}

/**
 * Check if a cartesian coordinate is inside the drawable board space.
 *
 * The drawable board space is hexagonally shaped, which means that a square
 * grid will not include all its coordinates.
 *
 * For example, a board_length 3 grid will allow these coordinates (. denotes
 * coordinates which are not in_board_space()):
 *
 *   0 1 2 3 4 x-axis
 * 0 . . _ _ _
 * 1 . _ _ _ _
 * 2 _ _ _ _ _
 * 3 _ _ _ _ .
 * 4 _ _ _ . .
 *
 * y
 * |
 * a
 * x
 * i
 * s
 *
 * The above coordinates correspond to the following hexagonal grid:
 *
 *       (2,0) (3,0) (4,0)
 *
 *    (1,1) (2,1) (3,1) (4,1)
 *
 * (0,2) (1,2) (2,2) (3,2) (4,2)
 *
 *    (0,3) (1,3) (2,3) (3,3)
 *
 *       (0,4) (1,4) (2,4)
 *
 * @param {number} x The cartesian x coordinate.
 * @param {number} y The cartesian y coordinate.
 * @param {number} board_length The length of the side of the board.
 */
function in_board_space(x, y, board_length) {
    return x + y >= (board_length - 1) &&
        x + y < ((board_height(board_length) + board_width(board_length)) - board_length);
}

/**
 * Draw the board.
 *
 * @param {array} board The array/list of coordinate objects, whose
 *                      coordinates are denoted by .x and .y.  These
 *                      must adhere to in_board_space().
 *                      Each object may optionally include the 'colour' member,
 *                      which will be used to fill the cell's background.
 *                      Each object may optionally provide 'drawers', an
 *                      ordered array of arrays.  The first item in the
 *                      sub-array is the callback function used to draw on top
 *                      of the cell.  This callback must take at least 2
 *                      arguments, first is the Raphael paper to draw on,
 *                      second is the cell itself which is being drawn in.  The
 *                      remaining items in the sub-array are passed through
 *                      to the callback.
 * @param {number} board_length The length of the side of the board.
 */
function drawboard(board, board_length) {
    calculate_hexes(board, board_length);
    var bw = board_width(board_length);
    var bh = board_height(board_length);
    var x_max = (BOARDER * 2) + (bw * 2 * DELTA_X);
    var y_max = (BOARDER * 2) + (bh * 2 * DELTA_Y) + (bh * SIDE_LENGTH);
    var paper = Raphael(0, 0, x_max, y_max);

    for (var j = 0; j < board.length; j++) {
        var cell = board[j];
        var hex_path = "M" + cell.nw[0] + "," + cell.nw[1];
        hex_path += "L" + cell.sw[0] + "," + cell.sw[1];
        hex_path += "L" + cell.s[0] + "," + cell.s[1];
        hex_path += "L" + cell.se[0] + "," + cell.se[1];
        hex_path += "L" + cell.ne[0] + "," + cell.ne[1];
        hex_path += "L" + cell.n[0] + "," + cell.n[1];
        hex_path += "L" + cell.nw[0] + "," + cell.nw[1];
        var p = paper.path(hex_path);
        p.attr("stroke-width", STROKE);
        p.attr("stroke-linecap", "round");
        p.attr("stroke-linejoin", "round");

        if ("colour" in board[j]) {
            p.attr("fill", board[j].colour);
        }
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

/**
 * Calculates the hex points for a list of board coordinates.
 *
 * The result of this call is to add/set these points on each item
 * in the board.  These values may be used later, for example by a
 * drawer, and they correspond to the following hex layout:
 *
 *      n
 *  nw     ne
 *      m
 *  sw     se
 *      s
 *
 *
 * @param {array} board The array/list of coordinate objects, whose
 *                      coordinates are denoted by .x and .y.
 * @param {number} board_length The length of the side of the board.
 */
function calculate_hexes(board, board_length) {
    for (var i = 0; i < board.length; i++) {
        var xoff = BOARDER + (board[i].x * 2 * DELTA_X) +
            ((board[i].y - board_length + 1) * DELTA_X);
        var yoff = BOARDER + (board[i].y * DELTA_Y) +
            (board[i].y * SIDE_LENGTH);
        board[i].nw = hex_nw(xoff, yoff);
        board[i].sw = hex_sw(xoff, yoff);
        board[i].s = hex_s(xoff, yoff);
        board[i].se = hex_se(xoff, yoff);
        board[i].ne = hex_ne(xoff, yoff);
        board[i].n = hex_n(xoff, yoff);
        board[i].m = hex_m(xoff, yoff);
    }
}

function hex_nw(xoff, yoff) {
    return [xoff, yoff + DELTA_Y];
}

function hex_sw(xoff, yoff) {
    return [xoff, yoff + DELTA_Y + SIDE_LENGTH];
}

function hex_s(xoff, yoff) {
    return [xoff + DELTA_X, yoff + (2 * DELTA_Y) + SIDE_LENGTH];
}

function hex_se(xoff, yoff) {
    return [xoff + (2 * DELTA_X), yoff + DELTA_Y + SIDE_LENGTH];
}

function hex_ne(xoff, yoff) {
    return [xoff + (2 * DELTA_X), yoff + DELTA_Y];
}

function hex_n(xoff, yoff) {
    return [xoff + DELTA_X, yoff];
}

function hex_m(xoff, yoff) {
    return [xoff + DELTA_X, yoff + DELTA_Y + (SIDE_LENGTH / 2)];
}
