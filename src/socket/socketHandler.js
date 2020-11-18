const { Server } = require('socket.io');
const ServerRooms = require('./serverRooms');

const socketHandler = (socket, io) => {

    // console.log('a user connected!');

    /* ================ USER JOIN SERVER START ==============*/
    socket.on('joinServer', (userObj) => {
        // user entered nickname, while the client
        // endpoints are behind a private route?
        socket.nickname = userObj.username;
        socket.roomNumber = userObj.room;

        const currentUser = {
            nickname: userObj.username,
            roomNumber: userObj.room,
            id: socket.id,
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


        socket.join(userObj.room);

        const users = io.in(userObj.room).sockets.sockets;

        const playersInRoom = [];
        users.forEach((el) => {
            if (el.roomNumber === userObj.room) {
                playersInRoom.push({
                    id: el.id,
                    nickname: el.nickname,
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