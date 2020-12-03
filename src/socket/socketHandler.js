const knex = require('knex');
const GameService = require('../endGame/endGame');
const { Server } = require('socket.io');
const ServerRooms = require('./serverRooms');
const Deck = require('../game/deck/deck');
const config = require('./../config')

const socketHandler = (socket, io) => {
  // console.log('a user connected!');

  /* ================ USER JOIN SERVER START ==============*/
  socket.on('joinServer', (userObj) => {


    // define socket identity info before join
    socket.nickname = userObj.playerName;
    socket.roomNumber = userObj.room;
    socket.player_id = userObj.user_id;
    //  socket.id is auto generated and should NOT be touched
    if (ServerRooms.activeRooms[socket.roomNumber]) {
      // check to see if room exists
      if (ServerRooms.activeRooms[socket.roomNumber].started === true) {
        // check to see if room is started
        return socket.emit('server join denial');
      }
    }


    const currentUser = {
      playerName: socket.nickname,
      player_id: userObj.user_id,
      roomNumber: userObj.room,
      socket_id: socket.id, // to communicate via socket
      email: userObj.email,
    };

    if (ServerRooms.rooms[userObj.room] === undefined) {
      // add room if there is none
      ServerRooms.addRoom(userObj.room);
      ServerRooms.addPlayerToRoom(userObj.room, currentUser);
    } else {
      if (ServerRooms.rooms[userObj.room].capacity === 4) {
        // 4 players in room already
        socket.emit('gameFull', 'The game you tried to join is full.');
        return;
      } else {
        ServerRooms.addPlayerToRoom(userObj.room, currentUser);
      }
    }
    // AFTER SERVERROOMS METHODS
    // ASSUMES SERVERROOMS GOES WELL
    socket.join(userObj.room);

    // OR, ServerRooms.rooms[socket.roomNumber].players
    // const users = io.in(userObj.room).sockets.sockets;
    // can optimize later

    const playersInRoom = [];
    ServerRooms.rooms[socket.roomNumber].players.forEach((el) => {
      if (el.roomNumber === userObj.room) {
        playersInRoom.push({
          id: el.socket_id,
          playerName: el.playerName,
          room: el.roomNumber,
          email: el.email,
        });
      }
    });

    const responseObject = {
      room: `Room ${userObj.room}.`,
      self: {
        socket_id: socket.id,
        socket_nickname: socket.nickname,
      },
      players: playersInRoom,
      message: `${socket.nickname} connected to the room!`,
    };

    // socket.emit('serverResponse', responseObject);
    // single emit

    // vs room emit
    // all users in the room
    io.to(userObj.room).emit('serverResponse', responseObject);
  });

  socket.on('serverMessage', (userObj) => {
    // userObj needs username and value in the future
    io.to(userObj.room).emit('messageResponse', userObj);
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

  socket.on('gather list', (message) => {
    const retObj = {};
    for (var room in ServerRooms.activeRooms) {
      if (ServerRooms.activeRooms[room].started === false) {
        retObj[room] = ServerRooms.activeRooms[room];
      }
    }

    socket.emit('list response', retObj);
  });
  // ======================= SERVER END =======================
  // ======================= GAME START =======================

  socket.on('start game', async (players) => {
    // console.log(players);

    // take room out of active lobbies
    ServerRooms.activeRooms[socket.roomNumber].started = true;

    const deck = new Deck();
    // create new deck
    deck.shuffle();
    // shuffle new deck

    // distribute cards to players
    for (let i = 0; i < players.length; i++) {
      const hand = {
        hand: [],
        otherPlayers: {},
      };
      while (hand.hand.length < 7) {
        hand.hand.push(deck.draw());
      }
      console.log(hand)

      // for (let j = 0; j < players.length; j++) {
      //     if (players[j].id !== players[i].id) {
      //         hand.otherPlayers[players[j].id] = 7;
      //     }
      // }

      io.to(players[i].id).emit('game start RESPONSE', hand);
    }

    // set deck after emits
    ServerRooms.rooms[socket.roomNumber].deck = deck;
    // started games arent displayed in server list
    ServerRooms.activeRooms[socket.roomNumber].started = true;
    // set first turn randomly
    const randomIndex = Math.floor(Math.random() * players.length);
    const randomID = players[randomIndex].id;

    for (let i = 0; i < players.length; i++) {
      if (players[i].id === randomID) {
        // emit your turn
        io.to(players[i].id).emit('your turn');
      } else {
        // emit other player turn, give name of player
        io.to(players[i].id).emit('other player turn', {
          playerName: players[randomIndex].playerName,
        });
      }
    }
  });

  socket.on('claim seat', (userObj) => {
    // userObj.players
    // userObj.name
    // userObj.seat
    // userObj.name
    // console.log(userObj)

    for (let i = 0; i < userObj.roomPlayers.length; i++) {
      const user = userObj.roomPlayers[i];
      if (user.playerName !== userObj.name) {
        // emit to all users in room
        io.to(user.id).emit('seat chosen', {
          seat: userObj.seat,
          name: userObj.name,
          roomPlayers: userObj.roomPlayers,
        });
      }
    }
  });

  socket.on('draw a card from the deck', (userObj) => {
    const { cardCount, playerName } = userObj;
    const card = ServerRooms.rooms[socket.roomNumber].deck.draw();

    if (!card) {
      socket.emit('draw card denied', 'Deck empty');
    } else {
      socket.emit('draw card fulfilled', { card });
      io.to(socket.roomNumber).emit('update other player card count', {
        newCount: cardCount + 1,
        playerName: playerName,
      });
    }
  });

  // ======================= GAMEPLAY =======================
  // SERVER RESPONSES

  socket.on('request rank from player', (requestObj) => {
    const asker = requestObj.asker;
    const requested = requestObj.requested;
    const rankReq = requestObj.rankReq;

    // console.log(`does ${requested} have a ${rankReq}? Asking now...`)
    io.to(socket.roomNumber).emit('messageResponse', {
      user: 'Server Message',
      value: `${asker.name} is asking  ${requested.requestedName} for a ${rankReq === 1 ? 'Ace' :
      rankReq === 11 ? 'Jack' : rankReq === 12 ? 'Queen' : rankReq === 13 ? 'King' : rankReq}.`,
    });

    socket.broadcast
      .to(requested.requestedId)
      .emit('rank request from player', requestObj);
  });

  socket.on('rank request denial', (requestObj) => {
    const { asker, requested, rankReq, CARD } = requestObj;

    // message update
    io.to(socket.roomNumber).emit('messageResponse', {
      user: 'Server Message',
      value: `${requested.requestedName} did not have a  ${rankReq === 1 ? 'Ace' :
      rankReq === 11 ? 'Jack' : rankReq === 12 ? 'Queen' : rankReq === 13 ? 'King' : rankReq}, go fish ${asker.name}!`,
    });

    socket.broadcast.to(asker.user_id).emit('go fish', requestObj);
  });

  socket.on('rank request accept', (gameObj) => {
    const { requested, asker, rankReq, CARD, cardCount } = gameObj;

    // message update
    io.to(socket.roomNumber).emit('messageResponse', {
      user: 'Server Message',
      value: `${requested.requestedName} had a  ${rankReq === 1 ? 'Ace' :
      rankReq === 11 ? 'Jack' : rankReq === 12 ? 'Queen' : rankReq === 13 ? 'King' : rankReq}, good guess ${asker.name}!`,
    });
    // card count update for requested
    io.to(socket.roomNumber).emit('update other player card count', {
      newCount: cardCount,
      playerName: requested.requestedName,
    });
    // card count update for asker
    io.to(socket.roomNumber).emit('update other player card count', {
      newCount: asker.currentCount + 1,
      playerName: asker.name,
    });

    // EMIT =========
    socket.broadcast.to(asker.user_id).emit('correct rank return', gameObj);
  });

  socket.on('next turn', () => {
    const serverPlayers = ServerRooms.rooms[socket.roomNumber].players;

    const player = serverPlayers.find((el) => {
      return el.socket_id === socket.id;
    });
    const indexOfPlayer = serverPlayers.indexOf(player);
    const overMaxIndexCheck =
      indexOfPlayer + 1 >= serverPlayers.length ? 0 : indexOfPlayer + 1;
    const newPlayer = serverPlayers[overMaxIndexCheck];

    for (let i = 0; i < serverPlayers.length; i++) {
      if (serverPlayers[i].socket_id == newPlayer.socket_id) {
        // emit your turn
        io.to(newPlayer.socket_id).emit('your turn');
      } else {
        // emit other player turn, give name of player
        io.to(serverPlayers[i].socket_id).emit('other player turn', {
          playerName: newPlayer.playerName,
        });
      }
    }
  });
  // ======================= GAMEPLAY END =======================
  socket.on('book found', (booksObj) => {
    const { cardsInBook, playerBooks, playerName, playerCardCount } = booksObj;

    ServerRooms.rooms[socket.roomNumber].bookCount

    if (!ServerRooms.rooms[socket.roomNumber].bookCount) {
      const bookCountInRoom = 0;
    }

    const roomBooksForPlayer = ServerRooms.rooms[socket.roomNumber].books;

    for (let i = 0; i < playerBooks.length; i++) {
      // put each card in book set
      if (roomBooksForPlayer[socket.nickname]) {
        if (!roomBooksForPlayer[socket.nickname].includes(playerBooks[i])) {
          roomBooksForPlayer[socket.nickname].push(playerBooks[i]);
          ServerRooms.rooms[socket.roomNumber].bookCount++;
        }
      } else {
        roomBooksForPlayer[socket.nickname] = [playerBooks[i]];
        ServerRooms.rooms[socket.roomNumber].bookCount++;
      }
    }

    // console.log('=================================================')
    // console.log(ServerRooms.rooms[socket.roomNumber])
    // console.log('=================================================')
    // console.log(socket.roomNumber);
    // console.log(ServerRooms.rooms[socket.roomNumber].bookCount);
    // console.log('=================================================')

    // update other player bookcount and cardcounts
    socket.to(socket.roomNumber).emit('update other player books', {
      playerName,
      playerBooks,
    });

    io.to(socket.roomNumber).emit('update other player card count', {
      newCount: playerCardCount,
      playerName: playerName,
    });

    // if all books collected (13), end game
    if (ServerRooms.rooms[socket.roomNumber].bookCount >= 13) {
      // all books stored client side, so just call display

      // ======================= GAME END =======================
      io.to(socket.roomNumber).emit('game end');
    }
  });

  socket.on('game end database update', (userObj) => {
    const { user_id, booksCollected, win } = userObj;

    const db = knex({
      client: 'pg',
      connection: config.DATABASE_URL,
    });
    // update user table with new info
    // if win true, add 1 to wins
    if (win) {
      GameService.updatePlayerWin(db, {
        user_id,
        booksCollected,
      });
    } else {
      GameService.updatePlayerLoss(db, {
        user_id,
        booksCollected,
      });
    }
  });

  // ======================= GAME END =======================
  // SERVER DC
  socket.on('disconnect', () => {
    if (socket.roomNumber) {
      ServerRooms.removePlayer(socket.id, socket.roomNumber);

      if (ServerRooms.rooms[socket.roomNumber]) {
        io.to(socket.roomNumber).emit('serverResponse', {
          message: `${socket.nickname} left the room!`,
          players: ServerRooms.rooms[socket.roomNumber].players || [],
        });
      } else {
        io.to(socket.roomNumber).emit('serverResponse', {
          message: `${socket.nickname} left the room!`,
          players: [],
        });
      }
    }
    console.log(`${socket.id} disconnected!`);
  });
};

module.exports = socketHandler;
