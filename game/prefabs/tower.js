'use strict';

var Tower = function(game, x, y, frame, tileX, tileY, tile, bullets) {
  Phaser.Sprite.call(this, game, x, y, 'tower', frame);

    this.worldX = x;
    this.worldY = y;
    this.tileX = tileX;
    this.tileY = tileY;
    this.tile = tile;
    this.scale.setTo(0.65);
    this.width2 = this.width/2;
    this.height2 = this.height/2;
    
    this.bullets = bullets;
    this.fireRate = 2000;
    this.nextFire = 0;
};

Tower.prototype = Object.create(Phaser.Sprite.prototype);
Tower.prototype.constructor = Tower;

Tower.prototype.fire = function(enemy) {
    if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
        this.nextFire = this.game.time.now + this.fireRate;
        var bullet = this.bullets.getFirstDead();
        bullet.reset(this.x + this.width2, this.y + this.height2);
        bullet.rotation = this.game.physics.arcade.moveToObject(bullet, enemy, 500);
    }
}

module.exports = Tower;
