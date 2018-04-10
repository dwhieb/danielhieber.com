const { asyncErrors } = require('../utilities');
const { auth }        = require('../middleware');

const {
  blog,
  dlx,
} = require('./redirects');

const {
  admin,
  cv,
  editor,
  home,
  personal,
} = require('../../views');

module.exports = app => {

  app.get(`/`, home);

  app.get(`/admin`, auth, admin);

  app.route(`/admin/:type`)
  .all(auth)
  .get(asyncErrors(editor.get))
  .post(asyncErrors(editor.post));

  app.route(`/admin/:type/:cvid`)
  .all(auth)
  .get(asyncErrors(editor.get))
  .post(asyncErrors(editor.put)); // NB: also routes other POST requests (delete item, upload file)

  app.get(`/blog`, blog);

  app.get(`/curriculumvitae`, asyncErrors(cv));

  app.get(`/cv`, asyncErrors(cv));

  app.get(`/digitallinguistics`, dlx);

  app.get(`/digital-linguistics`, dlx);

  app.get(`/dlx`, dlx);

  app.get(`/home`, home);

  app.get(`/personal`, personal);

  app.get(`/resume`, asyncErrors(cv));

  app.get(`/vitae`, asyncErrors(cv));

};
