/* eslint-disable
  global-require
*/

const env = process.env.NODE_ENV
  || (process.argv[2] ? process.argv[2].split(`=`)[1] : ``)
  || `production`;

const settings = require(`./${env}`);

Object.assign(process.env, settings);

module.exports = {
  baseURL:      process.env.BASE_URL,
  cookieSecret: process.env.COOKIE_SECRET,
  dbKey:        process.env.DOCUMENTDB_KEY,
  dbURL:        process.env.DOCUMENTDB_URL,
  development:  process.env.NODE_ENV === `development`,
  domain:       process.env.DOMAIN,
  env:          process.env.NODE_ENV,
  localhost:    process.env.NODE_ENV === `localhost`,
  logErrors:    process.env.LOG_ERRORS,
  logInfo:      process.env.LOG_INFO === `true`,
  port:         process.env.PORT,
  production:   process.env.NODE_ENV === `production`,
};
