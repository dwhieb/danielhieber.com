const { IncomingForm } = require('formidable');

module.exports = (req, res, next) => {

  const form = new IncomingForm();

  form.parse(req, (err, fields, files) => {

    if (err) return next(err);

    req.body = fields;
    req.file = files.file;

    next();

  });

};
