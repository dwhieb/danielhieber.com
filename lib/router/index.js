const { home }  = require('../../views');
const redirects = require('./redirects');

module.exports = app => {
  app.get(`/`, home);
  app.get(`/blog`, redirects.blog);
  app.get(`/digitallinguistics`, redirects.dlx);
  app.get(`/digital-linguistics`, redirects.dlx);
  app.get(`/dlx`, redirects.dlx);
  app.get(`/home`, home);
};
