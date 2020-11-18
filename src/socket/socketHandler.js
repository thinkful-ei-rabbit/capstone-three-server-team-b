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

        const currentUser = {
            playerName: socket.playerName,
            player_id: userObj.user_id,
            roomNumber: userObj.room,
            socket_id: socket.id, // to communicate via socket
            avatarLink: userObj.avatarLink,
        };


        if (ServerRooms.rooms[userObj.room] === undefined) {
            ServerRooms.addRoom(userObj.room);
            ServerRooms.adjustRoomCapacity(userObj.room, true);
            ServerRooms.addPlayerToRoom(userObj.room, currentUser)
        } else {
            if (ServerRooms.rooms[userObj.room].capacity === 4) {
                socket.emit('gameFull', 'The game you tried to join is full.');
                return;
            } else {

                ServerRooms.adjustRoomCapacity(userObj.room, true);
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
                    id: el.id,
                    playerName: el.playerName,
                    room: el.roomNumber
                });
            }
        });

        const responseObject = {
            room: `Room ${userObj.room}.`,
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

    socket.on('disconnect', () => {
        if (socket.roomNumber) {
            ServerRooms.removePlayer(socket.id, socket.roomNumber);
            ServerRooms.adjustRoomCapacity(socket.roomNumber, false);
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
        // needs to readjust
        console.log('A user disconnected!');
    });

};

module.exports = socketHandler;