
/**
 * Implements a hexboard with Raphael.js
 * @class Hexboard
 */
class Hexboard {
    /**
     * Creates an instance of Hexboard.
     * @memberof Hexboard
     * @param {Hexgrid} grid A Hexgrid containing the nodes information
     * @param {Object} options Draw options
     */
    constructor(grid, options) {
        this.board = grid.nodes;
        this.radius = grid.radius;
        this.side = options.side || 15;
        this.deltaX = Math.cos(Raphael.rad(30)) * this.side;
        this.deltaY = Math.cos(Raphael.rad(60)) * this.side;
        this.stroke = options.stroke || 2;
        this.border = options.border || 10;
        this.x = (typeof options.x === 'number') ? options.x : 0;
        this.y = (typeof options.y === 'number') ? options.y : 0;
    }

    /**
     * Returns the board length based on radius
     * @memberof Hexboard
     * @return {Number} The board height
     */
    get length() {
        return (this.radius * 2) - 1;
    }

    /**
     * Returns if position is in hexboard
     * @memberof Hexboard
     * @param {Number} x
     * @param {Number} y
     * @return {Boolean} If the position is or not in the hexboard (true/false)
     */
    inSpace(x, y) {
        return x + y >= (this.radius - 1) &&
            x + y < ((this.length * 2) - this.radius);
    }

    /**
     * Draws the hexboard
     * @memberof Hexboard
     */
    drawHexboard() {
        this.calculateHexes();
        let Xmax = this.x + (this.border * 2) + (this.length * 2 * this.deltaX);
        let Ymax = this.y + (this.border * 2) + (this.length * 2 * this.deltaY) + (this.length * this.side);
        this.paper = Raphael(this.x, this.y, Xmax, Ymax);
        let paper = this.paper;

        for (let j = 0; j < this.board.length; j++) {
            let cell = this.board[j];
            let hexPath = 'M' + cell.nw[0] + ',' + cell.nw[1];
            hexPath += 'L' + cell.sw[0] + ',' + cell.sw[1];
            hexPath += 'L' + cell.s[0] + ',' + cell.s[1];
            hexPath += 'L' + cell.se[0] + ',' + cell.se[1];
            hexPath += 'L' + cell.ne[0] + ',' + cell.ne[1];
            hexPath += 'L' + cell.n[0] + ',' + cell.n[1];
            hexPath += 'L' + cell.nw[0] + ',' + cell.nw[1];
            let p = paper.path(hexPath);
            p.attr('stroke-width', this.stroke);
            p.attr('stroke-linecap', 'round');
            p.attr('stroke-linejoin', 'round');
            p.__parent__ = cell;
            cell.p = p;
        }

        for (let j = 0; j < this.board.length; j++) {
            let cell = this.board[j];
            if ('drawers' in cell) {
                for (let i = 0; i < cell.drawers.length; i++) {
                    let drawer = cell.drawers[i];
                    let passthroughs = drawer.splice(1, drawer.length - 1);
                    let params = [paper, cell].concat(passthroughs);
                    drawer[0].apply(this, params);
                }
            }
        }
    }

    /**
     * Calculates and defines the points of each hexagon
     * @memberof Hexboard
     */
    calculateHexes() {
        for (let i = 0; i < this.board.length; i++) {
            let xoff = this.border + (this.board[i].x * 2 * this.deltaX) +
                ((this.board[i].y - this.radius + 1) * this.deltaX);
            let yoff = this.border + (this.board[i].y * this.deltaY) +
                (this.board[i].y * this.side);
            this.board[i].nw = this.hexNW(xoff, yoff);
            this.board[i].sw = this.hexSW(xoff, yoff);
            this.board[i].s = this.hexS(xoff, yoff);
            this.board[i].se = this.hexSE(xoff, yoff);
            this.board[i].ne = this.hexNE(xoff, yoff);
            this.board[i].n = this.hexN(xoff, yoff);
            this.board[i].m = this.hexM(xoff, yoff);
        }
    }

    /**
     * Finds the Northwest point based on x, y offset
     * @param {Number} xoff
     * @param {Number} yoff
     * @return {Array} Northwest [x, y] position
     * @memberof Hexboard
     */
    hexNW(xoff, yoff) {
        return [xoff, yoff + this.deltaY];
    }

    /**
     * Finds the Southwest point based on x, y offset
     * @param {Number} xoff
     * @param {Number} yoff
     * @return {Array} Southwest [x, y] position
     * @memberof Hexboard
     */
    hexSW(xoff, yoff) {
        return [xoff, yoff + this.deltaY + this.side];
    }

    /**
     * Finds the South point based on x, y offset
     * @param {Number} xoff
     * @param {Number} yoff
     * @return {Array} South [x, y] position
     * @memberof Hexboard
     */
    hexS(xoff, yoff) {
        return [xoff + this.deltaX, yoff + (2 * this.deltaY) + this.side];
    }

    /**
     * Finds the Southeast point based on x, y offset
     * @param {Number} xoff
     * @param {Number} yoff
     * @return {Array} Southeast [x, y] position
     * @memberof Hexboard
     */
    hexSE(xoff, yoff) {
        return [xoff + (2 * this.deltaX), yoff + this.deltaY + this.side];
    }

    /**
     * Finds the Northeast point based on x, y offset
     * @param {Number} xoff
     * @param {Number} yoff
     * @return {Array} Northeast [x, y] position
     * @memberof Hexboard
     */
    hexNE(xoff, yoff) {
        return [xoff + (2 * this.deltaX), yoff + this.deltaY];
    }

    /**
     * Finds the North point based on x, y offset
     * @param {Number} xoff
     * @param {Number} yoff
     * @return {Array} North [x, y] position
     * @memberof Hexboard
     */
    hexN(xoff, yoff) {
        return [xoff + this.deltaX, yoff];
    }

    /**
     * Finds the Middle point based on x, y offset
     * @param {Number} xoff
     * @param {Number} yoff
     * @return {Array} Middle [x, y] position
     * @memberof Hexboard
     */
    hexM(xoff, yoff) {
        return [xoff + this.deltaX, yoff + this.deltaY + (this.side / 2)];
    }

    /**
     * Adds the paper cells from the board to a Graph
     * @memberof Hexgrid
     * @param {*} graph
     */
    addPaperToGraph(graph) {
        for (let cell of this.board) {
            graph.grid[cell.x][cell.y].p = cell.p;
        }
    }
}
