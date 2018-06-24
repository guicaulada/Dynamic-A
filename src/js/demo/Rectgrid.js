
/**
 * Implements a hexegonal grid
 * @class Rectgrid
 */
class Rectgrid {
    /**
     * Creates an instance of Rectgrid.
     * @memberof Rectgrid
     * @param {Number} length
     */
    constructor(length) {
        this.length = length;
        this.nodes = [];
        this.grid = [];
        for (let x = 0; x < this.length; x++) {
            for (let y = 0; y < this.length; y++) {
                this.nodes.push({
                    x: x,
                    y: y,
                    weight: 1,
                    multiplier: 1.14,
                    drawers: [],
                    neighbors: (grid) => {
                        let ret = [];
                        // West
                        if (grid[x - 1] && grid[x - 1][y]) {
                            ret.push(grid[x - 1][y]);
                        }
                        // East
                        if (grid[x + 1] && grid[x + 1][y]) {
                            ret.push(grid[x + 1][y]);
                        }
                        // South
                        if (grid[x] && grid[x][y - 1]) {
                            ret.push(grid[x][y - 1]);
                        }
                        // North
                        if (grid[x] && grid[x][y + 1]) {
                            ret.push(grid[x][y + 1]);
                        }

                        // Diagonals
                        // Southwest
                        if (grid[x - 1] && grid[x - 1][y - 1]) {
                            ret.push(grid[x - 1][y - 1]);
                        }
                        // Southeast
                        if (grid[x + 1] && grid[x + 1][y - 1]) {
                            ret.push(grid[x + 1][y - 1]);
                        }
                        // Northwest
                        if (grid[x - 1] && grid[x - 1][y + 1]) {
                            ret.push(grid[x - 1][y + 1]);
                        }
                        // Northeast
                        if (grid[x + 1] && grid[x + 1][y + 1]) {
                            ret.push(grid[x + 1][y + 1]);
                        }
                        return ret;
                    },
                });
                if (!this.grid[x]) this.grid[x] = [];
                this.grid[x][y] = 1;
            }
        }
    }
}
