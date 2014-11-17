'use strict';

var Enemy = require('./enemy');

var EnemyGroup = function(game) {
   Phaser.Group.call(this, game);
    this.enemyIconFrameNumbers = [60,63,65,67,73,80,85,88,90,91];
    this.iconSize = 45;
    this.iconSpacing = 2;
    this.iconSizeSpaced = this.iconSize + this.iconSpacing;
    this.iconBoardWidth = 200;
    this.iconBoardHeight = 200;
    this.iconBoardCols;
    this.iconBoardRows = 3;
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.ARCADE;
    this.lives = 30;
    this.round = 0;
    this.maxRounds = 3;
    
    if(this.game.plugins.plugins[0] instanceof Phaser.Plugin.PathFinderPlugin) this.pathfinder = this.game.plugins.plugins[0];
    this.pathfinder._easyStar.setIterationsPerCalculation(1000); 
    
    this.player1StartPoint = GlobalGame.Functions.findObjectsByType('Player1Start', GlobalGame.map, 'Objects');
    this.player1EndPoint = GlobalGame.Functions.findObjectsByType('Player1End', GlobalGame.map, 'Objects'); 
    this.player2StartPoint = GlobalGame.Functions.findObjectsByType('Player2Start', GlobalGame.map, 'Objects');
    this.player2EndPoint = GlobalGame.Functions.findObjectsByType('Player2End', GlobalGame.map, 'Objects');
    
    if(this.game.state.getCurrentState().player > 1){
        var playerCameraPos = this['player'+this.game.state.getCurrentState().player+'StartPoint'][0];
        this.game.camera.x = playerCameraPos.x;
        this.game.camera.y = playerCameraPos.y;
    }
    
    this.roundText = this.game.add.text(this.game.width - 100, 20, 'Round '+ this.round,{ font: '16px Arial', fill: '#08d465', align: 'center'});
    this.roundText.fixedToCamera = true;
    
    this.livesText = this.game.add.text(this.game.width - 100, 45, 'Lives: '+ this.lives,{ font: '16px Arial', fill: '#08d465', align: 'center'});
    this.livesText.fixedToCamera = true;
    
    this.spawn();
    this.showEnemyImages();
    
    for(var i = 1; i <= this.game.state.getCurrentState().countPlayers; i++){
        this.findPathTo(this['player'+i+'StartPoint'][0], this['player'+i+'EndPoint'][0], i);
    }
};

EnemyGroup.prototype = Object.create(Phaser.Group.prototype);
EnemyGroup.prototype.constructor = EnemyGroup;

EnemyGroup.prototype.update = function() {
//        var enemyToGetPath = this.getFirstAlive();
    this.forEachAlive(function(enemy) {
        enemy.moveOnTilemap();
        if(this.game.physics.arcade.distanceToXY(enemy, enemy.pathToX*GlobalGame.tileSquare, enemy.pathToY*GlobalGame.tileSquare) <= 3){    
            enemy.kill();
            if(enemy.playerId === 1){
                this.lives--;
                this.livesText.setText('Lives: '+ this.lives);
            }
        }
    }, this);
};

EnemyGroup.prototype.spawn = function() {
    if(this.round < this.maxRounds) this.round++;
    
    this.roundText.setText('Round '+this.round.toString());
    
    this.enemyGenerator = this.game.time.create(false);
    this.enemyGenerator.start();
    this.enemyGenerator.repeat(Phaser.Timer.SECOND * 1.25, 5, function(){
        for(var i = 1; i <= this.game.state.getCurrentState().countPlayers; i++){
            this.generateEnemy(this.round, i);
        }
    }, this);
    this.enemyGenerator.onComplete.add(function(){
      this.game.time.events.add(Phaser.Timer.SECOND * 20, this.spawn, this);
    }, this);
    
};

