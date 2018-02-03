const {
  DOMAIN = `danielhieber.com`,
  LOG_ERRORS = `none`,
  LOG_INFO = `none`,
} = process.env;

const BASE_URL = process.env.BASE_URL || `https://${DOMAIN}`;

// Do not export PORT
module.exports = {
  BASE_URL,
  DOMAIN,
  LOG_ERRORS,
  LOG_INFO,
};
