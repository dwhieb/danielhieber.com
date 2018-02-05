/**
 * The entry point for the app, containing mostly configuration setup.
 * @name app.js
 */

const config = require('./lib/config'); // load config file before other modules
require('./lib/modules/appInsights');   // start Azure Application Insights

// modules
const cookieParser = require('cookie-parser');
const express      = require('express');
const hbs          = require('./lib/modules/handlebars');
const middleware   = require('./lib/middleware');
const inject       = require('./lib/modules/inject');
const route        = require('./lib/router');
const startServer  = require('./lib/modules/server');

const {
  bodyParser,
  csurf,
  error404,
  error500,
  errors,
  helmet,
  logger,
  routeStatic,
  vary,
} = middleware;

// initialize Express
const app = express();

// app settings
app.enable(`trust proxy`);           // trust the Azure proxy server
app.engine(hbs.extname, hbs.engine); // declare Handlebars engine
app.set(`port`, config.port);        // set port
app.set(`view engine`, hbs.extname); // use Handlebars for templating

// middleware
app.use(helmet);         // security settings
app.use(bodyParser);     // parse form data
app.use(cookieParser()); // parse cookies
app.use(csurf);          // enable CSRF tokens
app.use(vary);           // set the Vary header
app.use(routeStatic);    // routing for static files
app.use(errors);         // returns consistent errors
app.use(logger);         // request logging

// add routes
route(app);

// generic error handling
app.use(error404);
app.use(error500);

(async () => {
  await inject(app); // inject critical CSS, JS, and SVG icons
  startServer(app);  // start the server
})();
