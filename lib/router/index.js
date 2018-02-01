const redirects = require('./redirects');

const {
  home,
  personal,
} = require('../../views');

module.exports = app => {
  app.get(`/`, home);
  app.get(`/blog`, redirects.blog);
  app.get(`/digitallinguistics`, redirects.dlx);
  app.get(`/digital-linguistics`, redirects.dlx);
  app.get(`/dlx`, redirects.dlx);
  app.get(`/home`, home);
  app.get(`/personal`, personal);
};
