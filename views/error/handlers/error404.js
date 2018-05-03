/**
 * Route handler for 404 errors
 */

/* eslint-disable
  no-console
*/

const config = require('../../../config');

module.exports = (req, res, next) => { // eslint-disable-line no-unused-vars

  if (config.logErrors !== `none`) console.warn(`404: Could not find ${req.originalUrl}`);

  res.status(404);

  res.render(`error`, {
    error:     `Not Found`,
    id:        `error`,
    message:   `The page <code>${req.originalUrl}</code> could not be found.`,
    pageTitle: `Error`,
    statusCode: 404,
  });

};
