
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
                    neighbors: [(graph, cell) => {
                        let grid = graph.grid;
                        let ret = [];
                        // West
                        if (grid[cell.x - 1] && grid[cell.x - 1][cell.y]) {
                            ret.push(grid[cell.x - 1][cell.y]);
                        }
                        // East
                        if (grid[cell.x + 1] && grid[cell.x + 1][cell.y]) {
                            ret.push(grid[cell.x + 1][cell.y]);
                        }
                        // South
                        if (grid[cell.x] && grid[cell.x][cell.y - 1]) {
                            ret.push(grid[cell.x][cell.y - 1]);
                        }
                        // North
                        if (grid[cell.x] && grid[cell.x][cell.y + 1]) {
                            ret.push(grid[cell.x][cell.y + 1]);
                        }

                        // Diagonals
                        // Southwest
                        if (grid[cell.x - 1] && grid[cell.x - 1][cell.y - 1]) {
                            ret.push(grid[cell.x - 1][cell.y - 1]);
                        }
                        // Southeast
                        if (grid[cell.x + 1] && grid[cell.x + 1][cell.y - 1]) {
                            ret.push(grid[cell.x + 1][cell.y - 1]);
                        }
                        // Northwest
                        if (grid[cell.x - 1] && grid[cell.x - 1][cell.y + 1]) {
                            ret.push(grid[cell.x - 1][cell.y + 1]);
                        }
                        // Northeast
                        if (grid[cell.x + 1] && grid[cell.x + 1][cell.y + 1]) {
                            ret.push(grid[cell.x + 1][cell.y + 1]);
                        }
                        return ret;
                    }],
                    heuristic: (pos0, pos1) => {
                        // Manhattan
                        let d1 = Math.abs(pos1.x - pos0.x);
                        let d2 = Math.abs(pos1.y - pos0.y);
                        return d1 + d2;
                    },
                });
                if (!this.grid[x]) this.grid[x] = [];
                this.grid[x][y] = 1;
            }
        }
    }
}
