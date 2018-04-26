const { env } = require('../config');
const helmet  = require('helmet');

const config = {};

config.contentSecurityPolicy = {
  browserSniff: false,
  directives: {
    connectSrc: [`'self'`, `*.danielhieber.com`, `*.visualstudio.com`],
    defaultSrc: [`'self'`, `*.danielhieber.com`],
    scriptSrc:  [`'self'`, `'unsafe-inline'`, `*.danielhieber.com`, `*.msecnd.net`],
    styleSrc:   [`'self'`, `'unsafe-inline'`, `*.danielhieber.com`],
    upgradeInsecureRequests: env === `production`,
  },
};

config.referrerPolicy = { policy: `same-origin` };

module.exports = helmet(config);
