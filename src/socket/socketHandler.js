const socketHandler = (socket, io) => {
    // console.log('a user connected!');
  
    socket.on('joinServer', (room) => {
        socket.join(room);
        socket.emit('serverResponse', `Room ${room}.`);
    });
  
    socket.on('serverMessage', (userObj) => {
      // userObj needs username and value in the future
      io.to(userObj.room).emit('messageResponse', userObj.value);
    });
  
    socket.on('disconnect', () => {
      console.log('a user disconnected!');
    });

};

module.exports = socketHandler;