/* eslint-disable
  no-console
*/

const { logEarly } = require('../config');

module.exports = (req, res, next) => {

  if (logEarly === `true`) console.log(`Early URL: ${req.originalUrl}`);
  next();

};
