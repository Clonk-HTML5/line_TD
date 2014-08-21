'use strict';

var Tower = require('./tower');

var TowerGroup = function(game, enemys) {
  Phaser.Group.call(this, game);

  // initialize your prefab here
//    this.tower = new Tower(this.game, 13*GlobalGame.tileSquare, 15*GlobalGame.tileSquare, 3);
//    this.add(this.tower);
    this.tileForbiden = ["9", "10", "111", "112", "211", "212", "311", "312", "411", "412", "511", "512", "510", "59", "58", "68", "78", "88", "98", "108", "118", "128", "138", "139", "1310", "1311", "1312", "1313", "1314", "1315", "1316", "1416", "1516", "1616", "1716", "1816", "1916", "2016", "2116", "2115", "2114", "2113", "2213", "2313", "2413", "2513"];
    this.enemys = enemys;
    this.game.input.onDown.add(TowerGroup.prototype.posit, this);
};

TowerGroup.prototype = Object.create(Phaser.Group.prototype);
TowerGroup.prototype.constructor = TowerGroup;

TowerGroup.prototype.update = function() {
  
  // write your prefab's specific update code here
   if(this.tower){
    this.forEach(function(tower) {
        tower.fire(tower);
    });
   }
  
};

//TowerGroup.prototype.add = function(pointer) {
//    this.game.input.onDown.add(TowerGroup.prototype.posit, this);
//}

TowerGroup.prototype.posit = function(pointer) {
    var tileworldX = pointer.worldX - (pointer.worldX % GlobalGame.tileSquare),
        tileworldY = pointer.worldY - (pointer.worldY % GlobalGame.tileSquare),
        tileX = Math.floor(pointer.worldX / GlobalGame.tileSquare),
        tileY = Math.floor(pointer.worldY / GlobalGame.tileSquare),
        index = String(eval(tileX + "" + tileY));
    
    if (this.tileForbiden.indexOf(index) == -1) {
        if(this.game.plugins.plugins[0] instanceof Phaser.Plugin.PathFinderPlugin) this.game.plugins.plugins[0].avoidAdditionalPoint(tileX, tileY);
        this.tower = new Tower(this.game, tileworldX, tileworldY, 3, tileX, tileY, 'tower');
        this.add(this.tower);
        this.tileForbiden.push(index);
    }
}

module.exports = TowerGroup;
