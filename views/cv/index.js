module.exports = (req, res) => res.render(`cv`, {
  cv:        true,
  header:    false,
  id:        `cv`,
  pageTitle: `CV`,
});
