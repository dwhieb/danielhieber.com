const appInsights = require('./appInsights');
const database    = require('./database');
const storage     = require('./storage');

module.exports = {
  appInsights,
  db: database,
  storage,
};
