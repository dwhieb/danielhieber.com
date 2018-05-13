module.exports = (req, res, next) => {
  res.set(`Cache-Control`, `no-cache`);
  next();
};
