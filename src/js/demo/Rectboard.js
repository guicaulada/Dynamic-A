/**
 * Implements a rectangular grid with Raphael.js
 * @class Rectboard
 */
class Rectboard {
  /**
   * Creates an instance of Rectboard.
   * @param {Rectgrid} grid A Rectgrid containing the nodes information
   * @param {Object} options Draw options
   * @memberof Rectboard
   */
  constructor(grid, options) {
    this.board = grid.nodes;
    this.length = grid.length;
    this.width = options.width || 10;
    this.height = options.height || 10;
    this.x = (typeof options.x === 'number') ? options.x : 0;
    this.y = (typeof options.y === 'number') ? options.y : 0;
  }

  /**
   * Draws the rectangular board
   * @memberof Rectboard
   */
  drawRectboard() {
    this.paper = Raphael(this.x, this.y, this.width * this.length, this.height * this.length);
    let paper = this.paper;
    for (let j = 0; j < this.board.length; j++) {
        let cell = this.board[j];
        let moveRight = this.width * cell.x;
        let moveDown = this.height * cell.y;

        let p = paper.rect(moveRight, moveDown, this.width, this.height);

        p.attr('fill', '#fff');
        p.attr('stroke', '#000');
        p.attr('stroke-width', 2);
        p.attr('stroke-linecap', 'round');
        p.attr('stroke-linejoin', 'round');
        p.__parent__ = cell;
        cell.p = p;

        paper.text(moveRight + (this.width / 2), moveDown + (this.height / 2), cell.x + ',' + cell.y);
    }
  }

  /**
   * Adds the cells from the grid to a Graph
   * @memberof Hexgrid
   * @param {*} graph
   * @param {*} offset
   */
  addPaperToGraph(graph, offset = 0) {
      for (let cell of this.board) {
          graph.grid[cell.x + offset][cell.y].p = cell.p;
      }
  }

  /**
   * Set the same click event for every node
   * @param {*} callback
   * @memberof Rectboard
   */
  setClickEvents(callback) {
      for (let i = 0; i < this.board.length; i++) {
          this.board[i].p.click((event) => {
            callback(this.board[i], event);
          });
      }
  }

  /**
   * Set the same hover event for every node
   * @param {*} callback
   * @memberof Rectboard
   */
  setHoverEvents(callback) {
      for (let i = 0; i < this.board.length; i++) {
          this.board[i].p.hover((event) => {
            callback(this.board[i], event);
          });
      }
  }
}
