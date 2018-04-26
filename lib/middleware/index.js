const auth        = require('./auth');
const bodyParser  = require('./bodyParser');
const csurf       = require('./csurf');
const earlyLogger = require('./earlyLogger');
const errors      = require('./errors');
const helmet      = require('./helmet');
const logger      = require('./logger');
const multipart   = require('./multipart');
const routeStatic = require('./static');
const vary        = require('./vary');

module.exports = {
  auth,
  bodyParser,
  csurf,
  earlyLogger,
  errors,
  helmet,
  logger,
  multipart,
  routeStatic,
  vary,
};
