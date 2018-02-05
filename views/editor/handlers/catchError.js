const db = require('../../../lib/modules/database');

module.exports = (req, res, next) => err => {
  if (err instanceof Error) return next(err);
  const { headers, message, statusCode } = db.convertError(err);
  res.error(message, { statusCode }, headers);
};
