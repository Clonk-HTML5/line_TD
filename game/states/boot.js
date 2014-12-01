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
    
    Levels: {
        maxLevels: 2,
        Level1:{
            tilemapName: 'level1',
            tilesetName: 'summerTiles',
            layerNames: ['Player1Build', 'Player2Build'],
            walkables: [335, 336, 337, 338, 339, 340, 341, 342],
            maxPlayers: 2,
            waves: {
                wave1: 'peon',
                wave2: 'sheep',
                wave3: 'goblin',
                wave3: 'notsure',
            },
            lives: 30,
            gold: 100,
            income: 50,
            maxRounds: 3,
            towerCosts: 20,
            towersBuilt: 0,
            maxTowers: 40,
        },
        Level2:{
            tilemapName: 'level2',
            tilesetName: 'tileset_ruins_c',
            layerNames: ['Player1Build', 'Player2Build'],
            walkables: [17],
            maxPlayers: 2,
            waves: {
                wave1: 'peon',
                wave2: 'sheep',
                wave3: 'goblin',
                wave3: 'notsure',
            },
            lives: 30,
            gold: 100,
            income: 50,
            maxRounds: 3,
            towerCosts: 20,
            towersBuilt: 0,
            maxTowers: 40,
        }
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
    },
};

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
    this.game.time.advancedTiming = true;
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
