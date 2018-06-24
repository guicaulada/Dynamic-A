
/**
 * Implements a node
 * @class Node
 */
class Node {
  /**
   * Creates an instance of Node.
   * @param {Number} x
   * @param {Number} y
   * @param {Number} weight
   * @param {Number} multiplier
   * @param {Function} neighbors
   * @memberof Node
   */
  constructor(x, y, weight, multiplier, neighbors) {
    this.x = x;
    this.y = y;
    this.weight = weight;
    this.multiplier = multiplier;
    this.neighbors = neighbors;
  }

  /**
   * Get cost to move to node, uses multiplier if x and y are different
   * @memberof Node
   * @param {Node} fromNeighbor
   * @return {Number} Cost to move to node
   */
  getCost(fromNeighbor) {
    // Take multiplier weight into consideration.
    if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
      return this.weight * this.multiplier;
    }
    return this.weight;
  }

  /**
   * Checks if a node is valid
   * @return {Boolean} If node is valid or not (true/false)
   * @memberof Node
   */
  isWall() {
    return this.weight === 0;
  }

  /**
   * Represents node in a string
   * @return {String} String representing node
   * @memberof Node
   */
  toString() {
    return '[' + this.x + ' ' + this.y + ']';
  }
}
