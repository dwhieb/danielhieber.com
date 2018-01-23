const DOMAIN     = process.env.DOMAIN || `cdn.danielhieber.com`;
const LOG_ERRORS = process.env.LOG_ERRORS || `none`;
const LOG_INFO   = process.env.LOG_INFO || `none`;

const BASE_URL = process.env.BASE_URL || `https://${DOMAIN}`;

// Do not export PORT
module.exports = {
  BASE_URL,
  DOMAIN,
  LOG_ERRORS,
  LOG_INFO,
};
