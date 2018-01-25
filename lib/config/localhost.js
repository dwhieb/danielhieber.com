const crypto = require('crypto');

const DOMAIN     = process.env.DOMAIN || `localhost`;
const LOG_ERRORS = process.env.LOG_ERRORS || `server`;
const LOG_INFO   = process.env.LOG_INFO || `true`;
const PORT       = process.env.PORT || 3000;

const secretLength = 20;
const cookieSecret = crypto.randomBytes(secretLength).toString(`hex`);

const BASE_URL      = process.env.BASE_URL || `http://${DOMAIN}:${PORT}`;
const COOKIE_SECRET = process.env.SECRET || cookieSecret;

module.exports = {
  BASE_URL,
  COOKIE_SECRET,
  DOMAIN,
  LOG_ERRORS,
  LOG_INFO,
  PORT,
};
