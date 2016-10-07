const socketHandlers = require('../handlers/socket-handlers');
const socketIO = require('socket.io');

const socketOptions = { transports: ['websocket', 'xhr-polling'] };

module.exports = server => {

  // create web socket
  const io = socketIO(server, socketOptions);

  io.on('connect', socket => {

    // make the socket available to the handlers
    const handlers = socketHandlers(socket);

    // runs when client connects
    handlers.connect();

    // socket routing
    socket.on('add', handlers.add);
    socket.on('delete', handlers.delete);
    socket.on('get', handlers.get);
    socket.on('getAll', handlers.getAll);
    socket.on('update', handlers.update);

    // generic error handler
    socket.on('error', handlers.handleError);

  });

};
