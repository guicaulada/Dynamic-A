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

document.addEventListener('keypress', (event) => {
    if (event.key == 't') {
        showHexText = !showHexText;
        if (showHexText) {
            $('text').show();
        } else {
            $('text').hide();
        }
    } else if (event.key == 'Enter') {
        console.log('Running Dynamic-A!');
        console.log(`Hex path: ${runDynamicA(hexGraph)}`);
        console.log(`Rect path: ${runDynamicA(rectGraph)}`);
    } else if (event.key == ' ') {
        cleanDynamicA(hexGraph);
        cleanDynamicA(rectGraph);
        console.log('Path cleaned!');
    }
});
