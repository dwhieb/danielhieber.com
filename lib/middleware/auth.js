// Authenticate a route by forcing login with Microsoft

/* eslint-disable
  camelcase,
*/

const { stringify } = require('querystring');
const { localhost, microsoftID } = require('../config');

module.exports = (req, res, next) => {
  if (localhost || req.method === `POST`) return next();
  if (req.headers[`x-ms-client-principal-id`] === microsoftID) return next();
  const queryString = stringify({ post_login_redirect_url: `/admin` });
  res.redirect(`/.auth/login/microsoftaccount?${queryString}`);
};
