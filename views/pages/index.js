/**
 * This file contains all the route handlers for the page views
 */

const admin                = require(`./admin`);
const bibliography         = require(`./bibliography`);
const bibliographies       = require(`./bibliographies`);
const bibliographiesEditor = require(`./admin-bibliographies`);
const cv                   = require(`./cv`);
const cvEditor             = require(`./admin-cv`);
const error                = require(`./error`);
const home                 = require(`./home`);
const personal             = require(`./personal`);
const research             = require(`./research`);
const teaching             = require(`./teaching`);

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
  teaching,
};
