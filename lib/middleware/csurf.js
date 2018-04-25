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
