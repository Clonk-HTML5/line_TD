'use strict';
var socketPlayer,
    socketGame,
    SocketObject,
    SocketRemotePlayer = require('../prefabs/socketRemotePlayer');  

var SocketEventHandlers = function(game, io) {
        // Start listening for events
            //  Create some baddies to waste :)
//        this.enemies = [];
        socketGame = game;
//        socketPlayer = player;
        SocketObject = this;
        this.enemies = [];
//        this.socket = io.connect("http://localhost", {port: 8120, transports: ["websocket"]});
//        this.socket = io.connect("http://localhost:8120");
//        this.socket = io.connect("https://plane_fight_server-c9-clonk-html5.c9.io");
        this.socket = io.connect("http://192.168.1.5:8120");
//        this.socket = io.connect("http://server-planefight.rhcloud.com:8000");
//        this.socket = io.connect("http://neumic-asnort.codio.io:8120");
//        this.socket = io.connect("http://christian-dev.no-ip.biz:8120");
        GlobalGame.Multiplayer.socket = this.socket;
    
        this.setEventHandlers();
  
};

SocketEventHandlers.prototype.constructor = SocketEventHandlers;

SocketEventHandlers.prototype = {

    setEventHandlers: function() {
        
        // Socket connection successful
        GlobalGame.Multiplayer.socket.on("connect", this.onSocketConnected);

        // Socket disconnection
        GlobalGame.Multiplayer.socket.on("disconnect", this.onSocketDisconnect);

        // New player message received
        GlobalGame.Multiplayer.socket.on("new player", this.onNewPlayer);

        // Player move message received
        GlobalGame.Multiplayer.socket.on("move player", this.onMovePlayer);

        // Player fires bullet message received
        GlobalGame.Multiplayer.socket.on("fire bullet", this.onFireBullet);

        // Bullet hits Player message received
        GlobalGame.Multiplayer.socket.on("bullet hit player", this.onBulletHitPlayer);

        // Player removed message received
        GlobalGame.Multiplayer.socket.on("remove player", this.onRemovePlayer);

    },

    // Socket connected
    onSocketConnected: function(socket) {
        console.log("Connected to socket server ");
        
        GlobalGame.Multiplayer.connected = true;
        // Send local player data to the game server
//        GlobalGame.Multiplayer.socket.emit("new player", {x: socketPlayer.x, y:socketPlayer.y, angle: socketPlayer.angle});
//        this.socket.emit("new player");
    },

    // Socket disconnected
    onSocketDisconnect: function() {
        console.log("Disconnected from socket server");
        GlobalGame.Multiplayer.connected = false;
    },

    
    // New player
    onNewPlayer: function(data) {
        console.log("New player connected: "+data.id + " players " + SocketObject.enemies.length);

        // Add new player to the remote players array data.x, data.y
        if(!SocketObject.playerById(data.id))
            SocketObject.enemies.push(new SocketRemotePlayer(data.id, socketGame, GlobalGame.player, data.x, data.y, data.angle, data.name));
        
        if(SocketObject.enemies[SocketObject.enemies.length-1])
            socketGame.add.existing(SocketObject.enemies[SocketObject.enemies.length-1]);
    },

    // Move player
    onMovePlayer: function(data) {
        
        var movePlayer = SocketObject.playerById(data.id);
        
        // Player not found
        if (!movePlayer) {
            console.log("Player not found: "+data.id);
            return;
        };
        // Update player position
        movePlayer.x = data.x;
        movePlayer.y = data.y;
        movePlayer.angle = data.angle;
        
        if(!socketGame.device.desktop){
            var px = data.x;
            var py = data.y;

            px *= -1;
            py *= -1;

    //        movePlayer.emitter.minParticleSpeed.set(px, py);
    //        movePlayer.emitter.maxParticleSpeed.set(px, py);

            movePlayer.emitter.emitX = data.x;
            movePlayer.emitter.emitY = data.y;
        }

    },
    // Player fires Bullet
    onFireBullet: function(data) {

        var playerHowFired = SocketObject.playerById(data.id),
            bulletTime = 0;

        // Player not found
        if (!playerHowFired) {
            console.log("Player not found: "+data.id);
            return;
        };
        
       if (socketGame.time.now > bulletTime)
        {
            var bullet = playerHowFired.bullets.getFirstExists(false);
            
//                               console.log(game.time.now, bullet)
            
            if (bullet)
            {
                bullet.reset(data.bulletX, data.bulletY);
//                bullet.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(this.plane.angle, 1000))
//                bullet.rotation = this.plane.rotation + this.game.math.degToRad(90);
                bullet.lifespan = 2000;
                 bullet.rotation = data.bulletAngle;
                bullet.body.velocity.copyFrom(socketGame.physics.arcade.velocityFromAngle(data.angle, 1000))
//                game.physics.arcade.velocityFromRotation(data.angle, 1000, bullet.body.velocity);
                bulletTime = socketGame.time.now + 250;
            }
        }
        
        // Update player position
//        playerHowFired.bullet.x = data.bulletX;
//        playerHowFired.bullet.y = data.bulletY;
//        playerHowFired.bullet.rotation = data.bulletAngle;
//        playerHowFired.bullet.body.velocity.copyFrom(socketGame.physics.arcade.velocityFromAngle(data.angle, 1000))

    },
    // Player fires Bullet
    onBulletHitPlayer: function(data) {

        var playerGetsHit = SocketObject.playerById(data.playerId);
        
        if(playerGetsHit){
            // an other player was shooted
            playerGetsHit.health -= 1;
            if(playerGetsHit.health < 1){
                playerGetsHit.kill();
            }
        }else{
            // i think me was shooted
            GlobalGame.player.health -= 1;
            if(GlobalGame.player.health < 1){
               GlobalGame.player.kill();
            }
        }
        
//        console.log(data)
//        console.log(bullet.x, data.bulletX, bullet.rotation, data.bulletAngle)
        // Update player position
//        playerHowFired.bullet.x = data.bulletX;
//        playerHowFired.bullet.y = data.bulletY;
//        playerHowFired.bullet.rotation = data.bulletAngle;
//        playerHowFired.bullet.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(data.angle, 1000))

    },

    // Remove player
    onRemovePlayer: function(data) {

        var removePlayer = SocketObject.playerById(data.id);

        // Player not found
        if (!removePlayer) {
            console.log("Player not found: "+data.id);
            return;
        };

        removePlayer.kill();

        // Remove player from array
        SocketObject.enemies.splice(SocketObject.enemies.indexOf(removePlayer), 1);

    },
        // Find player by ID
    playerById: function(id) {
            var i;
            for (i = 0; i < SocketObject.enemies.length; i++) {
                if (SocketObject.enemies[i].name == id)
                    return SocketObject.enemies[i];
            };

            return false;
        }
};

module.exports = SocketEventHandlers;
