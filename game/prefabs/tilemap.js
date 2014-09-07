'use strict';

var Tilemap = function(game, x, y, options) {
  Phaser.Sprite.call(this, game, x, y, options.tilesetName);
    this.kill();
    if(options){
      // initialize your prefab here
        this.map = this.game.add.tilemap(options.tilemapName);

    //        this.map.addTilesetImage('mountain_landscape_23');
        this.map.addTilesetImage(options.tilesetName);
        for(var i = 0; i < options.layerNames.length; i++){
            this.groundlayer = this.map.createLayer(options.layerNames[i]);
            this.groundlayer.resizeWorld();
        }

    //        this.objectslayer = this.map.createLayer('Objects');
    //        this.map.setCollisionBetween(0, 300);
    //        this.map.setCollision([2,3],true,'Ground');   
//        this.groundlayer = this.map.layers[0];
        this.walkables = options.walkables;
        this.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
        this.pathfinder.setGrid(this.map.layers[0].data, this.walkables);
    }
    
    this.marker = this.game.add.graphics();
    this.marker.lineStyle(2, 0x000000, 1);
    this.marker.drawRect(0, 0, GlobalGame.tileSquare, GlobalGame.tileSquare);
    this.blocked = false;
};

Tilemap.prototype = Object.create(Phaser.Sprite.prototype);
Tilemap.prototype.constructor = Tilemap;

Tilemap.prototype.update = function() {

        this.marker.x = this.groundlayer.getTileX(this.game.input.activePointer.worldX) * GlobalGame.tileSquare;
        this.marker.y = this.groundlayer.getTileY(this.game.input.activePointer.worldY) * GlobalGame.tileSquare;

        if (this.game.input.mousePointer.isDown){
            this.blocked = true;
//            this.findPathTo(this.groundlayer.getTileX(this.marker.x), this.groundlayer.getTileY(this.marker.y));
//            console.log(this.map.getTile(this.groundlayer.getTileX(this.marker.x), this.groundlayer.getTileY(this.marker.y), this.groundlayer))
        }


  
};

Tilemap.prototype.findPathTo = function(tilex, tiley) {

        this.pathfinder.setCallbackFunction(function(path) {
            path = path || [];
            for(var i = 0, ilen = path.length; i < ilen; i++) {
                this.map.putTile(139, path[i].x, path[i].y, this.objectslayer);
            }
            this.blocked = false;
        }.bind(this));

        this.pathfinder.preparePathCalculation([this.x,this.y], [tilex,tiley]);
        this.pathfinder.calculatePath();
};

module.exports = Tilemap;
