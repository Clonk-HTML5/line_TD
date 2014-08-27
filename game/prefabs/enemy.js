'use strict';

var Enemy = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'enemy', frame);

    this.anchor.setTo(0.5);
    this.speed = 0.1;
    this.speedX = 0;
    this.speedY = 0;
//    this.curTile = 0;
    if(this.game.plugins.plugins[0] instanceof Phaser.Plugin.PathFinderPlugin) this.pathfinder = this.game.plugins.plugins[0];
    this.pathfinder._easyStar.setIterationsPerCalculation(500); 
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.findPathTo = function(tilex, tiley) {
        this.pathfinder.setCallbackFunction(function(path) {
            path = path || [];
            for(var i = 0, ilen = path.length; i < ilen; i++) {
//                this.map.putTile(139, path[i].x, path[i].y, this.objectslayer);
                this.next_positX = parseInt(path[i].x*GlobalGame.tileSquare);
                this.next_positY = parseInt(path[i].y*GlobalGame.tileSquare);
                this.nextTile();
                this.moveElmt();
            }
            this.blocked = false;
        }.bind(this));

        this.pathfinder.preparePathCalculation([parseInt(this.x/GlobalGame.tileSquare),parseInt(this.y/GlobalGame.tileSquare)], [tilex,tiley]);
        
        this.pathfinder.calculatePath();
};

Enemy.prototype.moveElmt = function() {

    this.x += this.speedX;
    this.y += this.speedY;
    
    if (this.speedX > 0 && this.x >= this.next_positX) {
        this.x = this.next_positX;
    }
    else if (this.speedX < 0 && this.x <= this.next_positX) {
        this.x = this.next_positX;
    }
    else if (this.speedY > 0 && this.y >= this.next_positY) {
        this.y = this.next_positY;
    }
    else if (this.speedY < 0 && this.y <= this.next_positY) {
        this.y = this.next_positY;
    }
//    this.nextTile();

}
Enemy.prototype.nextTile = function() {
    if (this.next_positX > this.x) {
        this.speedX = this.speed;
        this.angle = 0;
    } else if (this.next_positX < this.x) {
        this.speedX = -this.speed;
        this.angle = 180;
    } else {
        this.speedX = 0;
    }
    if (this.next_positY > this.y) {
        this.speedY = this.speed;
        this.angle = 90;
    } else if (this.next_positY < this.y) {
        this.speedY = -this.speed;
        this.angle = -90;
    } else {
        this.speedY = 0;
    }
}

module.exports = Enemy;
