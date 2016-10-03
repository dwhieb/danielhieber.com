const codes = {
  400: 'Bad Request',
  404: 'Not Found',
  409: 'Conflict',
  413: 'Payload Too Large',
  500: 'Internal Sever Error',
};

const JsonError = class JsonError extends Error {
  constructor(code, details) {
    super(codes[code]);
    this.code = code;
    this.details = details;
  }

  json() {
    return JSON.stringify(this, null, 2);
  }

};

const convert = err => {

  let code;
  let details;
  let errObj = {};

  if (typeof err === 'string') {
    try {
      errObj = JSON.parse(err);
    } catch (e) {
      code = 500;
      details = err;
    }
  } else if (typeof err === 'object') {
    errObj = err;
  }

  code = code || errObj.code || errObj.status || 500;
  details = details || err.message || err.details || codes[500];

  return new JsonError(code, details);

};

const middleware = (req, res, next) => {

  /* eslint-disable no-param-reassign */
  res.error = (code, details) => {
    const err = new JsonError(code, details);
    err.pageTitle = 'Error';
    res.status(code);
    res.render('error', err);
  };

  next();

};

module.exports = {
  codes,
  convert,
  JsonError,
  middleware,
};
