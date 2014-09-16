'use strict';

var EnemyGroup = require('./enemyGroup');
var TowerGroup = require('./towerGroup');
var TilemapGroup = require('./tilemapGroup');
//var PhaserDebug = require('../plugins/phaser_debug');

var Level1 = function(game) {
 Phaser.Group.call(this, game);
    
    this.tilemap = new TilemapGroup(this.game);
    this.enemys = new EnemyGroup(this.game);
    this.towers = new TowerGroup(this.game, this.enemys);
    
//    console.log(Phaser.Plugin.Debug)
//    this.game.add.plugin(Phaser.Plugin.Debug);
};

Level1.prototype = Object.create(Phaser.Group.prototype);
Level1.prototype.constructor = Level1;

module.exports = Level1;
