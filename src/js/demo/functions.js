
/**
 * Runs Astar on Graph
 * @param {Graph} graph The graph to search
 * @return {Array} Array containing all nodes on shortest path
 */
function runDynamicA(graph) {
    if (graph.start && graph.end) {
        let start = graph.grid[graph.start.x][graph.start.y];
        let end = graph.grid[graph.end.x][graph.end.y];
        let result = Astar.search(graph, graph.start, graph.end);
        for (node of result) {
            node.p.attr({fill: 'blue'});
        }
        start.p.attr({fill: 'green'});
        end.p.attr({fill: 'red'});
        return result;
    }
}

/**
 * Cleans the last Astar execution
 * @param {Graph} graph The graph to clean
 */
function cleanDynamicA(graph) {
    graph.cleanDirty();
    if (graph.start) graph.start.p.attr({fill: 'green'});
    if (graph.end) graph.end.p.attr({fill: 'red'});
}

/**
 * Clicks a cell to make wall, start or end
 * @param {Graph} graph The graph the cell is on
 * @param {Object} cell The cell that is being clicked
 */
function clickGraphCell(graph, cell) {
    let graphCell = graph.grid[cell.x][cell.y];
    if (event.shiftKey) {
        graphCell.weight = 1;
        if (graph.start) {
            graph.start.weight = 1;
            graph.start.p.attr({fill: 'white'});
        }
        graph.start = graphCell;
        graph.start.p.attr({fill: 'green'});
    } else if (event.ctrlKey) {
        graphCell.weight = 1;
        if (graph.end) {
            graph.end.weight = 1;
            graph.end.p.attr({fill: 'white'});
        }
        graph.end = graphCell;
        graph.end.p.attr({fill: 'red'});
    } else {
        if (graphCell.weight) {
            graphCell.p.attr({fill: 'grey'});
            graphCell.weight = 0;
        } else {
            graphCell.p.attr({fill: 'white'});
            graphCell.weight = 1;
        }
    }
}
