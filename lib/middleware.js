module.exports = function middleware(req, res, next) {

  // log URL for debugging
  console.log(`Requested URL: ${req.originalUrl}`);

  // inject project metadata into locals for templating
  /* eslint-disable no-param-reassign */
  res.locals.meta = req.app.locals.meta;
  res.locals.meta.keywordsString = res.locals.meta.keywords.join(', ');
  /* eslint-enable no-param-reassign */

  next();

};
