const socketHandlers = require('./socket-handlers');
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
    socket.on('addCategory', handlers.addCategory);
    socket.on('deleteCategory', handlers.deleteCategory);
    socket.on('getCategories', handlers.getCategories);
    socket.on('updateCategory', handlers.updateCategory);

    // generic error handler
    socket.on('error', handlers.handleError);

  });

};
