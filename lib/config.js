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

const socketOptions = { transports: ['websocket', 'xhr-polling'] };

const verifyPassport = (accessToken, refreshToken, profile, cb) => {
  console.log(profile);
  return cb(null, profile);
};

module.exports = {
  hbsOptions,
  socketOptions,
  verifyPassport,
  baseUrl: process.env.BASE_URL,
  env: process.env.NODE_ENV,
  hostname: process.env.HOSTNAME,
  port: process.env.PORT,
};
