const localPort = 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'localhost';
process.env.PORT = process.env.PORT || localPort;
process.env.HOSTNAME = process.env.HOSTNAME || 'localhost';

switch (process.env.NODE_ENV) {
  case 'localhost':
    require('../../credentials/danielhieber.js');
    process.env.DOMAIN = `localhost`;
    process.env.BASE_URL = `http://${process.env.DOMAIN}:${process.env.PORT}`;
    break;
  case 'development':
    process.env.DOMAIN = 'dev.danielhieber.com';
    process.env.BASE_URL = `https://${process.env.DOMAIN}`;
    break;
  case 'production':
    process.env.DOMAIN = 'danielhieber.com';
    process.env.BASE_URL = `https://${process.env.DOMAIN}`;
    break;
  default:
    throw new Error('Unknown environment variable.');
}

const collLink = 'dbs/danielhieber/colls/danielhieber';

const corsOptions = process.env.NODE_ENV === 'localhost' ?
  { origin: 'http://localhost' } :
  {};

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

module.exports = {
  collLink,
  corsOptions,
  hbsOptions,

  baseUrl: process.env.BASE_URL,
  dbKey: process.env.DOCUMENTDB_KEY,
  dbUrl: process.env.DOCUMENTDB_URL,
  domain: process.env.DOMAIN,
  env: process.env.NODE_ENV,
  hostname: process.env.HOSTNAME,
  port: process.env.PORT,
  userId: process.env.MS_USER_ID,
};
