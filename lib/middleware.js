const package = require('../package.json');

const notFound = 404;
const serverError = 500;

/* eslint-disable no-unused-vars */
exports.error404 = (req, res, next) => {
  res.status(notFound);
  res.render('error', {
    pageTitle: 'Error',
    status: notFound,
    error: 'Not found',
    details: `The requested URL could not be found: ${req.originalUrl}.`,
  });
};

exports.error500 = (err, req, res, next) => {
  res.status(serverError);
  res.render('error', {
    pageTitle: 'Error',
    status: serverError,
    error: 'Server error',
    details: `Internal server error. Please consider reporting this problem by opening an issue on GitHub: <a href=${package.bugs.url}>${package.bugs.url}</a>, and including the error information below.`,
  });
};
/* eslint-enable no-unused-vars */

exports.logUrl = (req, res, next) => {
  console.log(`Requested URL: ${req.originalUrl}`);
  next();
};
