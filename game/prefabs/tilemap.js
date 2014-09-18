'use strict';

var Tilemap = function(game, x, y, options) {
  Phaser.Sprite.call(this, game, x, y, options.tilesetName);
    this.kill();
    if(options){
      // initialize your prefab here
        this.map = this.game.add.tilemap(options.tilemapName);
        GlobalGame.map = this.map;
    //        this.map.addTilesetImage('mountain_landscape_23');
        this.map.addTilesetImage(options.tilesetName);
        this.groundlayer = this.map.createLayer('Ground');
        this.groundlayer.resizeWorld();
        
        for(var i = 0; i < options.layerNames.length; i++){
            this[options.layerNames[i]] = this.map.createLayer(options.layerNames[i]);
            this[options.layerNames[i]].visible = false;
        }
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
  
};

module.exports = Tilemap;
