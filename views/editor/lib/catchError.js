/**
 * Route-specific middleware which catches database errors and converts them before passing them on to the generic error route
 */

const { db } = require('../../../services');

module.exports = (req, res, next) => err => {
  if (err instanceof Error) return next(err);
  const { headers, message, statusCode } = db.convertError(err);
  res.error(message, { statusCode }, headers);
};
