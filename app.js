// load config file before other modules
const config  = require('./lib/config');

// modules
const express     = require('express');
const meta        = require('./package.json');
const startServer = require('./lib/server');

// initialize Express
const app = express();

// app settings
app.enable(`trust proxy`);    // trust the Azure proxy server
app.locals.meta = meta;       // makes package.json data available to app and middleware
app.set(`port`, config.port); // set port

startServer(app);
