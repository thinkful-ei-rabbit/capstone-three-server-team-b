const config = require('./config');
const knex = require('knex');
const app = require('./app');
const server = require('http').createServer(app);
const io = require('socket.io')(server,  {
  origins: [config.CLIENT_ORIGIN],
  cors: true,
});

const db = knex({
  client: 'pg',
  connection: config.DATABASE_URL,
});

app.set('db', db);

io.sockets.on('connection', (socket) => {
  // THIS WILL BE IMPORTED FROM SOMEWHERE ELSE
  console.log('a user connected!');

  socket.on('chatMessage', (message) => {
    io.emit('messageResponse', message);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected!');
  });
}); 



server.listen(config.PORT, () => {
  console.log(`listening on ${config.PORT}`);
});