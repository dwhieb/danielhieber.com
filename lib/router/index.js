const { home }  = require('../../views');
const redirects = require('./redirects');

module.exports = app => {
  app.get(`/`, home);
  app.get(`/blog`, redirects.blog);
  app.get(`/home`, home);
};
