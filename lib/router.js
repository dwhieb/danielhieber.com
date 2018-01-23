const { home } = require('../views');

module.exports = app => {
  app.get(`/`, home);
  app.get(`/home`, home);
};
