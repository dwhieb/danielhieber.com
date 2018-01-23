/**
 * Injects various variables, CSS, and JS into app.locals, for use in templates and other areas of the app.
 * @name inject.js
 */

/* eslint-disable
  no-param-reassign
*/

const config        = require('../config');
const fs            = require('fs');
const meta          = require('../../package.json');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);

module.exports = async app => {
  app.locals.baseURL    = config.baseURL;                            // baseURL
  app.locals.localhost  = config.localhost;                          // localhost env
  app.locals.header     = true;                                      // header option
  app.locals.meta       = meta;                                      // metadata
  app.locals.production = config.production;                         // production env
  app.locals.css = await readFile(`./public/css/main.css`, `utf8`);  // CSS
  app.locals.js  = await readFile(`./public/js/gallery.js`, `utf8`); // JS
};
