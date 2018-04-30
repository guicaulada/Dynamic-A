function Astar(destX, destY) {
    //add start position to open list
    var start = Square(null, map.getTile(Math.floor(character.x / 32), Math.floor(character.y / 32), 1));
    var end = Square(null, map.getTile(destX, destY, 1));
    var openList = [start];
    var closedList = [];
    var path = []; //end path
    var currentSquare;
    var nextSquare;
    var scannedTiles = [];
    var pathFound = false;
    while (pathFound == false) {
        var max = 5000;
        var min = -1;
        //search open list for lowest f score
        for (var i = 0; i < openList.length; i++) {
            if (openList[i].f < max) {
                max = openList[i].f;
                min = i;
            }
        }
        currentSquare = openList.splice(min, 1)[0];
        console.log("curr" + currentSquare);
        console.log("openList" + openList);
        //if current square is the destination
        if (currentSquare.Tile == end.Tile) {
            console.log("path found");
            pathFound = true;
            closedList.push(currentSquare);
            //change every square to its parent / working backwards to find the correct path
            nextSquare = closedList[closedList.length - 1];
            while (nextSquare = nextSquare.Parent) {
                path.push(nextSquare);
            }
            path.reverse();
        } else { //else search for valid adjacent tiles (not in closed list and are walkable)
            var adjacentTiles = findNeighbors(currentSquare.Tile);
            //iterate through adjacent tiles
            for (var i = 0; i < adjacentTiles.length; i++) {
                //if not in the open list and not already scannned
                if (adjacentTiles[i].scanned == false) {
                    nextSquare = Square(currentSquare, adjacentTiles[i]);
                    //calculates g score for new square(parent g + new g )
                    nextSquare.g = currentSquare.g + calculateScore(adjacentTiles[i], currentSquare);
                    //adds g score to calculated h score to calculate final f value
                    nextSquare.f = nextSquare.g + calculateScore(adjacentTiles[i], end);
                    openList.push(nextSquare);
                    scannedTiles.push(adjacentTiles[i]);
                    adjacentTiles[i].scanned = true;
                }
            }
            closedList.push(currentSquare);
        }
    }
    //after pathfinding is done, need to reset all scanned tiles
    for (var i = 0; i < scannedTiles.length; i++) {
        scannedTiles[i].scanned = false;
    }
    return path;
}

//find all valid adjacent tiles
function findNeighbors(tile) {
    var tiles = [];
    var validTiles = [];
    var leftTile = map.getTileLeft(1, tile.x, tile.y);
    var rightTile = map.getTileRight(1, tile.x, tile.y);
    var aboveTile = map.getTileAbove(1, tile.x, tile.y);
    var belowTile = map.getTileBelow(1, tile.x, tile.y);
    var topRightTile = map.getTileRight(1, aboveTile.x, aboveTile.y);
    var topLeftTile = map.getTileLeft(1, aboveTile.x, aboveTile.y);
    var bottomRightTile = map.getTileRight(1, belowTile.x, belowTile.y);
    var bottomLeftTile = map.getTileLeft(1, belowTile.x, belowTile.y);
    tiles.push(leftTile, rightTile, aboveTile, belowTile,
        topRightTile, topLeftTile, bottomRightTile, bottomLeftTile);
    for (var i = 0; i < tiles.length; i++) {
        if (tiles[i].index == 7) { //index 7 = walkable
            validTiles.push(tiles[i]);
        }
    }
    return validTiles;
}

//calculate scores for G and H using euclidean distance
function calculateScore(tile, endTile) {
    var score = 0;
    score += Math.pow((tile.x - endTile.x), 2);
    score += Math.pow((tile.y - endTile.y), 2);
    return Math.sqrt(score);
}

function Square(Parent, Tile) {
    var newSquare = {
        Parent: Parent,
        Tile: Tile,
        x: Tile.x,
        y: Tile.y,
        g: 0,
        f: 0
    };
    return newSquare;
}
