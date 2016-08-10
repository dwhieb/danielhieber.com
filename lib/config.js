const port = 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'localhost';
process.env.PORT = process.env.PORT || port;

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

const socketOpts = { transports: ['websocket', 'xhr-polling'] };

module.exports = {
  hbsOptions,
  socketOpts,
  env: process.env.NODE_ENV,
  port: process.env.PORT,
};
