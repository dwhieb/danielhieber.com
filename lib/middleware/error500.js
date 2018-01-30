const Boom   = require('boom');
const config = require('../config');
const { defaultClient: insights } = require('applicationinsights');

module.exports = (err, req, res, next) => { // eslint-disable-line no-unused-vars

  let e = err;

  // convert uncaught errors to Boom errors
  if (!Boom.isBoom(e)) e = new Boom(err);

  // send error response
  const { payload } = e.output;
  res.status(payload.statusCode);
  res.send(payload.message);

  // log errors to console
  if (
    config.logErrors === `client` // if set to log both client & server errors
    || (config.logErrors === `server` && e.isServer) // if set to log server errors only
  ) {
    console.error(e);
  }

  // send all server errors to Application Insights
  insights.trackException({ exception: e });

};
