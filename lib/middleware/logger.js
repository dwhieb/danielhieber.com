/**
 * Middleware that logs basic information about each request
 * @name logger.js
 */

/* eslint-disable
  no-console
*/

const config   = require('../config');
const insights = require('applicationinsights').defaultClient;
const uuid     = require('uuid/v4');

module.exports = (request, response, next) => {

  if (config.logInfo) console.info(`${new Date()}: ${request.method} ${request.originalUrl}`);

  request.id = uuid();

  if (config.production) {

    insights.trackNodeHttpRequest({
      properties: {
        requestID: request.id,
      },
      request,
      response,
    });

  }

  next();

};
