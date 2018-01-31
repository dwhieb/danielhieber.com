module.exports = (req, res) => res.render(`error`, {
  error:     true,
  pageTitle: `Error`,
});
