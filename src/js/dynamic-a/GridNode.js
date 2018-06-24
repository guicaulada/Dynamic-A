
/**
 * Implements a node
 * @class GridNode
 */
class GridNode {
  /**
   * Creates an instance of GridNode.
   * @param {Number} x
   * @param {Number} y
   * @param {Number} weight
   * @param {Number} multiplier
   * @param {Function} neighbors
   * @memberof GridNode
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
   * @memberof GridNode
   * @param {GridNode} fromNeighbor
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
   * @memberof GridNode
   */
  isWall() {
    return this.weight === 0;
  }

  /**
   * Represents node in a string
   * @return {String} String representing node
   * @memberof GridNode
   */
  toString() {
    return '[' + this.x + ' ' + this.y + ']';
  }
}
