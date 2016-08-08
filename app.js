// node modules
const config = require('./lib/config');
const express = require('express');
const Handlebars = require('express-handlebars');
const http = require('http');
const IO = require('socket.io');
const path = require('path');
const middleware = require('./lib/middleware');
const router = require('./lib/router');

// initialize Express & Handlebars
const app = express();
const handlebars = Handlebars.create(config.hbsOptions);

// app settings
app.disable('x-powered-by'); // hide server information in the response
app.enable('trust proxy'); // trust the Azure proxy server
app.engine('.hbs', handlebars.engine); // declare Handlebars engine
app.set('port', config.port); // set port for the app (3000 on localhost)
app.set('view engine', '.hbs'); // use Handlebars for templating

// middleware
app.use(express.static(path.join(__dirname, '/public')));
app.use(middleware.logUrl);

// URL routing
router(app);

// generic error handlers
app.use(middleware.error404);
app.use(middleware.error500);

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
const io = IO(server, config.socketOpts);

// socket routing
socket(io);
