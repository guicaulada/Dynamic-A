/**
 * Implements the Astar algorithm
 * @class Astar
 */
class Astar {
  /**
   * Returns default heuristics (manhattan and diagonal)
   * @memberof Astar
   * @return {Object} Default heuristics
   */
  static heuristics() {
    return {
      manhattan: (pos0, pos1) => {
        let d1 = Math.abs(pos1.x - pos0.x);
        let d2 = Math.abs(pos1.y - pos0.y);
        return d1 + d2;
      },
      diagonal: (pos0, pos1) => {
        let D = 1;
        let D2 = Math.sqrt(2);
        let d1 = Math.abs(pos1.x - pos0.x);
        let d2 = Math.abs(pos1.y - pos0.y);
        return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
      },
    };
  }

  /**
  * Perform an A* Search on a graph given a start and end node.
  * @static
  * @param {Graph} graph
  * @param {Node} start
  * @param {Node} end
  * @param {Object} [options]
  * @param {bool} [options.closest] Specifies whether to return the path to the closest node if the target is unreachable.
  * @param {Function} [options.heuristic] Heuristic function (see astar.heuristics).
  * @return {Array} List of nodes that are part of the path
  */
  static search(graph, start, end, options) {
    graph.cleanDirty();
    options = options || {};
    let heuristic = options.heuristic || Astar.heuristics().manhattan;
    let closest = options.closest || false;
    let openHeap = Astar.getHeap();
    let closestNode = start; // set the start node to be the closest if required
    start.h = heuristic(start, end);
    graph.markDirty(start);
    openHeap.push(start);
    while (openHeap.size() > 0) {
      // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
      let currentNode = openHeap.pop();
      // End case -- result has been found, return the traced path.
      if (currentNode === end) {
        return Astar.pathTo(currentNode);
      }
      // Normal case -- move currentNode from open to closed, process each of its neighbors.
      currentNode.closed = true;
      // Find all neighbors for the current node.
      let neighbors = graph.neighbors(currentNode);
      for (let i = 0, il = neighbors.length; i < il; ++i) {
        let neighbor = neighbors[i];
        if (neighbor.closed || neighbor.isWall()) {
          // Not a valid node to process, skip to next neighbor.
          continue;
        }
        // The g score is the shortest distance from start to current node.
        // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
        let gScore = currentNode.g + neighbor.getCost(currentNode);
        let beenVisited = neighbor.visited;
        if (!beenVisited || gScore < neighbor.g) {
          // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
          neighbor.visited = true;
          neighbor.parent = currentNode;
          neighbor.h = neighbor.h || heuristic(neighbor, end);
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
          graph.markDirty(neighbor);
          if (closest) {
            // If the neighbour is closer than the current closestNode or if it's equally close but has
            // a cheaper path than the current closest node then it becomes the closest node
            if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
              closestNode = neighbor;
            }
          }
          if (!beenVisited) {
            // Pushing to heap will put it in proper place based on the 'f' value.
            openHeap.push(neighbor);
          } else {
            // Already seen the node, but since it has been rescored we need to reorder it in the heap
            openHeap.rescoreElement(neighbor);
          }
        }
      }
    }
    if (closest) {
      return Astar.pathTo(closestNode);
    }
    // No result was found - empty array signifies failure to find path.
    return [];
  }

  /**
   * Returns the path from starting node to current node
   * @static
   * @memberof Astar
   * @param {Node} node
   * @return {Array} List of nodes to current node
   */
  static pathTo(node) {
    let curr = node;
    let path = [];
    while (curr.parent) {
      path.unshift(curr);
      curr = curr.parent;
    }
    return path;
  }

  /**
   * Defines a new binary heap node.f => node
   * @static
   * @memberof Astar
   * @return {BinaryHeap} Binary heap of nodes
   */
  static getHeap() {
    return new BinaryHeap((node) => {
      return node.f;
    });
  }

  /**
   * Cleans a node of all changes
   * @static
   * @memberof Astar
   * @param {Node} node Node to be cleaned
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
