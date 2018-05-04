/**
 * Set environment-specific config
 */

const env = process.env.NODE_ENV || `localhost`;

const settings = require(`./${env}`);

Object.assign(process.env, settings);

module.exports = {
  baseURL:      process.env.BASE_URL,
  cdn:          process.env.CDN,
  cookieSecret: process.env.COOKIE_SECRET,
  dbKey:        process.env.DOCUMENTDB_KEY,
  dbURL:        process.env.DOCUMENTDB_URL,
  development:  process.env.NODE_ENV === `development`,
  domain:       process.env.DOMAIN,
  env:          process.env.NODE_ENV,
  localhost:    process.env.NODE_ENV === `localhost`,
  logEarly:     process.env.LOG_EARLY,
  logErrors:    process.env.LOG_ERRORS,
  logInfo:      process.env.LOG_INFO === `true`,
  microsoftID:  process.env.MICROSOFT_ID,
  port:         process.env.PORT,
  production:   process.env.NODE_ENV === `production`,
  storageURL:   process.env.STORAGE_URL,
};
