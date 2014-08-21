'use strict';

var Tilemap = require('./tilemap');

var TilemapGroup = function(game) {
  Phaser.Group.call(this, game);

  // initialize your prefab here
  this.tilemap = new Tilemap(this.game, 12, 0 , {tilemapName: 'towerdefencemap', tilesetName: 'summerTiles', layerNames: ['Ground'], walkables: [335, 336, 337, 338, 339, 340, 341, 342]})
  this.add(this.tilemap);
  
};

TilemapGroup.prototype = Object.create(Phaser.Group.prototype);
TilemapGroup.prototype.constructor = TilemapGroup;

module.exports = TilemapGroup;