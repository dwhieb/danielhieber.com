// load config file before other modules
const config  = require('./lib/config');

// modules
const { error404 } = require('./lib/middleware');
const { error500 } = require('./lib/middleware');
const express      = require('express');
const hbs          = require('./lib/handlebars');
const helmet       = require('./lib/helmet');
const meta         = require('./package.json');
const path         = require('path');
const route        = require('./lib/router');
const startServer  = require('./lib/server');

// initialize Express
const app = express();

// app settings
app.enable(`trust proxy`);           // trust the Azure proxy server
app.engine(hbs.extname, hbs.engine); // declare Handlebars engine
app.set(`port`, config.port);        // set port
app.set(`view engine`, hbs.extname); // use Handlebars for templating
app.locals.meta = meta;              // make package.json data available to app

// middleware
app.use(helmet);                                          // security settings
app.use(express.static(path.join(__dirname, '/public'))); // routing for static files

// add routes
route(app);

// generic error handling
app.use(error404);
app.use(error500);

// start the server
startServer(app);
