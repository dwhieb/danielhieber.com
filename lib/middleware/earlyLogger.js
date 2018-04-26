/* eslint-disable
  no-console
*/

const { logEarly } = require('../config');

module.exports = (req, res, next) => {
  if (logEarly === `true`) console.log(`(Early) ${new Date()}: ${req.method} ${req.originalUrl}`);
  next();
};
