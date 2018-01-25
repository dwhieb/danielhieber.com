const csurf = require('csurf');

module.exports = [

  csurf({ cookie: true }),

  (req, res, next) => {
    res.locals.csrf = req.csrfToken();
    next();
  },

];
