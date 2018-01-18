const DOMAIN     = process.env.DOMAIN || `danielhieber-dev.azurewebsites.net`;
const LOG_ERRORS = process.env.LOG_ERRORS || `server`;
const LOG_INFO   = process.env.LOG_INFO || `true`;

const BASE_URL = process.env.BASE_URL || `https://${DOMAIN}`;

// Do not export PORT
module.exports = {
  BASE_URL,
  DOMAIN,
  LOG_ERRORS,
  LOG_INFO,
};
