/**
 * Middleware that logs basic information about each request (except for static files). This should come last in the middleware waterfall.
 */

const { logInfo, production } = require('../../config');
const insights = require('applicationinsights').defaultClient;
const uuid     = require('uuid/v4');

module.exports = (req, res, next) => {

  if (logInfo) console.info(`${new Date()}: ${req.method} ${req.originalUrl}`);

  req.id = uuid();

  if (production) {

    insights.trackNodeHttpRequest({
      properties: {
        requestID: req.id,
      },
      request: req,
      response: res,
    });

  }

  next();

};
