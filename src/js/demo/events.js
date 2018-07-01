
let connectedCells = {};
let tempCells = [];

window.onload = () => {
    // Load rectangular grid for demo
    rectGrid = new Rectgrid(rectLength);
    rectGraph = new Graph(rectGrid.nodes);
    rectBoard = new Rectboard(rectGrid, {
        width: rectWidth,
        height: rectHeight,
        x: 600,
        y: 15,
    });
    rectBoard.drawRectboard();
    rectBoard.addPaperToGraph(rectGraph);
    rectBoard.setClickEvents((cell) => {
        clickGraphCell(rectGraph, cell);
        console.log('Clicked on Rect[' + cell.x + ',' + cell.y + ']');
    });

    // Load hexagonal grid for demo
    hexGrid = new Hexgrid(hexRadius);
    hexGraph = new Graph(hexGrid.nodes);
    hexBoard = new Hexboard(hexGrid, {
        side: 25,
        stroke: 3,
        border: 5,
    });
    hexBoard.drawHexboard();
    hexBoard.addPaperToGraph(hexGraph);

    // Hide hexagonal grid help text
    $('text').hide();
};

document.addEventListener('click', (event) => {
    let closest = {
        dm: 10000,
    };
    for (let i = 0; i < hexBoard.board.length; i++) {
        let cell = hexBoard.board[i];
        let dm = (Math.abs(event.clientX - cell.m[0])) + (Math.abs(event.clientY - cell.m[1]));
        if (dm < 25 && dm < closest.dm) {
            closest.dm = dm;
            closest.cell = cell;
        }
    }
    if (closest.cell) {
        clickGraphCell(hexGraph, closest.cell);
        console.log('Clicked on Hex[' + closest.cell.x + ',' + closest.cell.y + ']');
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key == 't') {
        showHexText = !showHexText;
        if (showHexText) {
            $('text').show();
        } else {
            $('text').hide();
        }
    } else if (event.key == 'Enter') {
        console.log('Running Dynamic-A!');

        let hexResult = runDynamicA(hexGraph);
        if (hexResult) {
            console.log(`Hex path: ${hexResult} = ${hexResult.cost}`);
        }

        let rectResult = runDynamicA(rectGraph);
        if (rectResult) {
            console.log(`Rect path: ${rectResult} = ${rectResult.cost}`);
        }
    } else if (event.key == ' ') {
        cleanDynamicA(hexGraph);
        cleanDynamicA(rectGraph);
        console.log('Path cleaned!');
    }
});

document.addEventListener('keyup', (event) => {
    let ret = tempCells.slice();
    let color = '#' + Math.floor(Math.random() * 16000000).toString(16);
    connectedCells[color] = ret;
    if (event.key == 'Alt') {
        for (let cell of connectedCells[color]) {
            if (cell.weight != 2) {
                cell.weight = 2;
                cell.neighbors.push(() => {
                    return connectedCells[color].filter((node) => {
                        return !(node.x == cell.x && node.y == cell.y);
                    });
                });
                cell.color = color;
                cell.p.attr({fill: color});
            } else {
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
