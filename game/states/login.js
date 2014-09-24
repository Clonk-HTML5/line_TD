'use strict';
  function Login() {}
  Login.prototype = {
    preload: function() {
      // Override this method to add some load operations. 
      // If you need to use the loader, you may need to use them here.
    },
    create: function() {
        GlobalGame.Multiplayer.functions = {
          registerUsername: function(evt){
            if (evt && evt.preventDefault) evt.preventDefault();
            var loginUIElement = document.getElementById('login-ui'),
                loginElement = document.getElementById('login');
            if (loginElement.value.trim() === '') {
              loginUIElement.innerHTML += '<p>Enter a valid username!</p>';
              return;
            }
            GlobalGame.Multiplayer.userName = loginElement.value;
            // Register our username with the server
            cloak.message('registerUsername', {
              username: GlobalGame.Multiplayer.userName
            });
            return;
          },
          createRoom: function(evt) {
            if (evt && evt.preventDefault) evt.preventDefault();
            var newRoomElement = document.getElementById('new-room'),
                newRoomUIElement = document.getElementById('new-room-ui');
            if (newRoomElement.value.trim() === '') {
              newRoomUIElement.innerHTML += '<p>Enter a valid Roomname!</p>';
              return;
            }
            cloak.message('createRoom', {
              name: escape(newRoomElement.value)
            });
          },

          refreshLobby: function(users) {
            console.log('refreshing lobby');
            cloak.message('listUsers');
            cloak.message('listRooms');
          },

          refreshWaiting: function() {
            cloak.message('refreshWaiting');
          },

          joinRoom: function(id) {
            cloak.message('joinRoom', id);
          }
        }
        
        var networkElement = document.getElementById('network-ui'),
            refreshLobby = document.getElementById('refreshLobby'),
            createNewRoomForm = document.getElementById('createNewRoomForm'),
            userNameForm = document.getElementById('userNameForm');
        
        networkElement.style.display="block";
        
        refreshLobby.addEventListener("click", GlobalGame.Multiplayer.functions.refreshLobby, false)
        createNewRoomForm.addEventListener("submit", GlobalGame.Multiplayer.functions.createRoom, false);
        userNameForm.addEventListener("submit", GlobalGame.Multiplayer.functions.registerUsername, false);
        
        
        // cloak socket.io configuration
        cloak.configure({
          messages: {
            'registerUsernameResponse': function(success) {
              console.log(success ? 'username registered' : 'username failed');
              // if we registered a username, try to join the lobby
              if (success) {
                // get the lobby
                cloak.message('joinLobby');
              }
            },

            'joinLobbyResponse': function(success) {
              console.log('joined lobby');
              GlobalGame.Multiplayer.functions.refreshLobby();
            },

            'refreshLobby': function(data) {
              var users = data.users;
              var inLobby = data.inLobby;

              var lobbyElement = document.getElementById('lobby'),
                lobbyListElement = document.getElementById('lobby-list'),
                newRoomUIElement = document.getElementById('new-room-ui'),
                roomsElement = document.getElementById('rooms'),
                roomListElement = document.getElementById('room-list');

              console.log('other users in room', users);
              lobbyElement.style.display = 'block';
              lobbyListElement.style.display = 'block';
              newRoomUIElement.style.display = 'block';
              roomsElement.style.display = 'block';
              roomListElement.style.display = 'block';
              lobbyListElement.innerHTML = '<ul>';
              _.chain(users)
                .each(function(user) {
                  if (inLobby) {
                    lobbyListElement.innerHTML += '<li>' + escape(user.name) + '</li>';
                  }
                  else {
                    lobbyListElement.innerHTML += '<li>' + escape(user.name) + ' (' + data.roomCount + '/' + data.roomSize + ')</li>';
                  }
                });
              lobbyListElement.innerHTML += '</ul>';
            },

            'listRooms': function(rooms) {
              var roomListElement = document.getElementById('room-list');
              roomListElement.innerHTML = '<ul>';
                _.each(rooms, function(room) {
                  roomListElement.innerHTML += '<li>' + escape(room.name) + ' (' + room.users.length + '/' + room.size + ') <a href="#" onclick="GlobalGame.Multiplayer.functions.joinRoom(\'' + room.id  + '\')">join</a><li class="indented">' + room.users[0].name + '</li></li>';
                });
              roomListElement.innerHTML += '</ul>';
            },

            'joinRoomResponse': function(result) {
              if (result.success) {
                game.room.id = result.id;
                game.begin();
                GlobalGame.Multiplayer.functions.refreshWaiting();
              }
            },

            refreshWaitingResponse: function(members) {
              if (!members) {
                return;
              }
              var waitingForPlayerElem = document.getElementById('waitingForPlayer');
              if (members.length < 2) {
                waitingForPlayerElem.style.display = 'block';
              }
              else {
                waitingForPlayerElem.style.display = 'none';
              }
            },

            'roomCreated': function(result) {
              console.log(result.success ? 'room join success' : 'room join failure');
              if (result.success) {
                game.room.id = result.roomId;
                game.begin();
              }
            },

            'cardsLeft': function(cardsLeft) {
              document.getElementById('cardsLeft').innerText = cardsLeft;
            },

            'card': function(card) {
              console.log('the card:', card);
              game.drawCard.val = card.val;
              game.drawCard.suit = card.suit;
              game.drawCard.setFresh(true);
            },

            'userMessage': function(msg) {
              console.log('The server says: ' + msg);
            },

            'turn': function(msg) {
              game.turn = msg;
              console.log('Turn: ' + game.turn);
              game.updateTurn();
              GlobalGame.Multiplayer.functions.refreshWaiting();
            },

            'gameOver': function() {
              var msg = '';
              var myOldScore = game.score.get(game.team);
              var theirOldScore = game.score.get(game.otherTeam);
              game.finalScore();
              var myTiebreaker = game.score.get(game.team) - myOldScore;
              var theirTiebreaker = game.score.get(game.otherTeam) - theirOldScore;
              if (game.score.get(game.team) > game.score.get(game.otherTeam)) {
                msg = 'YOU WIN';
              }
              else if (game.score.get(game.team) < game.score.get(game.otherTeam)) {
                msg = 'YOU LOSE';
              }
              else {
                msg = 'TIE GAME';
              }

              // append tiebreaker text
              if (myTiebreaker > 0 || theirTiebreaker > 0) {
                msg +=  '\nTiebreaker!' +
                        '\nBase scores: ' + myOldScore +
                        '\nYour tiebreaker: ' + myTiebreaker +
                        '\nTheir tiebreaker: ' + theirTiebreaker;
              }
              game.showGameOver(msg);
            },

            'assignTeam': function(data) {
              console.log('my team is', data.team);
              game.team = data.team;
              game.otherTeam = (game.team === 'red') ? 'black' : 'red';
              game.turn = data.turn;
              game.updateTurn();
            },

            'placedTarget': function(data) {
              console.log('target data', data);
              //set the next card
              game.drawCard.val = data[1].val;
              game.drawCard.suit = data[1].suit;
              // find the target and place the drawn card on it
              var target = _.findWhere(game.targets, {targetId: data[0]});
              target.placeCard();
            }
          },

          serverEvents: {
            'connect': function() {
              console.log('connect');
            },

            'disconnect': function() {
              console.log('disconnect');
            },

            'lobbyMemberJoined': function(user) {
              console.log('lobby member joined', user);
              cloak.message('listUsers');
            },

            'lobbyMemberLeft': function(user) {
              console.log('lobby member left', user);
              cloak.message('listUsers');
            },

            'roomCreated': function(rooms) {
              console.log('created a room', rooms);
              GlobalGame.Multiplayer.functions.refreshLobby();
            },

            'roomDeleted': function(rooms) {
              console.log('deleted a room', rooms);
              GlobalGame.Multiplayer.functions.refreshLobby();
            },

            'roomMemberJoined': function(user) {
              console.log('room member joined', user);
              GlobalGame.Multiplayer.functions.refreshWaiting();
            },

            'roomMemberLeft': function(user) {
              console.log('room member left', user);
              // The other player dropped, so we need to stop the game and show return to lobby prompt
              game.showGameOver('The other player disconnected!');
              cloak.message('leaveRoom');
              console.log('Removing you from the room because the other player disconnected.');
            },

            'begin': function() {
              console.log('begin');
              cloak.message('listRooms');
            }
          }

        });

        cloak.run('http://localhost:8090');
    },
    update: function() {
      // state update code
    },
    paused: function() {
      // This method will be called when game paused.
    },
    render: function() {
      // Put render operations here.
    },
    shutdown: function() {
      // This method will be called when the state is shut down 
      // (i.e. you switch to another state from this one).
    }
  };
module.exports = Login;
