'use strict';

var Pathfinding = require('../plugins/phaser_pathfinding-0.2.0');
var Level1 = require('../prefabs/level1');
var Hud = require('../prefabs/hud');
//var io = require('../plugins/socket.io');  
//var SocketEventHandlers = require('../prefabs/socketEventHandlers');  
  
function Play() {}
  Play.prototype = {
    init: function(options) {
            if(cloak.connected()) this.room = options.room ? options.room : false;
            this.player = options.player ? options.player : 1;
            this.enemyPlayer = this.player === 1 ? 2 : 1;
            this.countPlayers = 2;
            this.level = options.level ? options.level : 1;
        this.round = 0;
    },
    create: function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        switch(this.level){
            case 1:
                this.currentLevel = new Level1(this.game);
                break;
            case 2:
//                this.currentLevel = new Level2(this.game);
                break;
        }
        
        this.hud = new Hud(this.game, this.level);
        this.hud.z = 100;
//        this.game.world.bringToTop(this.hud);
        
		//debug plugin
//		this.game.add.plugin(Phaser.Plugin.Debug);
        
        this.game.world.setBounds(0, -50, this.game.world.width, this.game.height)
        this.game.camera.setSize(this.game.width, 350)
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.o_mcamera;
    },
  render: function() {
      this.game.debug.text(this.game.time.fps || '--', 2, 14, "#ffffff");
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
    },
      //find objects in a Tiled layer that containt a property called "type" equal to a certain value
      findObjectsByType: function(type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function(element){
          if(element.properties.type === type) {
            //Phaser uses top left, Tiled bottom left so we have to adjust
            //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
            //so they might not be placed in the exact position as in Tiled
            element.y -= map.tileHeight;
            result.push(element);
          }      
        });
        return result;
      }
  };


  
  module.exports = Play;