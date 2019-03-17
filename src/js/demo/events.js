
let connectedCells = {};
let tempCells = [];

let desconnected = 1;
let rectManhattan = 1;
let hexManhattan = 0;
let mouseDown = false;
let mouseX = 0;
let mouseY = 0;

window.onload = () => {
    // Load rectangular grid for demo
    rectGrid = new Rectgrid(rectLength);
    rectGraph = new Graph(rectGrid.nodes);
    rectBoard = new Rectboard(rectGrid, {
        width: rectWidth,
        height: rectHeight,
        x: rectPosX,
        y: rectPosY,
    });
    rectBoard.drawRectboard();
    rectBoard.addPaperToGraph(rectGraph);
    rectBoard.setClickEvents((cell, event) => {
        clickGraphCell(rectGraph, cell, event);
        console.log('Clicked on Rect[' + cell.x + ',' + cell.y + ']');
    });
    rectBoard.setHoverEvents((cell, event) => {
        if (event.buttons) {
            clickGraphCell(rectGraph, cell, event, true);
            console.log('Clicked on Rect[' + cell.x + ',' + cell.y + ']');
        }
    });

    // Load hexagonal grid for demo
    hexGrid = new Hexgrid(hexRadius);
    hexGraph = new Graph(hexGrid.nodes);
    hexBoard = new Hexboard(hexGrid, {
        side: hexSide,
        stroke: hexStroke,
        border: hexBorder,
        x: hexPosX,
        y: hexPosY,
    });
    hexBoard.drawHexboard();
    hexBoard.addPaperToGraph(hexGraph);

    fullGraph = hexGraph.merge(rectGraph, desconnected);
    hexBoard.addPaperToGraph(fullGraph);
    rectBoard.addPaperToGraph(fullGraph, fullGraph.offset);

    // Hide hexagonal grid help text
    $('text').hide();

    // Initialize graphs for Astar
    Astar.init(fullGraph);
    Astar.init(hexGraph);
    Astar.init(rectGraph);
};

document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

document.addEventListener('mousedown', (event) => {
    let setWall = (wall) => {
        let closest = {
            dm: 10000,
        };
        for (let i = 0; i < hexBoard.board.length; i++) {
            let cell = hexBoard.board[i];
            let dm = (Math.abs(mouseX - cell.m[0])) + (Math.abs(mouseY - cell.m[1]));
            if (dm < 25 && dm < closest.dm) {
                closest.dm = dm;
                closest.cell = cell;
            }
        }
        if (closest.cell) {
            clickGraphCell(hexGraph, closest.cell, event, wall);
            console.log('Clicked on Hex[' + closest.cell.x + ',' + closest.cell.y + ']');
        }
    };
    setWall();
    mouseDown = true;
    setTimeout(() => {
        if (mouseDown) {
            mouseDown = setInterval(() => {
                setWall(true);
            }, 10);
        }
    }, 250);
});

document.addEventListener('mouseup', (event) => {
    clearInterval(mouseDown);
    mouseDown = false;
});

document.addEventListener('keydown', (event) => {
    if (event.key == 't') {
        showHexText = !showHexText;
        if (showHexText) {
            $('text').show();
        } else {
            $('text').hide();
        }
    } else if (event.key == 'h') {
        if (hexManhattan) {
            hexManhattan = 0;
            setDiagonal(hexGraph);
            $('#hexH').html('Hex Heuristic: Diagonal');
        } else {
            hexManhattan = 1;
            setManhattan(hexGraph);
            $('#hexH').html('Hex Heuristic: Manhattan');
        }
    } else if (event.key == 'r') {
        if (rectManhattan) {
            rectManhattan = 0;
            setDiagonal(rectGraph);
            $('#rectH').html('Rect Heuristic: Diagonal');
        } else {
            rectManhattan = 1;
            setManhattan(rectGraph);
            $('#rectH').html('Rect Heuristic: Manhattan');
        }
    } else if (event.key == 'c') {
        cleanWalls();
        cleanDynamicA(fullGraph);
        if (fullGraph.start) setStart(fullGraph, fullGraph.start);
        if (fullGraph.end) setEnd(fullGraph, fullGraph.end);
        desconnected = (desconnected) ? 0 : 1;
        fullGraph = hexGraph.merge(rectGraph, desconnected);
        if (desconnected) {
            $('#conn').html('Connected: No');
        } else {
            $('#conn').html('Connected: Yes');
        }
        hexBoard.addPaperToGraph(fullGraph);
        rectBoard.addPaperToGraph(fullGraph, fullGraph.offset);
    } else if (event.key == 'Enter') {
        cleanDynamicA(fullGraph);
        cleanDynamicA(hexGraph);
        cleanDynamicA(rectGraph);
        console.log('Running Dynamic-A!');

        if (event.altKey) {
            let result = runDynamicA(fullGraph);
            if (result) {
                console.log(`Full path: ${result} = ${result.cost}`);
                if (result.cost) $('#fullP').html('Last Shared Path: ' + result.cost);
            }
        } else {
            let hexResult = runDynamicA(hexGraph);
            if (hexResult) {
                console.log(`Hex path: ${hexResult} = ${hexResult.cost}`);
                if (hexResult.cost) $('#hexP').html('Last Hex Path: ' + hexResult.cost);
            }

            let rectResult = runDynamicA(rectGraph);
            if (rectResult) {
                console.log(`Rect path: ${rectResult} = ${rectResult.cost}`);
                if (rectResult.cost) $('#rectP').html('Last Rect Path: ' + rectResult.cost);
            }
        }
        repaintImportantCells(fullGraph);
        repaintImportantCells(hexGraph);
        repaintImportantCells(rectGraph);
    } else if (event.key == ' ') {
        cleanDynamicA(fullGraph);
        cleanDynamicA(hexGraph);
        cleanDynamicA(rectGraph);
        console.log('Path cleaned!');
        if (event.shiftKey) {
            cleanWalls();
        }
    }
});

document.addEventListener('keyup', (event) => {
    let ret = tempCells.slice();
    let color = '#' + Math.floor(Math.random() * 16000000).toString(16);
    connectedCells[color] = ret;
    if (event.key == 'Alt') {
        for (let cell of connectedCells[color]) {
            if (!cell.modded) {
                cell.modded = true;
                cell.neighbors.push((cell) => {
                    return connectedCells[color].filter((node) => {
                        return !(node.x == cell.x && node.y == cell.y);
                    });
                });
                cell.color = color;
                cell.p.attr({fill: color});
            } else {
                cell.modded = false;
                cell.neighbors.pop();
                connectedCells[cell.color] = connectedCells[cell.color].filter((node) => {
                    return !(node.x == cell.x && node.y == cell.y);
                });
                cell.p.attr({fill: 'white'});
                cell.color = 'white';
                cell.weight = 1;
            }
        }
        tempCells = [];
    }
});

$('#controls').click(() => {
    let hidden = $('.control-text').is(':hidden');
    console.log(hidden);
    if (hidden) {
        $('.control-text').show();
    } else {
        $('.control-text').hide();
    }
});
