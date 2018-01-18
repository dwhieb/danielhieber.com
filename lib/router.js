const { home } = require('./handlers');

module.exports = app => {
  app.get(`/`, home);
  app.get(`/home`, home);
};
