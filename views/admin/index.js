/**
 * The router handler for the Admin page
 * @name admin/index.js
 */

module.exports = (req, res) => res.render(`admin`, {
  admin:     true,
  header:    false,
  id:        `admin`,
  pageTitle: `Personal`,
});
