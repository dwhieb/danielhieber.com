const { database: db } = require('../../../lib/modules');

module.exports = (req, res, next) => err => {
  if (err instanceof Error) return next(err);
  const { headers, message, statusCode } = db.convertError(err);
  res.error(message, { statusCode }, headers);
};
