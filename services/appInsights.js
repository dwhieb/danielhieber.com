/**
 * Configuration and initialization for Application Insights.
 * Also serves as a centralized error-handler for the app (using `.handleError()`)
 */

const Boom     = require('boom');
const config   = require('../config');
const insights = require('applicationinsights');

const handleError = err => {

  // Convert to Boom error
  const e = Boom.isBoom(err) ? err : new Boom(err);

  // Log errors to console as appropriate
  if (
    config.logErrors === `client` // if set to log both client & server errors
    || (config.logErrors === `server` && e.isServer) // if set to log server errors only
  ) {
    console.error(e);
  }

  // Send server errors to Application Insights
  if (e.isServer && config.production) {
    insights.defaultClient.trackException({
      exception: e,
      properties: {
        data:    e.data,
        headers: e.headers,
      },
    });
  }

  // Return Boom error
  return e;

};

const start = () => {

  insights
  .setup()
  .start();

  process.on(`uncaughtException`, handleError);

};

module.exports = {
  handleError,
  start,
};
