const { env } = require('../config');
const helmet  = require('helmet');

const config = {};

if (env === `production`) {

  config.contentSecurityPolicy = {
    browserSniff: false,
    directives: {
      'connect-src': [`'self'`, `*.danielhieber.com`, `*.visualstudio.com`],
      defaultSrc: [`'self'`, `*.danielhieber.com`],
      scriptSrc:  [`'self'`, `'unsafe-inline'`, `*.danielhieber.com`, `*.msecnd.net`],
      styleSrc:   [`'self'`, `'unsafe-inline'`, `*.danielhieber.com`],
      upgradeInsecureRequests: true,
    },
  };

  config.referrerPolicy = { policy: `no-referrer` };

}

module.exports = helmet(config);
