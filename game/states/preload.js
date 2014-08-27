
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.game.width/2,this.game.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('yeoman', 'assets/yeoman-logo.png');
//    this.load.tilemap('map', 'assets/maps/garden.json', null, Phaser.Tilemap.TILED_JSON);
//    this.load.image('mountain_landscape_23', 'assets/maps/mountain_landscape_23.png');
//    this.load.tilemap('towerdefencemap', 'assets/maps/towerdefence.json', null, Phaser.Tilemap.TILED_JSON);
//    this.load.tilemap('towerdefencemap', 'assets/maps/wc2_td.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('towerdefencemap', 'assets/maps/wc2_td_small.json', null, Phaser.Tilemap.TILED_JSON);
//    this.load.image('towerdefence', 'assets/maps/towerdefence.png');
    this.load.image('summerTiles', 'assets/maps/summerTiles.png');
      
//    this.load.spritesheet('tower', 'assets/sprites/tower_all_normal.png', 30, 30);
    this.load.spritesheet('tower', 'assets/sprites/tower_human.png', 59, 64);
    this.load.image('bullet', 'assets/sprites/bullet.png');
    this.load.spritesheet('enemy', 'assets/sprites/peon.png', 37, 37);


  },
  create: function() {
    this.asset.cropEnabled = false; 
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
