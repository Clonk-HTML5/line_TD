'use strict';

var Enemy = function(game, x, y, name, frame, round, pathEndPoint, playerId) {
  Phaser.Sprite.call(this, game, x, y, name, frame);
    this.playerId = playerId;
    this.anchor.setTo(0.5);
    this.speed = 1;
    this.speedX = 0;
    this.speedY = 0;
    this.health = round;
//    this.curTile = 0;
    if(this.game.plugins.plugins[0] instanceof Phaser.Plugin.PathFinderPlugin) this.pathfinder = this.game.plugins.plugins[0];
    this.pathfinder._easyStar.setIterationsPerCalculation(1000); 
    this.blocked = true;
    this.curTile = 0;
    this.next_positX = 0;
    this.next_positY = 0;
    this.pathToX = pathEndPoint.x/GlobalGame.tileSquare;
    this.pathToY = pathEndPoint.y/GlobalGame.tileSquare;
    this.path = [];
//    this.findPathTo(this.pathToX, this.pathToY, this.x/GlobalGame.tileSquare, this.y/GlobalGame.tileSquare);
//    this.nextTile();
//    this.moveOnTilemap();
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.findPathTo = function(tilex, tiley, fromx ,fromy) {
        this.pathfinder.setCallbackFunction(function(path) {
                this.path = path || [];
                this.blocked = false;
                this.nextTile();
        }.bind(this));
    this.pathfinder.preparePathCalculation([fromx || parseInt(this.x/GlobalGame.tileSquare),fromy || parseInt(this.y/GlobalGame.tileSquare)], [tilex,tiley]);
    this.pathfinder.calculatePath();
};

Enemy.prototype.moveElmt = function() {
        this.game.physics.arcade.moveToXY(this, this.next_positX, this.next_positY, 100);
        this.rotation = this.game.math.angleBetween(
            this.x, this.y,
            this.next_positX, this.next_positY
        );
}
Enemy.prototype.moveOnTilemap = function(i) {
    if(this.parent['path'+this.playerId]){
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.speedX > 0 && this.x >= this.next_positX) {
            this.x = this.next_positX;
            this.nextTile();
        }
        else if (this.speedX < 0 && this.x <= this.next_positX) {
            this.x = this.next_positX;
            this.nextTile();
        }
        else if (this.speedY > 0 && this.y >= this.next_positY) {
            this.y = this.next_positY;
            this.nextTile();
        }
        else if (this.speedY < 0 && this.y <= this.next_positY) {
            this.y = this.next_positY;
            this.nextTile();
        }
    }
}
Enemy.prototype.nextTile = function() {
    if(this.parent['path'+this.playerId]){
        if(this.curTile < this.parent['path'+this.playerId].length) this.curTile++;
        if(this.parent['path'+this.playerId][this.curTile]){
            this.next_positX = parseInt(this.parent['path'+this.playerId][this.curTile].x * GlobalGame.tileSquare);
            this.next_positY = parseInt(this.parent['path'+this.playerId][this.curTile].y * GlobalGame.tileSquare);
        }
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
}

module.exports = Enemy;
