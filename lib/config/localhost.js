require('../../../credentials/danielhieber.js');

const {
  COOKIE_SECRET,
  DOCUMENTDB_URL,
  DOMAIN = `localhost`,
  LOG_ERRORS = `server`,
  LOG_INFO = `true`,
  PORT = 3000,
} = process.env;

const BASE_URL = process.env.BASE_URL || `http://${DOMAIN}:${PORT}`;
const CDN      = BASE_URL;

module.exports = {
  BASE_URL,
  CDN,
  COOKIE_SECRET,
  DOCUMENTDB_URL,
  DOMAIN,
  LOG_ERRORS,
  LOG_INFO,
  PORT,
};
