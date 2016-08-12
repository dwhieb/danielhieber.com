const AppInsights = require('applicationinsights');
const nav = require('../public/data/nav.json');

const appInsights = AppInsights.getClient();

module.exports = function middleware(req, res, next) {

  // log URL for debugging
  console.log(`Requested URL: ${req.originalUrl}`);

  // track request using Azure application insights
  appInsights.trackRequest(req, res);

  /* eslint-disable no-param-reassign */

  // inject data for nav menu in templates
  res.locals.nav = nav;

  // inject project metadata into locals for templating
  res.locals.meta = req.app.locals.meta;
  res.locals.meta.keywordsString = res.locals.meta.keywords.join(', ');

  /* eslint-enable no-param-reassign */

  next();

};
