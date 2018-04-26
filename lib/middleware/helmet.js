const { env } = require('../config');
const helmet  = require('helmet');

const config = {};

if (env === `production`) {

  config.contentSecurityPolicy = {
    directives: {
      defaultSrc: ["'*.danielhieber.com'"],
      upgradeInsecureRequests: true,
    },
  };

  config.referrerPolicy = { policy: `no-referrer` };

}

module.exports = helmet(config);
