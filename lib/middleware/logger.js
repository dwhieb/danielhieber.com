/* eslint-disable
  no-console
*/

const config = require('../config');

module.exports = (req, res, next) => {
  if (config.logInfo) console.info(`${new Date()}: ${req.method} ${req.originalUrl}`);
  next();
};