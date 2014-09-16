'use strict';

var Pathfinding = require('../plugins/phaser_pathfinding-0.2.0');
var Level1 = require('../prefabs/level1');
  
function Play() {}
  Play.prototype = {
    create: function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.level1 = new Level1(this.game);
		//debug plugin
		this.game.add.plugin(Phaser.Plugin.Debug);
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.o_mcamera;
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

        if (this.cursors.up.isDown){
              this.game.camera.y -= 10;
        }
        else if (this.cursors.down.isDown)
        {
            this.game.camera.y += 10;
        }
        this.move_camera_by_pointer(this.game.input.mousePointer);
        this.move_camera_by_pointer(this.game.input.pointer1);
    },
    move_camera_by_pointer: function(o_pointer) {
        if (!o_pointer.timeDown) { return; }
        if (o_pointer.isDown && !o_pointer.targetObject) {
            if (this.o_mcamera) {
                this.game.camera.x += this.o_mcamera.x - o_pointer.position.x;
                this.game.camera.y += this.o_mcamera.y - o_pointer.position.y;
            }
            this.o_mcamera = o_pointer.position.clone();
        }
        if (o_pointer.isUp) { this.o_mcamera = null; }
    }
  };


  
  module.exports = Play;