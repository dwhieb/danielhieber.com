const {
  DOMAIN = `dev.danielhieber.com`,
  LOG_ERRORS = `server`,
  LOG_INFO = `true`,
} = process.env;

const BASE_URL = process.env.BASE_URL || `https://${DOMAIN}`;
const CDN      = BASE_URL;

// Do not export PORT
module.exports = {
  BASE_URL,
  CDN,
  DOMAIN,
  LOG_ERRORS,
  LOG_INFO,
};
