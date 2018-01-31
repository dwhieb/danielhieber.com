/**
 * This middleware sets the Service-Worker-Allowed header
 * @name worker.js
 */

module.exports = (req, res, next) => {
  res.set(`Service-Worker-Allowed`, `/`);
  next();
};
