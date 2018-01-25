const cookieParser = require('cookie-parser');
const { secret }   = require('../config');

module.exports = cookieParser(secret, { secure: true });
