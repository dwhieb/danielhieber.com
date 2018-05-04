/**
 * Config for production server
 */

const {
  DOMAIN = `danielhieber.com`,
  LOG_EARLY = `false`,
  LOG_ERRORS = `none`,
  LOG_INFO = `none`,
} = process.env;

const BASE_URL = process.env.BASE_URL || `https://${DOMAIN}`;
const CDN      = `https://cdn.danielhieber.com`;

// Do not export PORT
module.exports = {
  BASE_URL,
  CDN,
  DOMAIN,
  LOG_EARLY,
  LOG_ERRORS,
  LOG_INFO,
};
