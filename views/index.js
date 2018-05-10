/**
 * This file contains all the route handlers for the views
 */

const admin                = require('./admin/handlers');
const bibliography         = require('./bibliography/handlers');
const bibliographies       = require('./bibliographies/handlers');
const bibliographiesEditor = require('./admin-bibliographies/handlers');
const cv                   = require('./cv/handlers');
const cvEditor             = require('./admin-cv/handlers');
const error                = require('./error/handlers');
const home                 = require('./home/handlers');
const personal             = require('./personal/handlers');
const research             = require('./research/handlers');

module.exports = {
  admin,
  bibliographies,
  bibliographiesEditor,
  bibliography,
  cv,
  cvEditor,
  error,
  home,
  personal,
  research,
};
