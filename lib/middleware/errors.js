/**
 * Adds a res.error method to the response, allowing you to generate Boom error responses. May also use more specific methods on res.error, such as res.error.badGateway, etc.
 *
 * Boom documentation: https://www.npmjs.com/package/boom
 */

const Boom = require('boom');

const methods = Object
.getOwnPropertyNames(Boom)
.filter(prop => typeof Boom[prop] === `function`);

module.exports = (req, res, next) => {

  // generic error method
  // e.g. res.error('Something blew up.', { statusCode: 5xx });
  res.error = (message, opts) => {
    const err = new Boom(message, opts);
    next(err);
  };

  // code-specific error methods
  // e.g. res.error.badRequest('Must be a String.', { /* optional data */ })
  methods.forEach(method => {
    res.error[method] = (...args) => {
      const err = Boom[method](...args);
      next(err);
    };
  });

  next();

};
