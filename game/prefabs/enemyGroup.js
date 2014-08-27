'use strict';

var Enemy = require('./enemy');

var EnemyGroup = function(game) {
   Phaser.Group.call(this, game);
    this.spawn()
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.ARCADE;
};

EnemyGroup.prototype = Object.create(Phaser.Group.prototype);
EnemyGroup.prototype.constructor = EnemyGroup;

EnemyGroup.prototype.update = function() {
        if(this.enemy){
        this.forEachAlive(function(enemy) {
            enemy.blocked = true;
            enemy.findPathTo(12, 26);
        }, this);
    if (this.game.input.mousePointer.isDown){
//        this.spawn();
    }
        }
};

EnemyGroup.prototype.spawn = function() {
    var i = 0;
    this.enemysBcl = setInterval(
        (function(self) {
         return function() {
            if (i < 20) {
                  self.enemy = new Enemy(self.game, 12*GlobalGame.tileSquare, 0*GlobalGame.tileSquare, 3);
                  self.enemy.blocked = true;
                  self.enemy.findPathTo(12, 26);
                  self.add(self.enemy);
            } else {
                clearTimeout(self.enemysBcl);
            }
            i++;
         }
     })(this), 1000);
};


module.exports = EnemyGroup;
