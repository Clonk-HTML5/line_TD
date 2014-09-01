'use strict';

var Enemy = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'enemy', frame);
    this.anchor.setTo(0.5);
    this.speed = 0.4;
    this.speedX = 0;
    this.speedY = 0;
//    this.curTile = 0;
    if(this.game.plugins.plugins[0] instanceof Phaser.Plugin.PathFinderPlugin) this.pathfinder = this.game.plugins.plugins[0];
    this.pathfinder._easyStar.setIterationsPerCalculation(1000); 
    this.blocked = true;
    this.pathToX = 12;
    this.pathToY = 26;
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.findPathTo = function(tilex, tiley) {
        this.pathfinder.setCallbackFunction(function(path) {
            if(this.parent){
            console.log(this)
                this.parent.path = path;
                this.blocked = false;
            }
        }.bind(this));
    this.pathfinder.preparePathCalculation([parseInt(this.x/GlobalGame.tileSquare),parseInt(this.y/GlobalGame.tileSquare)], [tilex,tiley]);
    this.pathfinder.calculatePath();
};

Enemy.prototype.moveElmt = function() {
        this.game.physics.arcade.moveToXY(this, this.next_positX, this.next_positY, 100);
        this.rotation = this.game.math.angleBetween(
            this.x, this.y,
            this.next_positX, this.next_positY
        );
}

module.exports = Enemy;
