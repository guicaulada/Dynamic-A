var BOARD_LENGTH = 7;
var COLOUR_WATER = "cyan";

var grid;


window.onload = function() {
    grid = make_hexagonal_board();
    set_board_parameters(25, 3, 5);
    drawboard(grid, BOARD_LENGTH);
}

function make_hexagonal_board() {
    var grid = make_hexagonal_grid();

    for (var i = 0; i < grid.length; i++) {
        var cell = grid[i];
    }

    return grid;
}

function make_hexagonal_grid() {
    var grid = [];

    for (var x = 0; x < board_width(BOARD_LENGTH); x++ ) {
        for (var y = 0; y < board_height(BOARD_LENGTH); y++) {
            if (in_board_space(x, y, BOARD_LENGTH)) {
                grid.push({
                    "x": x,
                    "y": y,
                    "drawers": [[draw_coord]],
                });
            }
        }
    }

    return grid;
}

function draw_coord(paper, cell) {
    let text = paper.text(cell.m[0], cell.m[1], cell.x + "," + cell.y);
    text.mousedown(function() {
        cell.colour = 'grey';
    });
}

function draw_wave(paper, cell, extra_1, extra_2) {
    var curve = "M" + (cell.sw[0] + (DELTA_X / 2)) + "," +
        (cell.sw[1] + (DELTA_Y / 2));
    curve += "C" + cell.sw[0] + "," + cell.sw[1];
    curve += " " + cell.se[0] + "," + cell.se[1];
    curve += " " + cell.m[0] + "," + cell.m[1];
    curve += "S" + cell.ne[0] + "," + cell.ne[1];
    curve += " " + (cell.n[0] + (DELTA_X / 2))  + "," +
        (cell.n[1] + (DELTA_Y / 2));
    var p = paper.path(curve);
    p.attr("stroke-width", 2);
    p.attr("stroke", "red");
}
