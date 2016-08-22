const handlers = require('./socket-handlers');

module.exports = io => {
  io.on('connect', socket => {

    // runs when client connects
    handlers.connect(socket);

    // socket routing
    socket.on('addCategory', handlers.addCategory);
    socket.on('deleteCategory', handlers.deleteCategory);
    socket.on('getCategories', handlers.getCategories);
    socket.on('updateCategory', handlers.updateCategory);

    // generic error handler
    socket.on('error', err => {
      console.error(err);
    });

  });
};
