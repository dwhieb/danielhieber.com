/**
 * CSURF middleware, which uses CSRF tokens to prevent malicious form attacks
 */

const csurf = require('csurf');

module.exports = csurf({
  cookie: true,
  ignoreMethods: [
    'GET',
    'HEAD',
    'OPTIONS',
    'POST',
  ],
});
