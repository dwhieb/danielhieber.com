const { appInsights } = require('../../../services');

module.exports = (err, req, res, next) => { // eslint-disable-line no-unused-vars

  const e = appInsights.handleError(err);

  const { headers, payload } = e.output;

  // render error page
  res.status(payload.statusCode);

  res.set(headers);

  res.render(`error`, {
    error:      payload.error || `Unknown Error`,
    id:         `error`,
    message:    `${payload.message} Please consider <a href=https://github.com/dwhieb/danielhieber.com/issues>opening an issue on GitHub</a>. Use Error ID <code>${req.id}</code> when reporting the error.`,
    pageTitle:  `Error`,
    statusCode: payload.statusCode || 500,
  });

};
