// load config file before other modules
const config  = require('./lib/config');

// modules
const express      = require('express');
const hbs          = require('./lib/modules/handlebars');
const meta         = require('./package.json');
const middleware   = require('./lib/middleware');
const inject       = require('./lib/modules/inject');
const path         = require('path');
const route        = require('./lib/router');
const startServer  = require('./lib/modules/server');

const {
  error404,
  error500,
  errors,
  helmet,
  logger,
  vary,
} = middleware;

// initialize Express
const app         = express();
const routeStatic = express.static(path.join(__dirname, '/public'));

// app settings
app.enable(`trust proxy`);                 // trust the Azure proxy server
app.engine(hbs.extname, hbs.engine);       // declare Handlebars engine
app.set(`port`, config.port);              // set port
app.set(`view engine`, hbs.extname);       // use Handlebars for templating
app.locals.baseURL = config.baseURL;       // make baseURL available to app
app.locals.localhost = config.localhost;   // makes env available to app
app.locals.header = true;                  // show page header by default
app.locals.meta = meta;                    // make package.json data available to app
app.locals.production = config.production; // makes env available to app

// middleware
app.use(helmet);      // security settings
app.use(vary);        // set the Vary header
app.use(logger);      // request logging
app.use(routeStatic); // routing for static files
app.use(errors);      // returns consistent errors

// add routes
route(app);

// generic error handling
app.use(error404);
app.use(error500);

(async () => {
  await inject(app); // inject critical CSS, JS, and SVG icons
  startServer(app);  // start the server
})();
