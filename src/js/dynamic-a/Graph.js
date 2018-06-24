
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
      let node = new Node(cell.x, cell.y, cell.weight, cell.multiplier, cell.neighbors);
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
    return node.neighbors(this.grid);
  }

  /**
   * Displays the graph in a string
   * @return {String} String representation of the graph
   * @memberof Graph
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
