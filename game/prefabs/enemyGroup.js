'use strict';

var Enemy = require('./enemy');

var EnemyGroup = function(game) {
   Phaser.Group.call(this, game);
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.ARCADE;
    this.pauseKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.path = [];
    this.lives = 30;
    this.round = 0;
    this.maxRounds = 3;
    
    this.player1StartPoint = GlobalGame.Functions.findObjectsByType('Player1Start', GlobalGame.map, 'Objects');
    this.player1EndPoint = GlobalGame.Functions.findObjectsByType('Player1End', GlobalGame.map, 'Objects'); 
    this.player2StartPoint = GlobalGame.Functions.findObjectsByType('Player2Start', GlobalGame.map, 'Objects');
    this.player2EndPoint = GlobalGame.Functions.findObjectsByType('Player2End', GlobalGame.map, 'Objects');
    
    this.roundText = this.game.add.text(this.game.width - 100, 20, 'Round '+ this.round,{ font: '16px Arial', fill: '#08d465', align: 'center'});
    this.roundText.fixedToCamera = true;
    
    this.livesText = this.game.add.text(this.game.width - 100, 45, 'Lives: '+ this.lives,{ font: '16px Arial', fill: '#08d465', align: 'center'});
    this.livesText.fixedToCamera = true;
    
    this.spawn();
    this.showEnemyImages();
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
    if ( this.pauseKey.justPressed() ){
        this.spawn();
    }
};

EnemyGroup.prototype.spawn = function() {
    if(this.round < this.maxRounds) this.round++;
    
    this.roundText.setText('Round '+this.round.toString());
    
    this.enemyGenerator = this.game.time.create(false);
    this.enemyGenerator.start();
    this.enemyGenerator.repeat(Phaser.Timer.SECOND * 1.25, 5, this.generateEnemy, this);
    this.enemyGenerator.onComplete.add(function(){
      this.game.time.events.add(Phaser.Timer.SECOND * 20, this.spawn, this);
    }, this);
    
};

EnemyGroup.prototype.generateEnemy = function(currentEnemyFrame, player) {
      var currentFrame = currentEnemyFrame ? currentEnemyFrame : this.round,
          playerId = player ? player : 1;
      this.enemy = new Enemy(this.game, this['player'+playerId+'StartPoint'][0].x, this['player'+playerId+'StartPoint'][0].y, 'enemy'+currentFrame, 3, currentFrame, this['player'+playerId+'EndPoint'][0], playerId);
      this.add(this.enemy);
}

EnemyGroup.prototype.showEnemyImages = function () {
    this.spawnEnemyImageGroup = this.game.add.group(this.game, this, 'spawnEnemyImageGroup')
    for (var i = 1, len = this.maxRounds; i <= len; i++){
        this.spawnEnemyImage = this.game.add.sprite(this.game.width-100, this.game.height - i*80, 'enemy'+i, 3);
        this.spawnEnemyImage.anchor.set(0.5);
        this.spawnEnemyImage.inputEnabled = true;
        this.spawnEnemyImageGroup.add(this.spawnEnemyImage);
    }
    this.spawnEnemyImageGroup.forEach(function(spawnEnemyImage) {
        spawnEnemyImage.events.onInputDown.add(function(){this.generateEnemy(spawnEnemyImage.key.replace( /^\D+/g, ''), 2);}, this);
    }, this);
}


module.exports = EnemyGroup;
