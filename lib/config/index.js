/* eslint-disable
  global-require
*/

const env = process.env.NODE_ENV || `localhost`;

if (env === `localhost`) require(`./localhost`);

module.exports = {
  env:       process.env.NODE_ENV,
  logErrors: process.env.LOG_ERRORS,
  logInfo:   process.env.LOG_INFO === `true`,
  port:      process.env.PORT,
};
