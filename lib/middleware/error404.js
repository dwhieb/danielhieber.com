/* eslint-disable
  no-console
*/

const config = require('../config');

module.exports = (req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(404);
  res.send(`404: Not Found`);
  if (config.logErrors !== `none`) console.warn(`404: Could not find ${req.originalUrl}`);
};
