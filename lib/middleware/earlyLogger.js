/* eslint-disable
  no-console
*/

const { earlyLogging } = require('../config');

module.exports = (req, res, next) => {

  if (earlyLogging === `true`) console.log(`Early URL: ${req.originalUrl}`);
  next();

};
