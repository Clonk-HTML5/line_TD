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

        if (this.cursors.up.isDown){
              this.game.camera.y -= 10;
        }
        else if (this.cursors.down.isDown)
        {
            this.game.camera.y += 10;
        }
        if(this.game.input.onHold){
            this.onSwipe();
            if (this.swiping){
                this.swiping = false;
                if(this.firstPointX > this.lastPointX){

                    this.checkSwipeX = this.firstPointX - this.lastPointX;

                    if ( this.checkSwipeX >= 150 ) {
                        this.canMove = true;
    //                    this.direction = 3;
                        this.game.camera.x += 10;
                    }

                } else if(this.firstPointX < this.lastPointX){

                    this.checkSwipeX = this.lastPointX - this.firstPointX;

                    if ( this.checkSwipeX >= 150 ) {
                        this.canMove = true;
    //                    this.direction = 1;
                        this.game.camera.x -= 10;
                    }
                }

                if(this.firstPointY > this.lastPointY){

                    this.checkSwipeY = this.firstPointY - this.lastPointY;

                    if ( this.checkSwipeY >= 150 ) {
                        this.canMove = true;
    //                    this.direction = 0;
                        this.game.camera.y += 10;
                    }

                } else if(this.firstPointY < this.lastPointY){

                    this.checkSwipeY = this.lastPointY - this.firstPointY;

                    if ( this.checkSwipeY >= 150 ) {
                        this.canMove = true;
    //                    this.direction = 2;
                        this.game.camera.y -= 10;
                    }
                }
            }
        }
    },
    onSwipe: function() {
        if (Phaser.Point.distance(this.game.input.activePointer.position, this.game.input.activePointer.positionDown) > 150 && this.game.input.activePointer.duration > 100 && this.game.input.activePointer.duration < 250)
        {
            this.firstPointX = this.game.input.activePointer.positionDown.x;
            this.firstPointY = this.game.input.activePointer.positionDown.y;

            this.lastPointX = this.game.input.activePointer.position.x;
            this.lastPointY = this.game.input.activePointer.position.y;

            this.swiping = true;
        }
    }

  };


  
  module.exports = Play;