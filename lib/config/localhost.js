require('../../../credentials/danielhieber.js');

const {
  COOKIE_SECRET,
  DOMAIN = `localhost`,
  LOG_ERRORS = `server`,
  LOG_INFO = `true`,
  PORT = 3000,
} = process.env;

const BASE_URL = process.env.BASE_URL || `http://${DOMAIN}:${PORT}`;

module.exports = {
  BASE_URL,
  COOKIE_SECRET,
  DOMAIN,
  LOG_ERRORS,
  LOG_INFO,
  PORT,
};
