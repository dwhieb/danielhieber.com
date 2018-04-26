/**
 * The route handler for the Editor page
 * @name editor/index.js
 */

const get      = require('./get');
const post     = require('./post');
const postFile = require('./postFile');
const put      = require('./put');

module.exports = {
  get,
  post,
  postFile,
  put,
};
