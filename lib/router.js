module.exports = app => {
  app.get(`/`, (req, res) => res.render(`home`, { pageTitle: `Home` }));
};
