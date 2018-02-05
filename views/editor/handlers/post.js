module.exports = (req, res, next) => {
  res.status(200).json(req.body);
};
