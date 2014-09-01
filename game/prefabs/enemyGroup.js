'use strict';

var Enemy = require('./enemy');

var EnemyGroup = function(game) {
   Phaser.Group.call(this, game);
    this.spawn()
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.ARCADE;
    this.pauseKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.path = [];
};

EnemyGroup.prototype = Object.create(Phaser.Group.prototype);
EnemyGroup.prototype.constructor = EnemyGroup;

EnemyGroup.prototype.update = function() {
//        var enemyToGetPath = this.getFirstAlive();
        this.forEachAlive(function(enemy) {
                for(var i = 0, ilen = this.path.length; i < ilen; i++) {
                    enemy.next_positX = parseInt(this.path[i].x*GlobalGame.tileSquare);
                    enemy.next_positY = parseInt(this.path[i].y*GlobalGame.tileSquare);
                    enemy.moveElmt();
//                    this.game.physics.arcade.moveToXY(enemy, enemy.next_positX, enemy.next_positY, 100);
//                    enemy.rotation = this.game.math.angleBetween(
//                        enemy.x, enemy.y,
//                        enemy.next_positX, enemy.next_positY
//                    );
                }
        }, this);
    if ( this.pauseKey.justPressed() ){
        this.spawn();
    }
};

EnemyGroup.prototype.spawn = function() {
    var i = 0;
    this.enemysBcl = setInterval(
        (function(self) {
         return function() {
            if (i < 30) {
                  self.enemy = new Enemy(self.game, 12*GlobalGame.tileSquare, 0*GlobalGame.tileSquare, 3);
                  self.add(self.enemy);
                  self.enemy.findPathTo(self.enemy.pathToX, self.enemy.pathToY);
            } else {
                clearTimeout(self.enemysBcl);
            }
            i++;
         }
     })(this), 1000);
};


module.exports = EnemyGroup;
