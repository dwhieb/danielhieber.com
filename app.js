// load config file before other modules
const config  = require('./lib/config');

// modules
const express     = require('express');
const hbs         = require('./lib/handlebars');
const helmet      = require('./lib/helmet');
const meta        = require('./package.json');
const route       = require('./lib/router');
const startServer = require('./lib/server');

// initialize Express
const app = express();

// app settings
app.enable(`trust proxy`);           // trust the Azure proxy server
app.engine(hbs.extname, hbs.engine); // declare Handlebars engine
app.set(`port`, config.port);        // set port
app.set(`view engine`, hbs.extname); // use Handlebars for templating
app.locals.meta = meta;              // makes package.json data available to app and middleware

// middleware
app.use(helmet);

// add routes
route(app);

// start the server
startServer(app);
