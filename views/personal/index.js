module.exports = (req, res) => res.render(`personal`, {
  id:        `personal`,
  pageTitle: `Personal`,
  personal:  true,
});
