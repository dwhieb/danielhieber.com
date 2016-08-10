exports.logUrl = (req, res, next) => {
  console.log(`Requested URL: ${req.originalUrl}`);
  next();
};

exports.injectVariables = (req, res, next) => {
  /* eslint-disable no-param-reassign */
  res.locals.meta = req.app.locals.meta;
  res.locals.meta.keywordsString = res.locals.meta.keywords.join(', ');
  /* eslint-enable no-param-reassign */
  next();
};
