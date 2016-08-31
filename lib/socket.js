const socketHandlers = require('./socket-handlers');

module.exports = io => {
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
