/**
 * The GET handler for the Admin page
 */

module.exports = (req, res) => res.render(`admin`, {
  admin:     true,
  header:    false,
  id:        `admin`,
  pageTitle: `Admin`,
});
