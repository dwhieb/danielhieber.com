const { env } = require('../config');
const helmet  = require('helmet');

const config = {};

if (env === `production`) {

  config.contentSecurityPolicy = {
    browserSniff: false,
    directives: {
      defaultSrc: [`'self'`, `*.danielhieber.com`],
      scriptSrc:  [`'self'`, `'unsafe-inline'`, `*.danielhieber.com`],
      styleSrc:   [`'self'`, `'unsafe-inline'`, `*.danielhieber.com`],
      upgradeInsecureRequests: true,
    },
  };

  config.referrerPolicy = { policy: `no-referrer` };

}

module.exports = helmet(config);
