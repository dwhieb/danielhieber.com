const handlers = require('./socket-handlers');

module.exports = io => {
  io.on('connection', handlers.connect);
};
