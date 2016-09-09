const documentdbSession = require('documentdb-session');
const session = require('express-session');

const DocumentDBStore = documentdbSession(session);

const storeConfig = {
  collection:     'danielhieber',
  database:       'danielhieber',
  discriminator:  { type: 'session' },
  ttl:            2800, // 8 hours in seconds
};

const sessionOptions = {
  cookie: {
    domain: `${process.env.DOMAIN}`,
    maxAge: 28800000, // 8 hours in milliseconds
  },
  name:               'session_id',
  resave:             false,
  rolling:            true,
  saveUninitialized:  false,
  secret:             process.env.COOKIE_SECRET,
  store:              new DocumentDBStore(storeConfig),
  unset:              'destroy',
};

// remove cookie domain setting on localhost (otherwise it won't get set in Edge)
if (process.env.NODE_ENV === 'localhost') delete sessionOptions.cookie.domain;

session.sessionOptions = sessionOptions;

module.exports = session;
