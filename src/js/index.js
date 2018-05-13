
window.onload = function() {
    
    rectGrid = makeRectgrid(40, 40, 12);
    rectGraph = new Graph(makeBinaryRectgrid(12), { diagonal: true });
    setRectgridClicks();
    
    hexGrid = makeHexgrid();
    hexGraph = new Graph(makeBinaryHexgrid(), { hex: true });
    setHexboardParameters(25, 3, 5);
    drawHexboard(hexGrid, 7);

    $('text').hide();
}

var showHexText = false;
document.addEventListener("keypress", function (event) {
    if (event.key == 'g') {
        showHexText = !showHexText;
        if (showHexText) {
            $('text').show();
        } else {
            $('text').hide();
        }
    } else if (event.key == 'Enter') {
        prepareRectgraph();
        prepareHexgraph();
        runRectstar();
        runHexstar();
    } else if (event.key == ' ') {
        rectGraph.cleanDirty();
        rectStart.p.attr({fill: "green"});
        rectEnd.p.attr({fill: "red"});

        hexGraph.cleanDirty();
        hexStart.p.attr({fill: "green"});
        hexEnd.p.attr({fill: "red"});
    }
});