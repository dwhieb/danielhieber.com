module.exports = io => {
  io.on('connection', socket => {

    socket.emit('news', { hello: 'world' });

  });
};
