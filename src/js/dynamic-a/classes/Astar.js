/**
 * Implementa o algoritmo Astar
 */
class Astar {
  /**
  * Realiza a busca em um grafo do tipo Graph dado um Node de inicio e fim.
  * @static
  * @param {Graph} graph Grafo que sera analisado
  * @param {Node} start Node inicial
  * @param {Node} end Node final
  * @return {Array} Lista de nodes que compoe o caminho
  */
  static search(graph, start, end) {
    Astar.init(graph);
    Astar.cleanDirty(graph);
    let openHeap = Astar.getHeap();
    start.h = start.heuristic(start, end);
    Astar.markDirty(graph, start);
    openHeap.push(start);
    while (openHeap.size() > 0) {
      // Adquire o node de menor f para processar. Organizado pela heap
      let currentNode = openHeap.pop();
      // Caso o node atual seja igual ao node final, resultado encontrado, retorna o caminho
      if (currentNode === end) {
        return Astar.pathTo(currentNode);
      }
      // Caso o node atual seja diferente do final, marca node como visitado, processa cada vizinho
      currentNode.closed = true;
      // Encontra todos so vizinhos do node atual
      let neighbors = currentNode.getNeighbors();
      for (let i = 0, il = neighbors.length; i < il; ++i) {
        let neighbor = neighbors[i];
        if (neighbor.closed || neighbor.isWall()) {
          // Node invalido, pule para o proximo vizinho
          continue;
        }
        // O valor g e o custo do menor caminho do inicio ao node atual
        // Precisamos verificar se o caminho pelo qual chegamos a este node e o menor que ja vimos
        let gScore = currentNode.g + neighbor.getCost(currentNode);
        let beenVisited = neighbor.visited;
        if (!beenVisited || gScore < neighbor.g) {
          // Encontro o melhor caminho ate o momento ate esse node. Verifica custo
          neighbor.visited = true;
          neighbor.parent = currentNode;
          neighbor.h = neighbor.h || neighbor.heuristic(neighbor, end);
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
          Astar.markDirty(graph, neighbor);
          if (!beenVisited) {
            // Acrescenta a heap na sua posicao correta baseada em seu 'f'
            openHeap.push(neighbor);
          } else {
            // Node ja foi visitado mas como seu valor f mudou temos que recalcular sua posicao na heap
            openHeap.rescoreElement(neighbor);
          }
        }
      }
    }
    // Nenhum caminho foi encontrado
    return [];
  }

  /**
   * Marca todos os nodes como nao visitados
   * @memberof Astar
   * @param {Graph} graph
   */
  static init(graph) {
    graph.dirtyNodes = [];
    for (let i = 0; i < graph.nodes.length; i++) {
      Astar.cleanNode(graph.nodes[i]);
    }
  }

  /**
   * Limpa todos os nodes visitados do grafo
   * @memberof Astar
   * @param {Graph} graph
   */
  static cleanDirty(graph) {
    for (let i = 0; i < graph.dirtyNodes.length; i++) {
      let node = graph.dirtyNodes[i];
      Astar.cleanNode(node);
      node.p.attr({fill: (node.weight === 0) ? 'grey' : 'white'}); // Pinta node na demo
    }
    graph.dirtyNodes = [];
  }

  /**
   * Marca o Node como visitado
   * @memberof Astar
   * @param {Graph} graph
   * @param {Node} node
   */
  static markDirty(graph, node) {
    graph.dirtyNodes.push(node);
    node.p.attr({fill: 'cyan'}); // Pinta node na demo
  }

  /**
   * Retorna o caminho do Node inicial ao Node atual
   * @static
   * @memberof Astar
   * @param {Node} node
   * @return {Array} Lista de nodes caminho para node atual
   */
  static pathTo(node) {
    let curr = node;
    let path = [];
    while (curr.parent) {
      path.unshift(curr);
      curr = curr.parent;
    }
    path.cost = node.g;
    return path;
  }

  /**
   * Retorna uma nova heap definida por node.f => node
   * @static
   * @memberof Astar
   * @return {BinaryHeap} Heap de Node
   */
  static getHeap() {
    return new BinaryHeap((node) => {
      return node.f;
    });
  }

  /**
   * Limpa um Node de todas as mudancas
   * @static
   * @memberof Astar
   * @param {Node} node Node a ser limpado
   */
  static cleanNode(node) {
    node.f = 0;
    node.g = 0;
    node.h = 0;
    node.visited = false;
    node.closed = false;
    node.parent = null;
  }
}
