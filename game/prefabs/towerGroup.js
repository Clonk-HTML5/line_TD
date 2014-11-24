'use strict';

var Tower = require('./tower');

var TowerGroup = function(game, enemys) {
  Phaser.Group.call(this, game);

  this.currentLevelVars = GlobalGame.Levels['Level' + this.game.state.getCurrentState().level];

  this.towerFrameNumbers = [1, 3, 5, 7];
  this.towerIconFrameNumbers = [19, 23, 25, 27, 30, 31, 32];
  this.towers = {
    0: {
      name: 'arrow',
      damage: 8,
      speed: 50,
      range: 30,
      frame: 19
    },
    1: {
      name: 'arrow',
      damage: 8,
      speed: 50,
      range: 30,
      frame: 19
    },
    2: {
      name: 'canon',
      damage: 8,
      speed: 50,
      range: 30,
      frame: 19
    },
    3: {
      name: 'magic',
      damage: 8,
      speed: 50,
      range: 30,
      frame: 19
    },
    4: {
      name: 'magic_ice',
      damage: 8,
      speed: 50,
      range: 30,
      frame: 19
    },
    5: {
      name: 'poison',
      damage: 8,
      speed: 50,
      range: 30,
      frame: 19
    },
    6: {
      name: 'hell',
      damage: 8,
      speed: 50,
      range: 30,
      frame: 19
    },
  }
  this.iconSize = 45;
  this.iconSpacing = 2;
  this.iconSizeSpaced = this.iconSize + this.iconSpacing;
  this.iconBoardWidth = 200;
  this.iconBoardHeight = 200;
  this.iconBoardCols;
  this.iconBoardRows = 3;

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

};

TowerGroup.prototype = Object.create(Phaser.Group.prototype);
TowerGroup.prototype.constructor = TowerGroup;

TowerGroup.prototype.update = function() {
  if (this.tower) {
    this.forEachAlive(function(tower) {
      this.enemys.forEachAlive(function(loopedEnemy) {
        if (this.game.physics.arcade.distanceBetween(tower, loopedEnemy) < 150) tower.fire(loopedEnemy);

        this.game.physics.arcade.overlap(this.bullets, loopedEnemy, this.bulletHitsEnemy, null, this);
      }, this)
    }, this);
  }
};

TowerGroup.prototype.posit = function(pointer) {
  if (this.currentLevelVars.towersBuilt < this.currentLevelVars.maxTowers && this.currentLevelVars.gold >= this.currentLevelVars.towerCosts) {
    var tileworldX = pointer.worldX - (pointer.worldX % GlobalGame.tileSquare),
      tileworldY = pointer.worldY - (pointer.worldY % GlobalGame.tileSquare),
      tileX = Math.floor(pointer.worldX / GlobalGame.tileSquare),
      tileY = Math.floor(pointer.worldY / GlobalGame.tileSquare),
      index = String(eval(tileX + "" + tileY)),
      buildAreaFromTiled = GlobalGame.map.getTile(tileX, tileY, 'Player' + this.game.state.getCurrentState().player + 'Build', true).index;
    this.enemys.pathfinder.avoidAdditionalPoint(tileX, tileY);
    var currentPlayer = this.game.state.getCurrentState().player;
    this.enemys.findPathTo(this.enemys['player' + currentPlayer + 'StartPoint'][0], this.enemys['player' + currentPlayer + 'EndPoint'][0], currentPlayer, function(path) {
      if ((buildAreaFromTiled === 378 || buildAreaFromTiled === 128) && this.tileForbiden.indexOf(index) == -1 && path) {
        if (cloak.connected()) cloak.message('buildTower', {
          x: tileworldX,
          y: tileworldY,
          tileX: tileX,
          tileY: tileY,
          frame: this.currentTowerFrame
        });
        this.tower = new Tower(this.game, tileworldX, tileworldY, this.currentTowerFrame, tileX, tileY, 'tower', this.bullets);
        this.add(this.tower);
        this.currentLevelVars.towersBuilt++;
        this.game.state.getCurrentState().hud.maxTowersText.setText('Max Towers: ' + this.currentLevelVars.towersBuilt + ' / ' + this.currentLevelVars.maxTowers);
        this.currentLevelVars.gold -= this.currentLevelVars.towerCosts;
        this.game.state.getCurrentState().hud.goldText.setText('Gold: ' + this.currentLevelVars.gold.toString());
        this.tileForbiden.push(index);
      }
      if (path === null) {
        this.enemys.pathfinder.stopAvoidingAdditionalPoint(tileX, tileY);
      }
    }.bind(this));
  }
};

