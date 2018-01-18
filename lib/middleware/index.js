const error404 = require('./error404');
const error500 = require('./error500');
const errors   = require('./errors');
const helmet   = require('./helmet');
const logger   = require('./logger');
const vary     = require('./vary');

module.exports = {
  error404,
  error500,
  errors,
  helmet,
  logger,
  vary,
};
