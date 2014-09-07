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
    
    this.roundText = this.game.add.text(this.game.width - 100, 20, 'Round '+ this.round,{ font: '16px Arial', fill: '#08d465', align: 'center'});
    this.roundText.fixedToCamera = true;
    
    this.livesText = this.game.add.text(this.game.width - 100, 45, 'Lives: '+ this.lives,{ font: '16px Arial', fill: '#08d465', align: 'center'});
    this.livesText.fixedToCamera = true;
    
    this.spawn();
};

EnemyGroup.prototype = Object.create(Phaser.Group.prototype);
EnemyGroup.prototype.constructor = EnemyGroup;

EnemyGroup.prototype.update = function() {
//        var enemyToGetPath = this.getFirstAlive();
    this.forEachAlive(function(enemy) {
        enemy.moveOnTilemap();
        if(this.game.physics.arcade.distanceToXY(enemy, enemy.pathToX*GlobalGame.tileSquare, enemy.pathToY*GlobalGame.tileSquare) <= 3){    
            enemy.kill();
            this.lives--;
            this.livesText.setText('Lives: '+ this.lives);
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

EnemyGroup.prototype.generateEnemy = function() {
      this.enemy = new Enemy(this.game, 12*GlobalGame.tileSquare, 0*GlobalGame.tileSquare, 'enemy'+this.round, 3);
      this.add(this.enemy);
}


module.exports = EnemyGroup;
