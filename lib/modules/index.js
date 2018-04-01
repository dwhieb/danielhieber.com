const appInsights = require('./appInsights');
const database    = require('./database');
const handlebars  = require('./handlebars');
const inject      = require('./inject');
const server      = require('./server');
const storage     = require('./storage');

module.exports = {
  appInsights,
  database,
  handlebars,
  inject,
  server,
  storage,
};
