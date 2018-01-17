module.exports = (req, res, next) => { // eslint-disable-line no-unused-vars
  res.status(404);
  res.send(`404: Not Found`);
};
