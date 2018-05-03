/**
 * Body parser middleware
 */

const bodyParser = require('body-parser').urlencoded;

module.exports = bodyParser({ extended: false });
