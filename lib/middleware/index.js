const auth        = require('./auth');
const bodyParser  = require('./bodyParser');
const csurf       = require('./csurf');
const error404    = require('./error404');
const error500    = require('./error500');
const errors      = require('./errors');
const helmet      = require('./helmet');
const logger      = require('./logger');
const routeStatic = require('./static');
const vary        = require('./vary');

module.exports = {
  auth,
  bodyParser,
  csurf,
  error404,
  error500,
  errors,
  helmet,
  logger,
  routeStatic,
  vary,
};
