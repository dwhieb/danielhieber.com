/**
 * The entry point for the app, containing mostly configuration setup.
 * @name app.js
 */

// load config file before other modules
const config = require('./lib/config');

// modules
const express     = require('express');
const hbs         = require('./lib/modules/handlebars');
const middleware  = require('./lib/middleware');
const inject      = require('./lib/modules/inject');
const path        = require('path');
const route       = require('./lib/router');
const startServer = require('./lib/modules/server');

const {
  cookieParser,
  csurf,
  error404,
  error500,
  errors,
  helmet,
  logger,
  vary,
  worker,
} = middleware;

// initialize Express
const app         = express();
const routeStatic = express.static(path.join(__dirname, '/public'));

// app settings
app.enable(`trust proxy`);           // trust the Azure proxy server
app.engine(hbs.extname, hbs.engine); // declare Handlebars engine
app.set(`port`, config.port);        // set port
app.set(`view engine`, hbs.extname); // use Handlebars for templating

// middleware
app.use(helmet);       // security settings
app.use(cookieParser); // parse cookies
app.use(csurf);        // protect from CSRF attacks
app.use(logger);       // request logging
app.use(vary);         // set the Vary header
app.use(worker);       // set the Service-Worker-Allowed header
app.use(routeStatic);  // routing for static files
app.use(errors);       // returns consistent errors

// add routes
route(app);

// generic error handling
app.use(error404);
app.use(error500);

(async () => {
  await inject(app); // inject critical CSS, JS, and SVG icons
  startServer(app);  // start the server
})();