TowerGroup.prototype.enemyPositTower = function(pos) {
  if (this.towersBuilt < this.maxTowers && this.gold >= this.towerCosts) {
    var tileworldX = pos.x,
      tileworldY = pos.y,
      tileX = pos.tileX,
      tileY = pos.tileY;

    if (this.game.plugins.plugins[0] instanceof Phaser.Plugin.PathFinderPlugin) {
      this.game.plugins.plugins[0].avoidAdditionalPoint(tileX, tileY);
    }
    this.tower = new Tower(this.game, tileworldX, tileworldY, pos.frame, tileX, tileY, 'tower', this.bullets);
    this.add(this.tower);
    for (var i = 1; i <= this.game.state.getCurrentState().countPlayers; i++) {
      this.enemys.findPathTo(this.enemys['player' + i + 'StartPoint'][0], this.enemys['player' + i + 'EndPoint'][0], i);
    }
  }
};

TowerGroup.prototype.showTowerImages = function() {
  var j = 0;
  this.iconBoardCols = Phaser.Math.floor(this.iconBoardWidth / this.iconSizeSpaced);
  this.towerImageGroup = this.game.add.group(this.game, this, 'towerImageGroup')
  for (var i = 0, len = this.towerIconFrameNumbers.length; i < len; i++) {

    var lineMaxCols = this.iconBoardCols * (j + 1),
      doubleIconFrame = i + 1,
      iconFrameNumber = i;

    if (doubleIconFrame > lineMaxCols) j++;
    if (i >= this.iconBoardCols) iconFrameNumber = iconFrameNumber - this.iconBoardCols * j;

    var imageXpos = 55 + iconFrameNumber * this.iconSizeSpaced,
      imageYpos = this.game.height - 35 - j * this.iconSizeSpaced;


    this.towerImage = this.game.add.image(imageXpos, imageYpos, 'icons', this.towerIconFrameNumbers[i]);
    //        var line = 1;
    //        if(i > 3) line = 2;
    //        if(i > 6) line = 3;
    //        this.towerImage = this.game.add.sprite((i+1)*55, this.game.height - 100, 'icons', this.towerIconFrameNumbers[i]);
    this.towerImage.towerNumber = i;
    this.towerImage.anchor.set(0.5);
    this.towerImage.scale.setTo(1.25);
    this.towerImage.inputEnabled = true;
    this.towerImageGroup.add(this.towerImage);
  }
  this.towerImageGroup.forEach(function(towerImage) {
    towerImage.events.onInputDown.add(this.addTowerImage, this);
  }, this);
}

TowerGroup.prototype.bulletHitsEnemy = function(enemy, bullet) {
  bullet.kill();
  enemy.health -= 1
  if (enemy.health <= 0) {
    enemy.kill();
  }
}

TowerGroup.prototype.addTowerImage = function(towerImage) {
    var towerFrame = towerImage.towerNumber;
  this.currentTowerFrame = this.towerFrameNumbers[towerFrame];
  if (typeof this.game.state.getCurrentState().hud !== 'undefined' && this.towers[towerFrame]) {
    this.game.state.getCurrentState().hud.detailsRowNameOfObject.setText(this.towers[towerImage.towerNumber].name);
    this.game.state.getCurrentState().hud.detailsRow1.setText('Damage: '+ this.towers[towerImage.towerNumber].damage);
    this.game.state.getCurrentState().hud.detailsRow2.setText('Speed: '+ this.towers[towerImage.towerNumber].speed);
    this.game.state.getCurrentState().hud.detailsRow3.setText('Range: 50'+ this.towers[towerImage.towerNumber].range);
    this.game.state.getCurrentState().hud.detailsRowIcon.frame = this.towerIconFrameNumbers[towerFrame];
  }
}

module.exports = TowerGroup;
