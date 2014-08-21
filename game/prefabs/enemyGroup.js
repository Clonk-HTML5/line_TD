'use strict';

var Enemy = require('./enemy');

var EnemyGroup = function(game) {
   Phaser.Group.call(this, game);

  // initialize your prefab here
  this.enemy = new Enemy(this.game, 12*GlobalGame.tileSquare, 0*GlobalGame.tileSquare, 3);
  this.add(this.enemy);
    
    
};

EnemyGroup.prototype = Object.create(Phaser.Group.prototype);
EnemyGroup.prototype.constructor = EnemyGroup;

EnemyGroup.prototype.update = function() {
        this.enemy.blocked = true;
        this.enemy.findPathTo(12, 26);
//    if (this.game.input.mousePointer.isDown){
//        this.enemy.blocked = true;
//        this.enemy.findPathTo(12, 26);
//        console.log('findePath')
//    }
};


module.exports = EnemyGroup;
