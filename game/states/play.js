'use strict';

var Pathfinding = require('../plugins/phaser_pathfinding-0.2.0');
var Level1 = require('../prefabs/level1');
  
function Play() {}
  Play.prototype = {
    create: function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.level1 = new Level1(this.game);
        this.cursors = this.game.input.keyboard.createCursorKeys();    
    },

    update: function() {
        if (this.cursors.left.isDown)
        {
            this.game.camera.x -= 10;
        }
        else if (this.cursors.right.isDown)
        {
            this.game.camera.x += 10;
        }

        if (this.cursors.up.isDown)
        {
            this.game.camera.y -= 10;
        }
        else if (this.cursors.down.isDown)
        {
            this.game.camera.y += 10;
        }
    }
  };
  
  module.exports = Play;