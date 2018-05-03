/**
 * Logging middleware which shows information about the request *before* hitting other middleware.
 * Otherwise, request information for static assets will not be logged. This should come first in the middleware waterfall.
 */

const { logEarly } = require('../../config');

module.exports = (req, res, next) => {
  if (logEarly === `true`) console.log(`(Early) ${new Date()}: ${req.method} ${req.originalUrl}`);
  next();
};
