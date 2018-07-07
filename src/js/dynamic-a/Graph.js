
/**
 * Implements a graph memory structure
 * @class Graph
 */
class Graph {
  /**
   * Creates an instance of Graph.
   * @memberof Graph
   * @param {Array} cells  Array of input cells
   * @param {Object} [options]
   * @param {bool} [options.diagonal] Specifies whether diagonal moves are allowed
   */
  constructor(cells) {
    this.nodes = [];
    this.grid = [];
    for (let i = 0; i < cells.length; i++) {
      let cell = cells[i];
      if (!this.grid[cell.x]) this.grid[cell.x] = [];
      let node = new Node(cell.x, cell.y, cell.weight, cell.multiplier, cell.neighbors, cell.heuristic);
      this.grid[cell.x][cell.y] = node;
      this.nodes.push(node);
    }
    this.init();
  }

  /**
   * Cleans all nodes of the Graph with Astar
   * @memberof Graph
   */
  init() {
    this.dirtyNodes = [];
    for (let i = 0; i < this.nodes.length; i++) {
      Astar.cleanNode(this.nodes[i]);
    }
  }

  /**
   * Cleans all dirty nodes of the Graph with Astar
   * @memberof Graph
   */
  cleanDirty() {
    for (let i = 0; i < this.dirtyNodes.length; i++) {
      let node = this.dirtyNodes[i];
      Astar.cleanNode(node);
      node.p.attr({fill: (node.weight === 0) ? 'grey' : 'white'}); // Paint cell in demo
    }
    this.dirtyNodes = [];
  }

  /**
   * Mark the node as dirty
   * @memberof Graph
   * @param {Node} node
   */
  markDirty(node) {
    this.dirtyNodes.push(node);
    node.p.attr({fill: 'cyan'}); // Paint cell in demo
  }

  /**
   * Returns all neighbors based on node
   * @memberof Graph
   * @param {Node} node
   * @return {Array} List of connected nodes
   */
  neighbors(node) {
    let neighbors = [];
    for (let i = 0; i < node.neighbors.length; i++) {
      neighbors = neighbors.concat(node.neighbors[i](this, node).filter((nbs) => {
        return neighbors.indexOf(nbs) < 0;
      }));
    }
    return neighbors;
  }

  /**
   * Merges another graph adding it's x and y
   * @memberof Graph
   * @param {Graph} graph
   * @return {Graph} Merged graphs
   */
  merge(graph) {
    let fullGraph = new Graph([]);
    for (let node of this.nodes) {
      let cell = new Node(node.x, node.y, node.weight, node.multiplier, node.neighbors, node.heuristic);
      if (!fullGraph.grid[cell.x]) fullGraph.grid[cell.x] = [];
      fullGraph.grid[cell.x][cell.y] = cell;
      fullGraph.nodes.push(cell);
    }
    let offset = fullGraph.grid.length;
    for (let node of graph.nodes) {
      let cell = new Node(offset + node.x, node.y, node.weight, node.multiplier, node.neighbors, node.heuristic);
      if (!fullGraph.grid[cell.x]) fullGraph.grid[cell.x] = [];
      fullGraph.grid[cell.x][cell.y] = cell;
      fullGraph.nodes.push(cell);
    }
    fullGraph.offset = offset;
    fullGraph.init();
    return fullGraph;
  }

  /**
   * Displays the graph in a string
   * @memberof Graph
   * @return {String} String representation of the graph
   */
  toString() {
    let graphString = [];
    let nodes = this.grid;
    for (let x = 0; x < nodes.length; x++) {
      let rowDebug = [];
      let row = nodes[x];
      for (let y = 0; y < row.length; y++) {
        rowDebug.push(row[y].weight);
      }
      graphString.push(rowDebug.join(' '));
    }
    return graphString.join('\n');
  }
}
