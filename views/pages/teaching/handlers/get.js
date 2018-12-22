/**
 * GET handler for the Teaching page
 */

module.exports = (req, res) => res.render(`teaching`, {
  id:        `teaching`,
  pageTitle: `Teaching`,
  teaching:  true,
});
