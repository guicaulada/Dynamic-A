function preload() {
    game.load.tilemap('map', 'assets/tilemaps/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('grass', 'assets/tilemaps/grass-tiles-2-small.png');
    game.load.image('shrooms', 'assets/tilemaps/littleshrooms_0.png');
    game.load.image('bush', 'assets/tilemaps/qubodup-bush_0.png');
    game.load.image('bush1', 'assets/tilemaps/qubodup-bush_berries_0.png');
    game.load.image('tree', 'assets/tilemaps/tree2-final.png');
    game.load.image('Overworld', 'assets/tilemaps/Overworld.png');
    game.load.spritesheet('character', 'assets/character.png', 16, 32);
}

var map;
var layer1;
var layer2;
var layer3;
var path;
var pathVisible = false;

var character;
var characterSpeed = 300;

var cursors;
var mKey, nKey,
    lKey;
var lKeyPressed = false;

var interval;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    map = game.add.tilemap('map');
    map.addTilesetImage('grass-tiles-2-small', 'grass');
    map.addTilesetImage('littleshrooms_0', 'shrooms');
    map.addTilesetImage('qubodup-bush_0', 'bush');
    map.addTilesetImage('qubodup-bush_berries_0', 'bush1');
    map.addTilesetImage('tree2-final', 'tree');
    map.addTilesetImage('Overworld', 'Overworld');
    map.setCollisionBetween(1, 30);
    //create layers
    layer1 = map.createLayer('Ground');
    layer2 = map.createLayer('Collision');
    layer3 = map.createLayer('Foreground');
    layer1.resizeWorld();
    layer2.resizeWorld();
    layer3.resizeWorld();
    //add chracter
    character = game.add.sprite(96, 96, 'character');
    game.physics.arcade.enable(character);
    character.body.collideWorldBounds = true;
    character.scale.setTo(1.5, 1.5);
    character.anchor.setTo(.5, .75);
    character.body.setSize(16, 16, 0, 16);
    //add character animations
    character.animations.add('idle', [9, 10, 11, 12], 10, true);
    character.animations.add('up', [34, 35, 36, 37], 10, true);
    character.animations.add('down', [0, 1, 2, 3], 10, true);
    character.animations.add('left', [51, 52, 53, 54], 10, true);
    character.animations.add('right', [17, 18, 19, 20], 10, true);
    character.animations.play('idle');
    game.camera.follow(character);
    //create game input
    cursors = game.input.keyboard.createCursorKeys();
    mKey = game.input.keyboard.addKey(Phaser.Keyboard.M);
    nKey = game.input.keyboard.addKey(Phaser.Keyboard.N);
    lKey = game.input.keyboard.addKey(Phaser.Keyboard.L);
    game.input.onDown.add(function(pointer, event) {
        var tileworldX = pointer.worldX - (pointer.worldX % 32);
        var tileworldY = pointer.worldY - (pointer.worldY % 32);
        var tileX = Math.floor(pointer.worldX / 32);
        var tileY = Math.floor(pointer.worldY / 32);
        console.log("Character: " + Math.floor(character.x / 32) + "," + Math.floor(character.y / 32));
        console.log("Destination: " + tileX + "," + tileY);
        hidePath();
        path = Astar(tileX, tileY);
        clearInterval(interval);
        var pathIndex = 0;
        //set interval to move sprite one tile at a time torwards its path
        interval = setInterval(function() {
            if (path != null) {
                moveTo(path[pathIndex].Tile.x, path[pathIndex].Tile.y);
                if (path[pathIndex].Tile.x > Math.floor(character.x / 32)) {
                    character.animations.play('right');
                } else if (path[pathIndex].Tile.x < Math.floor(character.x / 32)) {
                    character.animations.play('left');
                } else if (path[pathIndex].Tile.y > Math.floor(character.y / 32)) {
                    character.animations.play('down');
                } else if (path[pathIndex].Tile.y < Math.floor(character.y / 32)) {
                    character.animations.play('up');
                }
                if(path[pathIndex].Tile.y > Math.floor(character.y / 32) && path[pathIndex].Tile.x == tileX) {
                  character.animations.play('down');
                }
                if(path[pathIndex].Tile.y < Math.floor(character.y / 32) && path[pathIndex].Tile.x == tileX) {
                  character.animations.play('up');
                }
                pathIndex++;
                if (pathIndex >= path.length) {
                    character.animations.play('idle');
                    clearInterval(interval);
                }
            }
        }, characterSpeed);
    });
}

function update() {
    game.physics.arcade.collide(character, layer2);
    layer3.bringToTop();
    if (lKey.isDown) {
        if (!lKeyPressed) {
            lKeyPressed = true;
            if (pathVisible) {
                console.log("Path Hidden.");
                pathVisible = false;
            } else if (!pathVisible) {
                console.log("Path Visible.");
                pathVisible = true;
            }
        }
        game.time.events.add(500, function() {
            lKeyPressed = false;
        }, game);
    }
    if (!pathVisible) {
        hidePath();
    } else if (pathVisible) {
        showPath();
    }
    character.body.velocity.x = 0;
    character.body.velocity.y = 0;
    if (mKey.isDown) {
        if (characterSpeed > 100) {
            console.log("Speed Increased");
            characterSpeed -= 30;
        } else {
            console.log("Speed Maxed.");
        }
    } else if (nKey.isDown) {
        if (characterSpeed < 400) {
            console.log("Speed Decreased");
            characterSpeed += 30;
        } else {
            console.log("Speed Slowest.");
        }
    }
}

function moveTo(toX, toY) {
    var move = game.add.tween(character);
    move.to({
        x: toX * 32,
        y: toY * 32
    }, 300);
    move.start();
}

function showPath() {
    if (path != null) {
        for (var i = 0; i < path.length; i++) {
            map.getTile(path[i].Tile.x, path[i].Tile.y, 1).alpha = 0;
            layer1.dirty = true;
        }
    }
}

function hidePath() {
    if (path != null) {
        for (var i = 0; i < path.length; i++) {
            map.getTile(path[i].Tile.x, path[i].Tile.y, 1).alpha = 1;
            layer1.dirty = false;
        }
    }
}
