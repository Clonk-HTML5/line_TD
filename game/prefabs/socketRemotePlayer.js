'use strict';

var SocketRemotePlayer = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'socketRemotePlayer', frame);

  // initialize your prefab here
  
};

SocketRemotePlayer.prototype = Object.create(Phaser.Sprite.prototype);
SocketRemotePlayer.prototype.constructor = SocketRemotePlayer;

SocketRemotePlayer.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = SocketRemotePlayer;
