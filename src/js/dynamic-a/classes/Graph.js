
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
      this.grid[cell.x][cell.y] = node;
      this.nodes.push(node);
    }
    this.init();
  }

  /**
   * Marca todos os nodes como nao visitados
   * @memberof Graph
   */
  init() {
    this.dirtyNodes = [];
    for (let i = 0; i < this.nodes.length; i++) {
      Astar.cleanNode(this.nodes[i]);
    }
  }

  /**
   * Limpa todos os nodes visitados do grafo
   * @memberof Graph
   */
  cleanDirty() {
    for (let i = 0; i < this.dirtyNodes.length; i++) {
      let node = this.dirtyNodes[i];
      Astar.cleanNode(node);
      node.p.attr({fill: (node.weight === 0) ? 'grey' : 'white'}); // Pinta node na demo
    }
    this.dirtyNodes = [];
  }

  /**
   * Marca o Node como visitado
   * @memberof Graph
   * @param {Node} node
   */
  markDirty(node) {
    this.dirtyNodes.push(node);
    node.p.attr({fill: 'cyan'}); // Pinta node na demo
  }

  /**
   * Retorna todos os vizinhos de um node
   * @memberof Graph
   * @param {Node} node Node para analisar
   * @return {Array} Lista de vizinhos
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
      fullGraph.grid[cell.x][cell.y] = cell;
      fullGraph.nodes.push(cell);
    }
    let offset = fullGraph.grid.length + extraOffset;
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
