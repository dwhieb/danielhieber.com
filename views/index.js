/**
 * This file contains all the route handlers for the views
 * @name views/index.js
 */

const admin    = require('./admin');
const editor   = require('./editor');
const home     = require('./home');
const personal = require('./personal');

module.exports = {
  admin,
  editor,
  home,
  personal,
};
