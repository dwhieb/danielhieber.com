/**
 * The route handler for the Home page
 * @name home/index.js
 */

module.exports = (req, res) => res.render(`home`, {
  home:      true,
  id:        `home`,
  pageTitle: `Home`,
});
