const getContext  = require('./context');
const handlebars  = require('./handlebars');
const markdown    = require('./markdown');
const startServer = require('./server');

module.exports = {
  getContext,
  hbs: handlebars,
  markdown,
  startServer,
};
