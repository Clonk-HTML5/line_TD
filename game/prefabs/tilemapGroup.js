'use strict';

var Tilemap = require('./tilemap');

var TilemapGroup = function(game) {
  Phaser.Group.call(this, game);

  // initialize your prefab here
//  this.tilemap = new Tilemap(this.game, 12, 0 , {tilemapName: 'towerdefencemap', tilesetName: 'tileset_summer_grass_b', layerNames: ['Ground'], walkables: [25, 26, 27, 28, 80, 41, 42, 44, 45, 46, 48, 79, 66, 65, 73, 70, 103, 104, 102, 75, 23, 20, 21, 22, 76, 9, 74, 81, 78, 12, 110, 83, 17, 18, 19, 84, 82, 89, 86, 13, 118, 117, 85, 90, 97, 10, 125, 93, 98, 105, 101, 108, 106, 11, 113, 107, 24, 100, 14, 92, 91, 69, 94, 111, 112, 126, 114, 121, 34, 35, 36, 72, 49, 50, 51, 52, 53, 54, 55, 56, 71, 38, 122]})
  
  this.tilemap = new Tilemap(this.game, 12, 0 , {tilemapName: 'towerdefencemap', tilesetName: 'summerTiles', layerNames: ['Ground'], walkables: [335, 336, 337, 338, 339, 340, 341, 342]})
  this.add(this.tilemap);
  
};

TilemapGroup.prototype = Object.create(Phaser.Group.prototype);
TilemapGroup.prototype.constructor = TilemapGroup;

module.exports = TilemapGroup;