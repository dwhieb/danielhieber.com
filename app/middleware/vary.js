module.exports = (req, res, next) => {
  res.vary(`Upgrade-Insecure-Requests`);
  res.vary(`Accept-Encoding`);
  next();
};
