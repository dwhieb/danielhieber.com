module.exports = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(500);
  res.send(`500: Internal Server Error`);
};
