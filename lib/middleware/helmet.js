const { env } = require('../config');
const helmet  = require('helmet');

const config = {};

if (env === `production`) {

  config.contentSecurityPolicy = {
    directives: {
      defaultSrc: [`'self'`, `*.danielhieber.com`, `'unsafe-inline'`],
      upgradeInsecureRequests: true,
    },
  };

  config.referrerPolicy = { policy: `no-referrer` };

}

module.exports = helmet(config);
