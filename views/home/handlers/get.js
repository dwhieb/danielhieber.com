/**
 * GET handler for the Home page
 */

module.exports = (req, res) => res.render(`home`, {
  home:      true,
  id:        `home`,
  pageTitle: `Home`,
});
