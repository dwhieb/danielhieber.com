const appInsights = require('./appInsights');
const db          = require('./database');
const mendeley    = require('./mendeley');
const storage     = require('./storage');

module.exports = {
  appInsights,
  db,
  mendeley,
  storage,
};
