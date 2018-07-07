
/**
 * Implements a hexegonal grid
 * @class Hexgrid
 */
class Hexgrid {
    /**
     * Creates an instance of Hexgrid.
     * @memberof Hexgrid
     * @param {Number} radius
     */
    constructor(radius) {
        this.radius = radius;
        this.nodes = [];
        this.grid = [];
        for (let x = 0; x < this.length; x++) {
            if (!this.grid[x]) this.grid[x] = [];
            for (let y = 0; y < this.length; y++) {
                if (this.inSpace(x, y)) {
                    this.nodes.push({
                        x: x,
                        y: y,
                        weight: 1,
                        multiplier: 1.14,
                        drawers: [
                            [(paper, cell) => {
                                paper.text(cell.m[0], cell.m[1], cell.x + ',' + cell.y);
                            }],
                        ],
                        neighbors: [(grid) => {
                            let ret = [];
                            // Northwest
                            if (grid[x] && grid[x][y - 1]) {
                                ret.push(grid[x][y - 1]);
                            }
                            // Northeast
                            if (grid[x + 1] && grid[x + 1][y - 1]) {
                                ret.push(grid[x + 1][y - 1]);
                            }
                            // West
                            if (grid[x - 1] && grid[x - 1][y]) {
                                ret.push(grid[x - 1][y]);
                            }
                            // East
                            if (grid[x + 1] && grid[x + 1][y]) {
                                ret.push(grid[x + 1][y]);
                            }
                            // Southwest
                            if (grid[x - 1] && grid[x - 1][y + 1]) {
                                ret.push(grid[x - 1][y + 1]);
                            }
                            // Southeast
                            if (grid[x] && grid[x][y + 1]) {
                                ret.push(grid[x][y + 1]);
                            }
                            return ret;
                        }],
                        heuristic: (pos0, pos1) => {
                            // Diagonal
                            let D = 1;
                            let D2 = Math.sqrt(2);
                            let d1 = Math.abs(pos1.x - pos0.x);
                            let d2 = Math.abs(pos1.y - pos0.y);
                            return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2));
                        },
                    });
                    this.grid[x][y] = 1;
                } else {
                    this.grid[x][y] = 0;
                }
            }
        }
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
}
