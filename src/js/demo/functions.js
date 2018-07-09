
/**
 * Repaints connected cells.
 * @param {Graph} graph Graph containing the cells.
 */
function repaintImportantCells(graph) {
    if (graph.start) graph.start.p.attr({fill: 'green'});
    if (graph.end) graph.end.p.attr({fill: 'red'});

    for (let node of graph.nodes) {
        if (node.weight == 2) {
            node.p.attr({fill: node.color});
        }
    }
}

/**
 * Paints the resulting path
 * @param {*} result
 */
function paintResult(result) {
    for (node of result) {
        node.p.attr({fill: 'blue'});
    }
}

/**
 * Runs Astar on Graph
 * @param {Graph} graph The graph to search
 * @return {Array} Array containing all nodes on shortest path
 */
function runDynamicA(graph) {
    if (graph.start && graph.end) {
        let result = Astar.search(graph, graph.start, graph.end);
        paintResult(result);
        repaintImportantCells(graph);
        repaintImportantCells(fullGraph);
        return result;
    }
}

/**
 * Cleans the last Astar execution
 * @param {Graph} graph The graph to clean
 */
function cleanDynamicA(graph) {
    graph.cleanDirty();
    repaintImportantCells(graph);
    repaintImportantCells(fullGraph);
}

/**
 * Set's all nodes to use the diagonal heuristic
 * @param {Graph} graph
 */
function setDiagonal(graph) {
    let diagonal = (pos0, pos1) => {
        // Diagonal
        let D = 1;
        let D2 = Math.sqrt(2);
        let d1 = Math.abs(pos1.x - pos0.x);
        let d2 = Math.abs(pos1.y - pos0.y);
        return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
    };
    for (let node of graph.nodes) {
        node.heuristic = diagonal;
    }
    let offset = (graph == hexGraph) ? 0 : fullGraph.offset;
    let limit = (graph == hexGraph) ? fullGraph.offset : fullGraph.grid.length;
    for (let x = offset; x < limit; x++) {
        if (fullGraph.grid[x]) {
            for (let y = 0; y < fullGraph.grid[x].length; y++) {
                let node = fullGraph.grid[x][y];
                if (node) {
                    node.heuristic = diagonal;
                }
            }
        }
    }
}

/**
 * Set's all nodes to use the manhattan heuristic
 * @param {Graph} graph
 */
function setManhattan(graph) {
    let manhattan = (pos0, pos1) => {
        // Manhattan
        let d1 = Math.abs(pos1.x - pos0.x);
        let d2 = Math.abs(pos1.y - pos0.y);
        return d1 + d2;
    };
    for (let node of graph.nodes) {
        node.heuristic = manhattan;
    }
    let offset = (graph == hexGraph) ? 0 : fullGraph.offset;
    let limit = (graph == hexGraph) ? fullGraph.offset : fullGraph.grid.length;
    for (let x = offset; x < limit; x++) {
        if (fullGraph.grid[x]) {
            for (let y = 0; y < fullGraph.grid[x].length; y++) {
                let node = fullGraph.grid[x][y];
                if (node) {
                    node.heuristic = manhattan;
                }
            }
        }
    }
}

/**
 * Makes a cell start
 * @param {Graph} graph The graph the cell is on
 * @param {Object} cell The cell that is being clicked
 */
function setStart(graph, cell) {
    cell.weight = 1;
    if (graph.start) {
        graph.start.weight = 1;
        graph.start.p.attr({fill: 'white'});
    }
    if (graph.start != cell) {
        graph.start = cell;
        graph.start.p.attr({fill: 'green'});
    } else {
        delete graph.start;
    }
}

/**
 * Makes a cell end
 * @param {Graph} graph The graph the cell is on
 * @param {Object} cell The cell that is being clicked
 */
function setEnd(graph, cell) {
    cell.weight = 1;
    if (graph.end) {
        graph.end.weight = 1;
        graph.end.p.attr({fill: 'white'});
    }
    if (graph.end != cell) {
        graph.end = cell;
        graph.end.p.attr({fill: 'red'});
    } else {
        delete graph.end;
    }
}

/**
 * Makes a cell wall
 * @param {Graph} graph The graph the cell is on
 * @param {Object} cell The cell that is being clicked
 */
function setWall(graph, cell) {
    if (cell != graph.end && cell != graph.start) {
        if (cell.weight) {
            cell.p.attr({fill: 'grey'});
            cell.weight = 0;
        } else {
            cell.p.attr({fill: 'white'});
            cell.weight = 1;
        }
    } else {
        if (cell == graph.end) {
            cell.p.attr({fill: 'red'});
        } else {
            cell.p.attr({fill: 'green'});
        }
    }
}

/**
 * Returns equivalent cell from full graph
 * @param {Graph} graph The graph the cell is on
 * @param {Object} cell The cell that is being clicked
 * @return {Object} Object containing full graph and cell
 */
function getFullCell(graph, cell) {
    let fullCell;
    if (graph == hexGraph) {
        fullCell = fullGraph.grid[cell.x][cell.y];
    } else {
        fullCell = fullGraph.grid[fullGraph.offset + cell.x][cell.y];
    }
    return {graph: fullGraph, cell: fullCell};
}

/**
 * Removes all walls
 */
function cleanWalls() {
    for (let node of hexGraph.nodes) {
        if (!node.weight) {
            setWall(hexGraph, node);
        }
    }
    for (let node of rectGraph.nodes) {
        if (!node.weight) {
            setWall(rectGraph, node);
        }
    }
    for (let node of fullGraph.nodes) {
        if (!node.weight) {
            setWall(fullGraph, node);
        }
    }
}

/**
 * Clicks a cell to make wall, start or end
 * @param {Graph} graph The graph the cell is on
 * @param {Object} cell The cell that is being clicked
 */
function clickGraphCell(graph, cell) {
    let graphCell = graph.grid[cell.x][cell.y];
    let full = getFullCell(graph, graphCell);
    if (event.shiftKey && !event.altKey) {
        setStart(graph, graphCell);
    } else if (event.ctrlKey && !event.altKey) {
        setEnd(graph, graphCell);
    } else if (event.altKey) {
        console.log('Clicked on Full[' + full.cell.x + ',' + full.cell.y + ']');
        if (!event.ctrlKey && !event.shiftKey) {
            tempCells.push(full.cell);
            full.cell.p.attr({fill: 'yellow'});
        } else if (!event.ctrlKey && event.shiftKey) {
            setStart(full.graph, full.cell);
        } else if (event.ctrlKey && !event.shiftKey) {
            setEnd(full.graph, full.cell);
        }
    } else {
        setWall(graph, graphCell);
        setWall(full.graph, full.cell);
        if (full.cell.weight != graphCell.weight) {
            setWall(graph, graphCell);
            setWall(full.graph, full.cell);
        }
        console.log('Clicked on Full[' + full.cell.x + ',' + full.cell.y + ']');
    }
}
