/**
 * Injects various variables, CSS, and JS into app.locals, for use in templates and other areas of the app.
 */

const { icons: feather } = require('feather-icons');
const fs                 = require('fs');
const meta               = require('../../package.json');
const { promisify }      = require('util');

const readDir  = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

const {
  baseURL,
  cdn,
  development,
  localhost,
  production,
} = require('../../config');

module.exports = async () => {

  // JS for Application Insights
  const appInsights = await readFile(`public/js/app-insights.js`, `utf8`);

  // Critical CSS
  const css = await readFile(`public/css/main.css`, `utf8`);

  // JS for gallery
  const gallery = await readFile(`public/js/gallery.js`, `utf8`);

  // Boolen for displaying site header in views
  const header = true;

  // Feather icons
  const icons = {
    delete: feather[`trash-2`].toSvg(),
  };

  const ipaName = `ˈdæn.jəl ˈhi.bɚ`;

  // JS for list of gallery images
  const text   = await readDir(`public/img/gallery`, `utf8`);
  const images = `const images = ${JSON.stringify(text)};`;

  // SVG icons
  const svg = await readFile(`public/img/sprites.svg`, `utf8`);

  // JS for registering offline worker
  const worker = await readFile(`public/js/register-worker.js`, `utf8`);

  return {
    appInsights,
    baseURL,
    cdn,
    css,
    development,
    gallery,
    header,
    icons,
    images,
    ipaName,
    localhost,
    meta,
    production,
    svg,
    worker,
  };

};
