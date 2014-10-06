
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
    this.load.image('menu_bg', 'assets/sprites/menu/menu_bg.png');
//    this.load.tilemap('towerdefencemap', 'assets/maps/wc2_td_small.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('towerdefencemap', 'assets/maps/ruins.json', null, Phaser.Tilemap.TILED_JSON);
//    this.load.image('summerTiles', 'assets/maps/summerTiles.png');
    this.load.image('tileset_ruins_c', 'assets/maps/tileset_ruins_c.gif');
//    this.load.image('tileset_summer_grass_b', 'assets/maps/tileset_summer_grass_b.gif');
      
    this.load.spritesheet('tower', 'assets/sprites/t_all_normal_small.png', 32, 32);
//    this.load.spritesheet('tower', 'assets/sprites/tower_human.png', 59, 64);
    this.load.image('bullet', 'assets/sprites/bullet.png');
    this.load.spritesheet('enemy1', 'assets/sprites/peon.png', 37, 37);
    this.load.spritesheet('enemy2', 'assets/sprites/grunt.png', 53, 53);
    this.load.spritesheet('enemy3', 'assets/sprites/goblin.png', 44, 44);
//    this.load.spritesheet('enemy', 'assets/sprites/peon16.png', 16, 16);


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
