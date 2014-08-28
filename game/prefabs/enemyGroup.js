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
        var enemyToGetPath = this.getFirstAlive();
        this.forEachAlive(function(enemy) {
                for(var i = 0, ilen = enemyToGetPath.path.length; i < ilen; i++) {
                    enemy.next_positX = parseInt(enemyToGetPath.path[i].x*GlobalGame.tileSquare);
                    enemy.next_positY = parseInt(enemyToGetPath.path[i].y*GlobalGame.tileSquare);
                    enemy.nextTile();
                    enemy.moveElmt();
                }
        }, this);
};

EnemyGroup.prototype.spawn = function() {
    var i = 0;
    this.enemysBcl = setInterval(
        (function(self) {
         return function() {
            if (i < 30) {
                  self.enemy = new Enemy(self.game, 12*GlobalGame.tileSquare, 0*GlobalGame.tileSquare, 3);
                  self.add(self.enemy);
            } else {
                clearTimeout(self.enemysBcl);
            }
            i++;
         }
     })(this), 1000);
};


module.exports = EnemyGroup;
