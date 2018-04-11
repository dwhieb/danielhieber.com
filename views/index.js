/**
 * This file contains all the route handlers for the views
 * @name views/index.js
 */

const admin    = require('./admin/handlers');
const cv       = require('./cv/handlers');
const editor   = require('./editor/handlers');
const home     = require('./home/handlers');
const personal = require('./personal/handlers');

module.exports = {
  admin,
  cv,
  editor,
  home,
  personal,
};
