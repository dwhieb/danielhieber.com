const config = require('./lib/config');

const appInsights = require('applicationinsights');
const errors = require('./lib/errors').middleware;
const express = require('express');
const Handlebars = require('express-handlebars');
const helmet = require('helmet');
const http = require('http');
const meta = require('./package.json');
const passport = require('./lib/auth').passport;
const path = require('path');
const middleware = require('./lib/middleware');
const router = require('./lib/routes/router');
const session = require('./lib/session');
const socket = require('./lib/routes/socket');

// initialize Express, Handlebars
const app = express();
const handlebars = Handlebars.create(config.hbsOptions);

// Azure application insights
if (config.production) appInsights.setup().start();

// app settings
app.enable('trust proxy'); // trust the Azure proxy server
app.engine(config.hbsOptions.extname, handlebars.engine); // declare Handlebars engine
app.set('port', config.port); // set port for the app (3000 on localhost)
app.set('view engine', config.hbsOptions.extname); // use Handlebars for templating
app.locals.meta = meta; // makes package.json data available to app and middleware

// middleware
app.use(helmet()); // basic security features
app.use(express.static(path.join(__dirname, '/public'))); // routing for static files
app.use(errors); // middleware for returning consistent errors
app.use(session(session.sessionOptions)); // use sessions
app.use(passport.initialize()); // initialize Passport
app.use(passport.session()); // persist user in session with Passport
app.use(middleware); // custom middleware (logs URL, injects variables, etc.)

// URL routing
router(app);

// create server
const server = http.createServer(app);

// start server listening
server.listen(config.port, () => {
  console.log(`\nServer started. Press Ctrl+C to terminate.
  Project:  ${meta.name}
  Port:     ${config.port}
  Time:     ${new Date}
  Node:     ${process.version}
  Env:      ${config.env}`);
});

// socket routing
socket(server);

// export app for route testing
module.exports = app;
