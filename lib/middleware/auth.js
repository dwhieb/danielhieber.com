const { localhost, microsoftID } = require('../config');

module.exports = (req, res, next) => {
  if (localhost) return next();
  if (req.headers[`x-ms-client-principal-id`] === microsoftID) return next();
  res.redirect(`/.auth/login/microsoftaccount`);
};
