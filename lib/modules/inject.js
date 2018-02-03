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

const readDir  = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

module.exports = async app => {

  const appInsights = await readFile(`public/js/appInsights.js`, `utf8`);
  const css         = await readFile(`public/css/main.css`, `utf8`);
  const gallery     = await readFile(`public/js/gallery.js`, `utf8`);
  const images      = await readDir(`public/img/gallery`, `utf8`);
  const svg         = await readFile(`public/img/sprites.svg`, `utf8`);
  const worker      = await readFile(`public/js/register-worker.js`, `utf8`);

  const cdn      = `https://cdn.danielhieber.com`;
  const imagesJS = `const images = ${JSON.stringify(images)};`;

  app.locals.appInsights = appInsights;       // JS for Application Insights
  app.locals.baseURL     = config.baseURL;    // baseURL
  app.locals.cdn         = cdn;               // URL for CDN
  app.locals.css         = css;               // critical CSS
  app.locals.gallery     = gallery;           // JS for gallery
  app.locals.localhost   = config.localhost;  // localhost env
  app.locals.header      = true;              // header option
  app.locals.images      = imagesJS;          // list of images in gallery (as JS)
  app.locals.meta        = meta;              // metadata
  app.locals.production  = config.production; // production env
  app.locals.svg         = svg;               // SVG icons
  app.locals.worker      = worker;            // JS for registering offline worker

};
