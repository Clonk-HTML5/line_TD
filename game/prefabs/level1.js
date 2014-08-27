'use strict';

var EnemyGroup = require('./enemyGroup');
var TowerGroup = require('./towerGroup');
var TilemapGroup = require('./tilemapGroup');

var Level1 = function(game) {
 Phaser.Group.call(this, game);
    
    this.tilemap = new TilemapGroup(this.game);
    this.enemys = new EnemyGroup(this.game);
    this.towers = new TowerGroup(this.game, this.enemys);
};

Level1.prototype = Object.create(Phaser.Group.prototype);
Level1.prototype.constructor = Level1;

module.exports = Level1;
