const Boom   = require('boom');
const config = require('../config');

module.exports = (err, req, res, next) => { // eslint-disable-line no-unused-vars

  let e = err;

  // convert uncaught errors to Boom errors
  if (!Boom.isBoom(e)) e = new Boom(err);

  // send error response
  const { payload } = e.output;
  res.status(payload.statusCode);
  res.send(payload.message);

  // log errors
  if (
    config.logErrors === `client`
    || (config.logErrors === `server` && e.isServer)
  ) {
    console.error(e);
  }

};
