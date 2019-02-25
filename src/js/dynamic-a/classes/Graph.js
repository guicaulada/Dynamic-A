
/**
 * Implementa um grafo
 */
class Graph {
  /**
   * Cria uma instancia de um grafo
   * @memberof Graph
   * @param {Array} cells  Lista de objetos com informacoes para os Nodes
   */
  constructor(cells) {
    this.nodes = [];
    this.grid = [];
    for (let i = 0; i < cells.length; i++) {
      let cell = cells[i];
      if (!this.grid[cell.x]) this.grid[cell.x] = [];
      let node = new Node(cell.x, cell.y, cell.weight, cell.multiplier, cell.neighbors, cell.heuristic);
      node.graph = this;
      node.grid = this.grid;
      this.grid[cell.x][cell.y] = node;
      this.nodes.push(node);
    }
  }

  /**
   * Retorna esse grafo fundido a outro a partir de um offset
   * @memberof Graph
   * @param {Graph} graph Grafo para fundir
   * @param {Number} extraOffset Offset extra
   * @return {Graph} Grafo fundido
   */
  merge(graph, extraOffset = 0) {
    let fullGraph = new Graph([]);
    for (let node of this.nodes) {
      let cell = new Node(node.x, node.y, node.weight, node.multiplier, node.neighbors, node.heuristic);
      if (!fullGraph.grid[cell.x]) fullGraph.grid[cell.x] = [];
      cell.graph = fullGraph;
      cell.grid = fullGraph.grid;
      fullGraph.grid[cell.x][cell.y] = cell;
      fullGraph.nodes.push(cell);
    }
    let offset = fullGraph.grid.length + extraOffset;
    for (let node of graph.nodes) {
      let cell = new Node(offset + node.x, node.y, node.weight, node.multiplier, node.neighbors, node.heuristic);
      cell.graph = fullGraph;
      cell.grid = fullGraph.grid;
      if (!fullGraph.grid[cell.x]) fullGraph.grid[cell.x] = [];
      fullGraph.grid[cell.x][cell.y] = cell;
      fullGraph.nodes.push(cell);
    }
    fullGraph.offset = offset;
    return fullGraph;
  }

  /**
   * Representa o grafo em uma string
   * @memberof Graph
   * @return {String} Representacao em string
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
