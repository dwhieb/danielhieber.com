/**
 * This file contains all the route handlers for the page views
 */

const admin          = require(`./admin`);
const bibliography   = require(`./bibliography`);
const bibliographies = require(`./bibliographies`);
const cv             = require(`./cv`);
const error          = require(`./error`);
const home           = require(`./home`);
const personal       = require(`./personal`);
const research       = require(`./research`);
const teaching       = require(`./teaching`);

module.exports = {
  admin,
  bibliographies,
  bibliography,
  cv,
  error,
  home,
  personal,
  research,
  teaching,
};
