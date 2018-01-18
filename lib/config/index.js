/* eslint-disable
  global-require
*/

const development = require('./development');
const localhost   = require('./localhost');
const production  = require('./production');

const env = process.env.NODE_ENV || `localhost`;

const envs = {
  development,
  localhost,
  production,
};

Object.assign(process.env, envs[env]);

module.exports = {
  baseURL:   process.env.BASE_URL,
  domain:    process.env.DOMAIN,
  env:       process.env.NODE_ENV,
  logErrors: process.env.LOG_ERRORS,
  logInfo:   process.env.LOG_INFO === `true`,
  port:      process.env.PORT,
};
