const { asyncErrors } = require('../utilities');
const { auth }        = require('../middleware');

const redirects = require('./redirects');

const {
  admin,
  cv,
  editor,
  home,
  research,
  personal,
} = require('../../views');

module.exports = app => {

  app.get(`/`, home.get);

  app.get(`/admin`, auth, admin.get);

  app.route(`/admin/:type`)
  .all(auth)
  .get(asyncErrors(editor.get))
  .post(asyncErrors(editor.post));

  app.route(`/admin/:type/:cvid`)
  .all(auth)
  .get(asyncErrors(editor.get))
  .post(asyncErrors(editor.put)); // NB: also routes other POST requests (delete item, upload file)

  app.get(`/blog`, redirects.blog);

  app.get(`/curriculumvitae`, asyncErrors(cv));

  app.get(`/curriculumvitae/pdf`, asyncErrors(cv.getPDF));

  app.get(`/cv`, asyncErrors(cv.get));

  app.get(`/cv/pdf`, asyncErrors(cv.getPDF));

  app.get(`/digitallinguistics`, redirects.dlx);

  app.get(`/digital-linguistics`, redirects.dlx);

  app.get(`/dlx`, redirects.dlx);

  app.get(`/home`, home.get);

  app.get(`/personal`, personal.get);

  app.get(`/research`, research.get);

  app.get(`/resume`, asyncErrors(cv.get));

  app.get(`/vitae`, asyncErrors(cv.get));

  app.get(`/vitae/pdf`, asyncErrors(cv.getPDF));

};
