/**
 * This file contains all the route handlers for the views
 */

const admin    = require('./admin/handlers');
const cv       = require('./cv/handlers');
const editor   = require('./editor/handlers');
const error    = require('./error/handlers');
const home     = require('./home/handlers');
const personal = require('./personal/handlers');
const research = require('./research/handlers');

module.exports = {
  admin,
  cv,
  editor,
  error,
  home,
  personal,
  research,
};
