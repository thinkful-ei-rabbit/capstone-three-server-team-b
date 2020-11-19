const { Server } = require('socket.io');
const ServerRooms = require('./serverRooms');

const socketHandler = (socket, io) => {

    // console.log('a user connected!');

    /* ================ USER JOIN SERVER START ==============*/
    socket.on('joinServer', (userObj) => {
        // define socket identity info before join
        socket.nickname = userObj.playerName;
        socket.roomNumber = userObj.room;
        socket.player_id = userObj.user_id;
        //  socket.id is auto generated and should NOT be touched
        // console.log(userObj);

        const currentUser = {
            playerName: socket.nickname,
            player_id: userObj.user_id,
            roomNumber: userObj.room,
            socket_id: socket.id, // to communicate via socket
            avatarLink: userObj.avatarLink,
        };


        if (ServerRooms.rooms[userObj.room] === undefined) {
            ServerRooms.addRoom(userObj.room);
            // ServerRooms.adjustRoomCapacity(userObj.room, true);
            ServerRooms.addPlayerToRoom(userObj.room, currentUser)
        } else {
            if (ServerRooms.rooms[userObj.room].capacity === 4) {
                socket.emit('gameFull', 'The game you tried to join is full.');
                return;
            } else {

                // ServerRooms.adjustRoomCapacity(userObj.room, true);
                ServerRooms.addPlayerToRoom(userObj.room, currentUser)
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
                    room: el.roomNumber
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
            message: `${socket.nickname} connected to the room!`
        };

        // socket.emit('serverResponse', responseObject);
        // single emit

        // vs room emit
        // all users in the room
        io.to(userObj.room).emit('serverResponse', responseObject);

    });

    socket.on('serverMessage', (userObj) => {
        // userObj needs username and value in the future
        io.to(userObj.room).emit('messageResponse', userObj.value);
    });

    socket.on('gather list', (message) => {
        socket.emit('list response', ServerRooms.activeRooms);
    });
    // ======================= SERVER END =======================
    // ======================= GAME START =======================
    /*
    socket.on('shuffle deck and distribute', () => {
        room, all users

        socket.to(user[i]).emit('', {
            hand, 
            otherCardCounts,
        })
    })


    socket.on('draw top card, () => {
        asker, room
         takes ServerRooms[room]
    })

    */

    // ======================= GAMEPLAY =======================

    // SERVER RESPONSES
    
    socket.on('request rank from player', requestObj => {
        const asker = requestObj.user_id;
        const requested = requestObj.requestedId;
        const rankReq = requestObj.rankReq;

        console.log(`does ${requested} have a ${rankReq}? Asking now...`)

        socket.broadcast.to(requested).emit('rank request from player', {
            asker, requested, rankReq
        });
    });

   
    socket.on('rank request denial',  (requestObj) => {
        const { asker, requested, rankReq, CARD } = requestObj;

        // console.log(requestObj);
        // EMIT =========
        // draw top card in deck?
        socket.broadcast.to(asker).emit('go fish', requestObj);
    })
    
    socket.on('rank request accept', (gameObj) => {
        const {requested, asker, rankReq, CARD} = gameObj;

        // EMIT =========
        socket.broadcast.to(asker).emit('correct rank return', gameObj)
    })

    // ======================= GAMEPLAY END =======================
    // ======================= GAME END =======================





    
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