/**
 * The entry point for the app, containing mostly configuration setup.
 * @name app.js
 */

const config          = require('../config');   // load config file before other modules
const { appInsights } = require('../services'); // start Azure Application Insights

if (config.production) appInsights();

// modules
const cookieParser = require('cookie-parser');
const express      = require('express');
const middleware   = require('./middleware');
const route        = require('./router');
const { error }    = require('../views');

const { getContext, hbs, startServer } = require('./modules');

const {
  bodyParser,
  csurf,
  earlyLogger,
  errors,
  helmet,
  logger,
  multipart,
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
app.use(earlyLogger);    // early logging for debugging
app.use(helmet);         // security settings
app.use(bodyParser);     // parse form data
app.use(multipart);      // parse multipart form data
app.use(cookieParser()); // parse cookies
app.use(csurf);          // enable CSRF tokens
app.use(vary);           // set the Vary header
app.use(routeStatic);    // routing for static files
app.use(errors);         // returns consistent errors
app.use(logger);         // request logging

// add routes
route(app);

// generic error handling
app.use(error.error404);
app.use(error.error500);

void async function start() {

  // inject context for Handlebars templates
  const context = await getContext();
  Object.assign(app.locals, context);

  // start the server
  startServer(app);

}();
