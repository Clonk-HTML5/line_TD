GlobalGame = {

    level : 0,
    
    /* Here we've just got some global level vars that persist regardless of State swaps */
    score: 0,

    /* If the music in your game needs to play through-out a few State swaps, then you could reference it here */
    music: null,

    /* Your game can check BasicGame.orientated in internal loops to know if it should pause or not */
    orientated: false,
    
    tileSquare: 32,
    
    map: null,
    
    Multiplayer: {
        
        socket: null,
        
        socketEventHandlers: null,

        userName: null,
        
        connected: false
    },
    
    Functions: {
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
    }

};

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    //scaling options
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    
    //have the game centered horizontally
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    //screen size will be set automatically
    this.scale.setScreenSize(true);
      
    this.game.state.start('preload');
  }
};

module.exports = Boot;
