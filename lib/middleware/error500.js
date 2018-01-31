const Boom   = require('boom');
const config = require('../config');
const { defaultClient: insights } = require('applicationinsights');

module.exports = (err, req, res, next) => { // eslint-disable-line no-unused-vars

  let e = err;

  // convert uncaught errors to Boom errors
  if (!Boom.isBoom(e)) e = new Boom(err);

  const { headers, payload } = e.output;

  // log errors to console
  if (
    config.logErrors === `client` // if set to log both client & server errors
    || (config.logErrors === `server` && e.isServer) // if set to log server errors only
  ) {
    console.error(e);
  }

  // send server errors to Application Insights
  if (e.isServer) {
    insights.trackException({
      exception:  e,
      properties: {
        data: e.data,
        exceptionType: `RouteException`,
        headers,
      },
    });
  }

  // render error page
  res.status(payload.statusCode);

  res.render(`error`, {
    error:     payload.error || `Unknown Error`,
    message:   `${payload.message} Please consider <a href=https://github.com/dwhieb/danielhieber.com/issues>opening an issue on GitHub</a>. Use Error ID <code>${req.id}</code> when reporting the error.`,
    pageTitle: `Error`,
    statusCode: payload.statusCode || 500,
  });

};
