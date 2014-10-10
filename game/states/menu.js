
'use strict';

var LabelButton = require('../prefabs/labelButton');

function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    this.game.add.tileSprite(0, 0, 1000, 800, 'menu_bg');
      
    this.buttonGroup = this.game.add.group();
//    this.buttonGroup.create(this.game.width - 100, this.game.world.centerY, 'button');
    this.menu_bg = this.game.add.sprite(this.game.world.centerX, 50, 'wc3_menu');
//    this.buttons = this.game.add.sprite(this.game.world.centerX, 50, 'wc3_button');
    this.buttonGroup.add(this.menu_bg);
    this.button = new LabelButton(this.game, this.game.world.centerX + 160 , 200, 'wc3_button', 'TEST-BUTTON', this.actionOnClick, this, 'wc3_button1.png', 'wc3_button2.png', 'wc3_button3.png');
    this.button.scale.setTo(1.4, 1.2);
    this.buttonGroup.add(this.button);
    
      
//    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
//    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
//    this.sprite.anchor.setTo(0.5, 0.5);
//
//    this.titleText = this.game.add.text(this.game.world.centerX, 300, '\'Allo, \'Allo!', style);
//    this.titleText.anchor.setTo(0.5, 0.5);
//
//    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play "Click The Yeoman Logo"', { font: '16px Arial', fill: '#ffffff', align: 'center'});
//    this.instructionsText.anchor.setTo(0.5, 0.5);
//
//    this.sprite.angle = -20;
//    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
//    if(this.game.input.activePointer.justPressed()) {
//        this.game.state.start('play', true, false, {player: 1});
////        this.game.state.start('login');
//    }
  },
    actionOnClick: function() {
//            this.game.state.start('play', true, false, {player: 1});
            this.game.state.start('login');
    }
};

module.exports = Menu;