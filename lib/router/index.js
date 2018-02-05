const { asyncErrors } = require('../utilities');

const {
  blog,
  dlx,
} = require('./redirects');

const {
  admin,
  editor,
  home,
  personal,
} = require('../../views');

module.exports = app => {
  app.get(`/`, home);
  app.get(`/admin`, admin);
  app.route(`/admin/:type`)
  .get(asyncErrors(editor))
  .post(editor);
  app.route(`/admin/:type/:cvid`)
  .get(asyncErrors(editor))
  .post(editor);
  app.get(`/blog`, blog);
  app.get(`/digitallinguistics`, dlx);
  app.get(`/digital-linguistics`, dlx);
  app.get(`/dlx`, dlx);
  app.get(`/home`, home);
  app.get(`/personal`, personal);
};
