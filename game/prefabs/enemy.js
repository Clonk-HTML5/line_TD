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
    this.path = [];
    this.blocked = true;
    this.findPathTo(12, 26);
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.findPathTo = function(tilex, tiley) {
        this.pathfinder.setCallbackFunction(function(path) {
//            if(compareArrays(this.path, path)){
                this.path = path;
//                for(var i = 0, ilen = this.path.length; i < ilen; i++) {
//    //                this.map.putTile(139, path[i].x, path[i].y, this.objectslayer);
//                    this.next_positX = parseInt(this.path[i].x*GlobalGame.tileSquare);
//                    this.next_positY = parseInt(this.path[i].y*GlobalGame.tileSquare);
//                    this.nextTile();
//                    this.moveElmt();
//                }
                this.blocked = false;
//            }
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

//function compareArrays(a, b){
//	if (a.constructor!=Array || b.constructor!=Array || a.length!=b.length) return false;
//	var L=a.length,i;
//	while (i<L) {
//		if (a[i]==b[i] || compareArrays(a[i],b[i])) i++;
//		else return false;
//	}
//	return true;
//};

module.exports = Enemy;
