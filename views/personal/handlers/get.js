/**
 * The route handler for the Personal page
 * @name personal/index.js
 */

module.exports = (req, res) => res.render(`personal`, {
  id:        `personal`,
  pageTitle: `Personal`,
  personal:  true,
});
