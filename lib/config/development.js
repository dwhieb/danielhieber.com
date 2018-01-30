const {
  DOMAIN = `danielhieber-dev.azurewebsites.net`,
  LOG_ERRORS = `server`,
  LOG_INFO = `true`,
} = process.env;

const BASE_URL = process.env.BASE_URL || `https://${DOMAIN}`;

// Do not export PORT
module.exports = {
  BASE_URL,
  DOMAIN,
  LOG_ERRORS,
  LOG_INFO,
};
