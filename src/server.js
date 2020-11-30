const config = require('./config');
const socketHandler = require('./socket/socketHandler.js');
const knex = require('knex');
const app = require('./app');
const server = require('http').createServer(app);
const io = require('socket.io')(server,  {
  origins: [config.CLIENT_ORIGIN],
  cors: true,
  path: '/myownpath',
});


const db = knex({
  client: 'pg',
  connection: config.DATABASE_URL,
});

app.set('db', db);

io.sockets.on('connection', (socket) => {
  // get user by parsing user token ?
  socketHandler(socket, io); 
  console.log('connected to socket');
});



server.listen(config.PORT, () => {
  console.log(`listening on ${config.PORT}`);
});

module.exports = io;