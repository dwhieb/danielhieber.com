const localPort = 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'localhost';
process.env.PORT = process.env.PORT || localPort;
process.env.HOSTNAME = process.env.HOSTNAME || 'localhost';

switch (process.env.NODE_ENV) {
  case 'localhost':
    require('../../credentials/danielhieber.js');
    process.env.BASE_URL = `http://localhost:${process.env.PORT}`;
    break;
  case 'development':
    process.env.BASE_URL = `https://dev.danielhieber.com`;
    break;
  case 'production':
    process.env.BASE_URL = 'https://danielhieber.com';
    break;
  default:
    throw new Error('Unknown environment variable.');
}

const collLink = 'dbs/danielhieber/colls/danielhieber';

const hbsOptions = {
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    // don't use arrow functions here - need to retain value of `this`
    section: function section(name, opts) {
      if (!this.sections) this.sections = {};
      this.sections[name] = opts.fn(this);
      return null;
    },
  },
};

const DocumentDBStore = require('documentdb-session');

const storeConfig = {
  collection:     'danielhieber',
  database:       'danielhieber',
  discriminator:  { type: 'session' },
  ttl:            2800, // 8 hours in seconds
};

const sessionOptions = {
  cookie: {
    domain: '.danielhieber.com',
    maxAge: 28800000, // 8 hours in milliseconds
  },
  name:               'session-id',
  resave:             false,
  rolling:            true,
  saveUninitialized:  false,
  secret:             process.env.COOKIE_SECRET,
  store:              new DocumentDBStore(storeConfig),
  unset:              'destroy',
};

const socketOptions = { transports: ['websocket', 'xhr-polling'] };

module.exports = {
  collLink,
  hbsOptions,
  sessionOptions,
  socketOptions,

  baseUrl: process.env.BASE_URL,
  dbKey: process.env.DOCUMENTDB_KEY,
  dbUrl: process.env.DOCUMENTDB_URL,
  env: process.env.NODE_ENV,
  hostname: process.env.HOSTNAME,
  port: process.env.PORT,
  userId: process.env.MS_USER_ID,
};
