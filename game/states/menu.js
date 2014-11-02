
'use strict';

var LabelButton = require('../prefabs/labelButton');

function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
        this.game.add.tileSprite(0, 0, 1000, 800, 'menu_bg');

        this.emitter = this.game.add.emitter(this.game.world.centerX, 0, 400);

        this.emitter.width = this.game.world.width;
        // emitter.angle = 30; // uncomment to set an angle for the rain.

        this.emitter.makeParticles('rain');

        this.emitter.minParticleScale = 0.1;
        this.emitter.maxParticleScale = 0.5;

        this.emitter.setYSpeed(300, 500);
        this.emitter.setXSpeed(-5, 5);

        this.emitter.minRotation = 0;
        this.emitter.maxRotation = 0;

        this.emitter.start(false, 1600, 5, 0);
      
        this.buttonGroup = this.game.add.group();
        this.menu_bg = this.game.add.sprite(this.game.world.centerX, 50, 'wc3_menu');
        this.buttonGroup.add(this.menu_bg);
        this.button = new LabelButton(this.game, this.game.world.centerX + 160 , 200, 'wc3_button', 'NEW GAME', this.singleplayerClick, this, 'wc3_button1.png', 'wc3_button2.png', 'wc3_button3.png');
        this.button.scale.setTo(1.4, 1.2);
        this.buttonGroup.add(this.button);
        this.button2 = new LabelButton(this.game, this.game.world.centerX + 160 , 300, 'wc3_button', 'MULTIPLAYER', this.multiplayerClick, this, 'wc3_button1.png', 'wc3_button2.png', 'wc3_button3.png');
        this.button2.scale.setTo(1.4, 1.2);
        this.buttonGroup.add(this.button2);
        this.button3 = new LabelButton(this.game, this.game.world.centerX + 160 , 400, 'wc3_button', 'OPTIONS', this.optionsClick, this, 'wc3_button1.png', 'wc3_button2.png', 'wc3_button3.png');
        this.button3.scale.setTo(1.4, 1.2);
        this.buttonGroup.add(this.button3);
  },
  render: function() {
      this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00");
  },
    singleplayerClick: function() {
        var fadeMenuOut = this.game.add.tween(this.buttonGroup).to({ y: -this.buttonGroup.width*2 }, Math.random() * 4500, Phaser.Easing.Cubic.Out, true);
        fadeMenuOut.onComplete.add(function() {
           this.game.state.start('play', true, false, {player: 1});
        }, this);
    },
    multiplayerClick: function() {
        var fadeMenuOut = this.game.add.tween(this.buttonGroup).to({ y: -this.buttonGroup.width*2 }, Math.random() * 4500, Phaser.Easing.Cubic.Out, true);
        fadeMenuOut.onComplete.add(function() {
            this.game.state.start('login');
        }, this);
    },
    optionsClick: function() {
        var fadeMenuOut = this.game.add.tween(this.buttonGroup).to({ y: -this.buttonGroup.width*2 }, Math.random() * 4500, Phaser.Easing.Cubic.Out, true);
        fadeMenuOut.onComplete.add(function() {
            this.game.state.start('login');
        }, this);
    }
};

module.exports = Menu;