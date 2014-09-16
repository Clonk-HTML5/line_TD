'use strict';

var Tower = require('./tower');

var TowerGroup = function(game, enemys) {
  Phaser.Group.call(this, game);

  // initialize your prefab here
//    this.tower = new Tower(this.game, 13*GlobalGame.tileSquare, 15*GlobalGame.tileSquare, 3);
//    this.add(this.tower);
    this.towerFrameNumbers = [1,3,5,7];
    this.currentTowerFrame = 3;
    this.tileForbiden = ["9", "10"];
    this.enemys = enemys;
    this.showTowerImages();
    this.game.input.onDown.add(TowerGroup.prototype.posit, this);
    
    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(500, 'bullet');
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);
    
    this.towerCosts = 20;
    this.towersBuilt = 0;
    this.maxTowers = 40;
    
    this.maxTowersText = this.game.add.text(this.game.width - 170, 75, 'Max Towers: ' + this.towersBuilt + ' / '+ this.maxTowers,{ font: '16px Arial', fill: '#08d465', align: 'center'});
    this.maxTowersText.fixedToCamera = true;
    
    this.gold = 100;
    this.goldText = this.game.add.text(this.game.width - 100, 95, 'Gold: ' + this.gold,{ font: '16px Arial', fill: '#08d465', align: 'center'});
    this.goldText.fixedToCamera = true;
    
    this.income = 50;
    this.incomeText = this.game.add.text(this.game.width - 115, 115, 'Income: ' + this.income,{ font: '16px Arial', fill: '#08d465', align: 'center'});
    this.incomeText.fixedToCamera = true;
    this.QUARTERMINUTE = Phaser.Timer.MINUTE/3;
    
   this.game.time.events.loop(this.QUARTERMINUTE, this.incomeHandler, this);
};

TowerGroup.prototype = Object.create(Phaser.Group.prototype);
TowerGroup.prototype.constructor = TowerGroup;

TowerGroup.prototype.update = function() {
   if(this.tower){
        this.forEachAlive(function(tower) {
            this.enemys.forEachAlive(function(loopedEnemy) {
                if (this.game.physics.arcade.distanceBetween(tower,loopedEnemy) < 150) tower.fire(loopedEnemy);

                this.game.physics.arcade.overlap(this.bullets, loopedEnemy, this.bulletHitsEnemy, null, this);
            }, this)
        }, this);
   }
};

TowerGroup.prototype.posit = function(pointer) {
    if(this.towersBuilt < this.maxTowers && this.gold >= this.towerCosts){
        var tileworldX = pointer.worldX - (pointer.worldX % GlobalGame.tileSquare),
            tileworldY = pointer.worldY - (pointer.worldY % GlobalGame.tileSquare),
            tileX = Math.floor(pointer.worldX / GlobalGame.tileSquare),
            tileY = Math.floor(pointer.worldY / GlobalGame.tileSquare),
            index = String(eval(tileX + "" + tileY));

        if (this.tileForbiden.indexOf(index) == -1) {
            if(this.game.plugins.plugins[0] instanceof Phaser.Plugin.PathFinderPlugin){
                this.game.plugins.plugins[0].avoidAdditionalPoint(tileX, tileY);
            }
            this.tower = new Tower(this.game, tileworldX, tileworldY, this.currentTowerFrame, tileX, tileY, 'tower', this.bullets);
            this.add(this.tower);
            this.towersBuilt++;
            this.maxTowersText.setText('Max Towers: ' + this.towersBuilt + ' / '+ this.maxTowers);
            this.gold -= this.towerCosts;
            this.goldText.setText('Gold: ' + this.gold);
            this.enemys.forEachAlive(function(enemy) {
//                enemy.blocked = true;
                enemy.findPathTo(enemy.pathToX, enemy.pathToY);
            }, this);
            this.tileForbiden.push(index);
        }
    }
};

TowerGroup.prototype.incomeHandler = function () {
    this.gold += this.income; 
    this.goldText.setText('Gold: ' + this.gold);
}

TowerGroup.prototype.showTowerImages = function () {
    this.towerImageGroup = this.game.add.group(this.game, this, 'towerImageGroup')
    for (var i = 0, len = this.towerFrameNumbers.length; i < len; i++){
        this.towerImage = this.game.add.sprite(50, this.game.height - (i+1)*80, 'tower', this.towerFrameNumbers[i]);
        this.towerImage.anchor.set(0.5);
        this.towerImage.inputEnabled = true;
        this.towerImageGroup.add(this.towerImage);
    }
    this.towerImageGroup.forEach(function(towerImage) {
        towerImage.events.onInputDown.add(function(){this.currentTowerFrame = towerImage.frame;}, this);
    }, this);
}

TowerGroup.prototype.bulletHitsEnemy = function (enemy, bullet) {
    bullet.kill();
    enemy.health -= 1
    if(enemy.health <= 0){
        enemy.kill();
    }
}

module.exports = TowerGroup;