EnemyGroup.prototype.findPathTo = function(from, to, playerId, callback) {
    if(from && to){
        this.pathfinder.setCallbackFunction(function(path) {
            if(path) this['path'+playerId] = path;
            this.tweenEnemy(playerId);
            if(typeof callback === 'function'){
                callback(path);
            }
        }.bind(this));
        this.pathfinder.preparePathCalculation([from.x/GlobalGame.tileSquare ,from.y/GlobalGame.tileSquare], [to.x/GlobalGame.tileSquare,to.y/GlobalGame.tileSquare]);
        this.pathfinder.calculatePath();
    }
};

EnemyGroup.prototype.generateEnemy = function(currentEnemyFrame, player, enemyIsMultiplayer) {
      var currentFrame = currentEnemyFrame ? currentEnemyFrame : this.round,
          playerId = player ? player : 1;
      if(enemyIsMultiplayer) cloak.message('spawnEnemey', {player: playerId, frame: currentFrame});
      this.enemy = new Enemy(this.game, this['player'+playerId+'StartPoint'][0].x, this['player'+playerId+'StartPoint'][0].y, 'enemy'+currentFrame, 3, currentFrame, this['player'+playerId+'EndPoint'][0], playerId);
      this.add(this.enemy);
      this.enemy.nextTile();
}
EnemyGroup.prototype.tweenEnemy = function(playerId) {
  var currentPlayerPath = this['path'+playerId],
      totalPathLength = currentPlayerPath.length,
      debugPath = this.game.add.graphics(0,0);
  debugPath.lineStyle(5,0xff0000);
  debugPath.moveTo(this['player'+playerId+'StartPoint'][0].x*GlobalGame.tileSquare,this['player'+playerId+'StartPoint'][0].y*GlobalGame.tileSquare);

  var tweenHelper = {progress: 0}
  tweenHelper.onUpdate = function(tween, value){
    var index = Math.round(value*totalPathLength)-1,
        p = currentPlayerPath[index === -1 ? index+1 : index]
    
    debugPath.lineTo(p.x*GlobalGame.tileSquare, p.y*GlobalGame.tileSquare)
  }
  var tween = this.game.add.tween(tweenHelper).to( { progress: 1}, 5000).start()
  tween.onUpdateCallback(tweenHelper.onUpdate)
}

EnemyGroup.prototype.showEnemyImages = function () {
    var j = 0;
	this.iconBoardCols = Phaser.Math.floor(this.iconBoardWidth / this.iconSizeSpaced);
    this.spawnEnemyImageGroup = this.game.add.group(this.game, this, 'spawnEnemyImageGroup')
	for (var i = 0; i < this.enemyIconFrameNumbers.length; i++) {
            var lineMaxCols = this.iconBoardCols * (j+1),
                doubleIconFrame = i+1,
                iconFrameNumber = i;
        
            if(doubleIconFrame > lineMaxCols) j++;
            if(i >= this.iconBoardCols) iconFrameNumber = iconFrameNumber - this.iconBoardCols * j;
            
            var imageXpos = this.game.width - 220 + iconFrameNumber * this.iconSizeSpaced,
                imageYpos = this.game.height - 35 - j * this.iconSizeSpaced;
        
            this.spawnEnemyImage = this.game.add.sprite(imageXpos, imageYpos, 'icons', this.enemyIconFrameNumbers[i]);
            this.spawnEnemyImage.enemyNumber = i;
            this.spawnEnemyImage.anchor.set(0.5);
            this.spawnEnemyImage.inputEnabled = true;
            this.spawnEnemyImageGroup.add(this.spawnEnemyImage);
	}
    this.spawnEnemyImageGroup.forEach(function(spawnEnemyImage) {
        spawnEnemyImage.events.onInputDown.add(function(){
            this.generateEnemy(spawnEnemyImage.enemyNumber, this.game.state.getCurrentState().enemyPlayer, cloak.connected() ? true : false);
            this.income += 50;
            console.log(this.game.state.getCurrentState())
            console.log(this.game.state.getCurrentState().hud)
            console.log(this.game.state.getCurrentState().hud.incomeText)
              this.game.state.getCurrentState().hud.incomeText.setText('Income: '+this.income.toString())
        }, this);
    }, this);
}


module.exports = EnemyGroup;
