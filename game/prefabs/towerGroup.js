'use strict';

var Tower = require('./tower');

var TowerGroup = function(game, enemys) {
  Phaser.Group.call(this, game);

  // initialize your prefab here
//    this.tower = new Tower(this.game, 13*GlobalGame.tileSquare, 15*GlobalGame.tileSquare, 3);
//    this.add(this.tower);
    this.tileForbiden = ["9", "10"];
    this.enemys = enemys;
    this.game.input.onDown.add(TowerGroup.prototype.posit, this);
    
    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(100, 'bullet');
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);
};

TowerGroup.prototype = Object.create(Phaser.Group.prototype);
TowerGroup.prototype.constructor = TowerGroup;

TowerGroup.prototype.update = function() {
   var enemy = this.enemys.getFirstAlive();
   if(this.tower && enemy){
    this.forEachAlive(function(tower) {
        if (this.game.physics.arcade.distanceBetween(tower,enemy) < 200) tower.fire(enemy);
    }, this);

    this.game.physics.arcade.overlap(this.bullets, this.enemys, this.bulletHitsEnemy, null, this);
   }
};

TowerGroup.prototype.posit = function(pointer) {
    var tileworldX = pointer.worldX - (pointer.worldX % GlobalGame.tileSquare),
        tileworldY = pointer.worldY - (pointer.worldY % GlobalGame.tileSquare),
        tileX = Math.floor(pointer.worldX / GlobalGame.tileSquare),
        tileY = Math.floor(pointer.worldY / GlobalGame.tileSquare),
        index = String(eval(tileX + "" + tileY));
    
    if (this.tileForbiden.indexOf(index) == -1) {
        if(this.game.plugins.plugins[0] instanceof Phaser.Plugin.PathFinderPlugin) this.game.plugins.plugins[0].avoidAdditionalPoint(tileX, tileY);
        this.tower = new Tower(this.game, tileworldX, tileworldY, 3, tileX, tileY, 'tower', this.bullets);
        this.add(this.tower);
        this.enemys.forEachAlive(function(enemy) {
            enemy.blocked = true;
            enemy.findPathTo(12, 26);
        }, this);
        this.tileForbiden.push(index);
    }
};

TowerGroup.prototype.bulletHitsEnemy = function (bullet, enemy) {
    bullet.kill();
    enemy.destroy();
}

module.exports = TowerGroup;
