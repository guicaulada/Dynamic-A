
var rectGrid;
var rectGraph;
var rectStart;
var rectEnd;

function makeRectgrid(width, height, length) {
    var paper = Raphael(600, 15, width*length, height*length);
    var grid = [];
    var i = 0;
    for (var x = 0; x < length; x++) {
        for (var y = 0; y < length; y++) {

            var offsetx = x;
            var moveRight = (x + width - offsetx) * x;

            var offsetj = y;
            var moveDown = (y + height - offsetj) * y;

            var p = paper.rect(moveRight, moveDown, width, height);

            grid[i] = {
                x: x,
                y: y,
                walkable: true,
                p:p
            }
            
            p.attr("fill", "#fff");
            p.attr("stroke", "#000");
            p.attr("stroke-width", 2);
            p.attr("stroke-linecap", "round");
            p.attr("stroke-linejoin", "round");
            p.__parent__ = grid[i];
            i++;
        }
    }
    return grid;
}

function prepareRectgraph() {
    for (var cell of rectGrid) {
        rectGraph.grid[cell.x][cell.y].weight = (cell.walkable) ? 1 : 0;
        rectGraph.grid[cell.x][cell.y].cell = cell;
    }
}

function runRectstar() {
    if (rectStart && rectEnd) {
        var start = rectGraph.grid[rectStart.x][rectStart.y];
        var end = rectGraph.grid[rectEnd.x][rectEnd.y];
        var result = astar.search(rectGraph, start, end);
        for (node of result) {
            node.cell.p.attr({fill: "blue"});
        }
        start.cell.p.attr({fill: "green"});
        end.cell.p.attr({fill: "red"});
        console.log(result);
    }
}

function makeBinaryRectgrid(length) {
    var grid = [];
    for (var x = 0; x < length; x++) {
        for (var y = 0; y < length; y++) {
            if (!grid[x]) grid[x] = [];
            grid[x][y] = 1;
        }
    }
    return grid;
}

function setRectgridClicks() {
    for (var i = 0; i < rectGrid.length; i++) {
        rectGrid[i].p.click(function (event) {
            var cell = this.__parent__;
            if (event.shiftKey) {
                cell.walkable = true;
                if (rectStart) {
                    rectStart.p.attr({ fill: "white" })
                }
                rectStart = cell;
                rectStart.p.attr({ fill: "green" });
            } else if (event.ctrlKey) {
                cell.walkable = true;
                if (rectEnd) {
                    rectEnd.p.attr({ fill: "white" });
                }
                rectEnd = cell;
                rectEnd.p.attr({ fill: "red" });
            } else {
                if (cell.walkable) {
                    cell.p.attr({ fill: "grey" });
                    cell.walkable = false;
                } else {
                    cell.p.attr({ fill: "white" });
                    cell.walkable = true;
                }
            }
            console.log(this);
            console.log('Clicked on Rect[' + cell.x + ',' + cell.y + ']');
        });
    }
}

function drawRectCoords(paper, cell) {
    var text = paper.text(cell.m[0], cell.m[1], cell.x + "," + cell.y);
}