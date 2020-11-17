const { Server } = require('socket.io');
const ServerRooms = require('./serverRooms');

const socketHandler = (socket, io) => {
    
    // console.log('a user connected!');
  
    /* ================ USER JOIN SERVER START ==============*/
    socket.on('joinServer', (userObj) => {
        socket.nickname = userObj.username;
        socket.roomNumber = userObj.room;

        socket.join(userObj.room);

        if (ServerRooms.rooms[userObj.room] === undefined) {
            ServerRooms.addRoom(userObj.room);
            ServerRooms.adjustLength(userObj.room, true);
        } else {
            ServerRooms.adjustLength(userObj.room, true);
        }

        const users = io.in(userObj.room).sockets.sockets;
        // console.log(io.sockets.adapter.rooms);
        // const clients = io.in(userObj.room);
        // console.log(io.sockets.clients[userObj.room]);

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
        };

        // socket.emit('serverResponse', responseObject);
        // single emit

        // vs room emit
        io.to(userObj.room).emit('serverResponse', responseObject);
    });
  
    socket.on('serverMessage', (userObj) => {
      // userObj needs username and value in the future
      io.to(userObj.room).emit('messageResponse', userObj.value);
    });

    socket.on('gather list', (message) => {
        socket.emit('list response', ServerRooms.rooms);
    })




  
    socket.on('disconnect', () => {
        // ServerRooms.rooms[socket.roomNumber]
        // needs to readjust
      console.log('A user disconnected!');
    });

};

module.exports = socketHandler;