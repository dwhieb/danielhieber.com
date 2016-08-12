const config = require('./lib/config');
const appInsights = require('applicationinsights');
const express = require('express');
const Handlebars = require('express-handlebars');
const helmet = require('helmet');
const http = require('http');
const IO = require('socket.io');
const meta = require('./package.json');
const path = require('path');
const middleware = require('./lib/middleware');
const router = require('./lib/router');
const socket = require('./lib/socket');

// initialize Express & Handlebars
const app = express();
const handlebars = Handlebars.create(config.hbsOptions);

// Azure application insights
appInsights.setup().start();

// app settings
app.enable('trust proxy'); // trust the Azure proxy server
app.engine('.hbs', handlebars.engine); // declare Handlebars engine
app.set('port', config.port); // set port for the app (3000 on localhost)
app.set('view engine', '.hbs'); // use Handlebars for templating
app.locals.meta = meta; // makes package.json data available for templating

// middleware
app.use(helmet()); // basic security features
app.use(express.static(path.join(__dirname, '/public'))); // routing for static files
app.use(middleware); // custom middleware (logs URL, injects variables, etc.)

// URL routing
router(app);

// create server
const server = http.createServer(app);

// start server listening
server.listen(config.port, () => {
  console.log(`Server started. Press Ctrl+C to terminate.
  Project:  danielhieber.com
  Port:     ${config.port}
  Time:     ${new Date}
  Node:     ${process.version}
  Env:      ${config.env}`);
});

// create web socket
const io = IO(server, config.socketOpts); // eslint-disable-line new-cap

// socket routing
socket(io);

// export app for route testing
module.exports = app;
