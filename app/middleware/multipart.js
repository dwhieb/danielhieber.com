/**
 * Middlware for parsing form data. Should come after body-parser in the middleware waterfall.
 */

const { IncomingForm } = require('formidable');

module.exports = (req, res, next) => {

  if (req.headers[`content-type`] === `application/x-www-form-urlencoded`) return next();

  const form = new IncomingForm();

  form.parse(req, (err, fields, files) => {

    if (err) return next(err);

    req.body = fields;
    req.file = files.file;

    next();

  });

};
