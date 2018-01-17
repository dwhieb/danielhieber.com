let { env } = require('./config');
const helmet  = require('helmet');

const config = {};

env = `production`;

if (env === `production`) {

  config.contentSecurityPolicy = {
    directives: {
      defaultSrc: ["'*.danielhieber.com'"],
    },
  };

  config.referrerPolicy = { policy: `no-referrer` };

}

module.exports = helmet(config);
