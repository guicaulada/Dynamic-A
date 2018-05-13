var HEXBOARD_RADIUS = 7;

var hexGrid;
var hexGraph;
var hexStart;
var hexEnd;

function makeHexgrid() {
    var grid = [];

    for (var x = 0; x < hexboardWidth(HEXBOARD_RADIUS); x++) {
        for (var y = 0; y < hexboardHeight(HEXBOARD_RADIUS); y++) {
            if (inHexboardSpace(x, y, HEXBOARD_RADIUS)) {
                grid.push({
                  x: x,
                  y: y,
                  drawers: [[drawHexCoords]],
                  walkable: true
                });
            }
        }
    }

    return grid;
}

function makeBinaryHexgrid() {
    var grid = [];

    for (var x = 0; x < hexboardWidth(HEXBOARD_RADIUS); x++) {
        for (var y = 0; y < hexboardHeight(HEXBOARD_RADIUS); y++) {
            if (!grid[x]) grid[x] = [];
            if (inHexboardSpace(x, y, HEXBOARD_RADIUS)) {
                grid[x][y] = 1;
            } else {
                grid[x][y] = 0;
            }
        }
    }

    return grid;
}

function prepareHexgraph() {
    for (var cell of hexGrid) {
        hexGraph.grid[cell.x][cell.y].weight = (cell.walkable) ? 1 : 0;
        hexGraph.grid[cell.x][cell.y].cell = cell;
    }
}

function runHexstar() {
    if (hexStart && hexEnd) {
        var start = hexGraph.grid[hexStart.x][hexStart.y];
        var end = hexGraph.grid[hexEnd.x][hexEnd.y];
        var result = astar.search(hexGraph, start, end);
        for (node of result) {
            node.cell.p.attr({fill: "blue"});
        }
        start.cell.p.attr({fill:"green"});
        end.cell.p.attr({fill:"red"});
        console.log(result);
    }
}

function drawHexCoords(paper, cell) {
    var text = paper.text(cell.m[0], cell.m[1], cell.x + "," + cell.y);
}

document.addEventListener("click", function (event) {
    var closest = {
        dm: 10000
    };
    for (var i = 0; i < hexGrid.length; i++) {
        var cell = hexGrid[i];
        var dm = (Math.abs(event.clientX - cell.m[0])) + (Math.abs(event.clientY - cell.m[1]))
        if (dm < 25 && dm < closest.dm) {
            closest.dm = dm;
            closest.cell = cell;
        }
    }
    if (closest.cell) {
        if (event.shiftKey) {
            closest.cell.walkable = true;
            if (hexStart) {
                hexStart.p.attr({fill: "white"})
            }
            hexStart = closest.cell;
            hexStart.p.attr({fill: "green"});
        } else if (event.ctrlKey) {
            closest.cell.walkable = true;
            if (hexEnd) {
                hexEnd.p.attr({fill: "white"});
            }
            hexEnd = closest.cell;
            hexEnd.p.attr({fill: "red"});
        } else {
            if (closest.cell.walkable) {
                closest.cell.p.attr({fill: "grey"});
                closest.cell.walkable = false;
            } else {
                closest.cell.p.attr({fill: "white"});
                closest.cell.walkable = true;
            }
        }
        console.log('Clicked on Hex[' + closest.cell.x + ',' + closest.cell.y + ']');
    }
});