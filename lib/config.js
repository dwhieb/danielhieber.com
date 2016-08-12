const localPort = 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'localhost';
process.env.PORT = process.env.PORT || localPort;

const env = process.env.NODE_ENV;

if (env === 'localhost') require('../../credentials/danielhieber.js');

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

const port = process.env.PORT;

const socketOpts = { transports: ['websocket', 'xhr-polling'] };

module.exports = {
  env,
  hbsOptions,
  port,
  socketOpts,
};
