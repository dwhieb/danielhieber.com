module.exports = (req, res, next) => {
  res.vary(`Upgrade-Insecure-Requests`);
  next();
};
