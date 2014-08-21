'use strict';

var Tower = function(game, x, y, frame, tileX, tileY, tile) {
  Phaser.Sprite.call(this, game, x, y, 'tower', frame);

    this.worldX = x;
    this.worldY = y;
    this.tileX = tileX;
    this.tileY = tileY;
    this.tile = tile;
    this.scale.setTo(0.65);
    
    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(50, 'bullet');
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 1);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);
    
    this.fireTime = 2000;
    this.fireLastTime = this.game.time.now + this.fireTime;
  
};

Tower.prototype = Object.create(Phaser.Sprite.prototype);
Tower.prototype.constructor = Tower;

Tower.prototype.update = function() {
  
};

Tower.prototype.fire = function() {
    this.bullets.createMultiple(1, 'bullet', 0, false);
    if (this.game.time.now > this.fireLastTime) {
        var bullet = this.bullets.getFirstExists(false);

        if (bullet && typeof this.parent.enemys.children[0] != "undefined") {
            bullet.reset(this.x, this.y);
            bullet.lifespan = 2000;
//            bullet.body.collideWorldBounds = true;
            bullet.rotation = parseFloat(this.game.physics.arcade.angleToXY(bullet, this.parent.enemys.children[0].x, this.parent.enemys.children[0].y)) * 180 / Math.PI;
            this.game.physics.arcade.moveToObject(bullet, this.parent.enemys.children[0], 500);
        }
        this.fireLastTime = this.game.time.now + this.fireTime;
    }
}

module.exports = Tower;
