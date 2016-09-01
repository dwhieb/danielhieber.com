const AppInsights = require('applicationinsights');
const config = require('./config');
const nav = require('../public/data/nav.json');

if (config.env === 'production') {
  var appInsights = AppInsights.getClient();
}

module.exports = function middleware(req, res, next) {

  // log URL for debugging
  console.log(`Requested URL: ${req.originalUrl}`);

  // track request using Azure application insights
  if (appInsights) appInsights.trackRequest(req, res);

  /* eslint-disable no-param-reassign */

  // inject data for nav menu in templates
  res.locals.nav = nav;

  // unless requesting an admin page, hide the Admin nav button
  const isPublic = !req.originalUrl.toLowerCase().startsWith('/admin');

  if (isPublic) {
    delete res.locals.nav.admin;
  }

  for (const page in res.locals.nav) {
    res.locals.nav[page].selected = false;
  }

  // inject project metadata into locals for templating
  res.locals.meta = req.app.locals.meta;
  res.locals.meta.keywordsString = res.locals.meta.keywords.join(', ');

  // displays the header by default
  res.locals.header = true;

  // enable debugging, if set to true
  res.locals.debug = config.debug;

  /* eslint-enable no-param-reassign */

  next();

};
