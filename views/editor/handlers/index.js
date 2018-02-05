/**
 * The route handler for the Editor page
 * @name editor/index.js
 */

const get  = require('./get');
const post = require('./post');

const methods = {
  get,
  post,
};

module.exports = (req, res, next) => methods[req.method.toLowerCase()](req, res, next);
