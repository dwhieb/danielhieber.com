/**
 * GET handler for the Personal page
 */

module.exports = (req, res) => res.render(`personal`, {
  id:        `personal`,
  pageTitle: `Personal`,
  personal:  true,
});
