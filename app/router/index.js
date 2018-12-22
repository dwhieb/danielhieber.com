/**
 * Main router
 */

/* eslint-disable
  max-statements,
*/

const { asyncErrors } = require('../../utilities');
const redirects       = require('./redirects');

const {
  auth,
  noCache,
} = require('../middleware');

const {
  admin,
  bibliography,
  bibliographies,
  bibliographiesEditor,
  cv,
  cvEditor,
  home,
  research,
  personal,
} = require('../../views/pages');

module.exports = app => {

  app.get(`/`, home.get);

  app.get(`/admin`, auth, admin.get);

  app.route(`/admin/bibliographies`)
  .all(auth, noCache)
  .get(asyncErrors(bibliographiesEditor.get))
  .post(asyncErrors(bibliographiesEditor.post));

  app.route(`/admin/bibliographies/:bibliography`)
  .all(auth, noCache)
  .get(asyncErrors(bibliographiesEditor.get))
  .post(asyncErrors(bibliographiesEditor.put)); // NB: Also routes DELETE requests

  app.route(`/admin/:type`)
  .all(auth, noCache)
  .get(asyncErrors(cvEditor.get))
  .post(asyncErrors(cvEditor.post));

  app.route(`/admin/:type/:cvid`)
  .all(auth, noCache)
  .get(asyncErrors(cvEditor.get))
  .post(asyncErrors(cvEditor.put)); // NB: Also routes other POST requests (delete item, upload file)

  app.get(`/bibliographies`, asyncErrors(bibliographies.get));

  app.get(`/bibliographies/dlx`, redirects.dlxBibliography);

  app.get(`/bibliographies/digital-linguistics`, redirects.dlxBibliography);

  app.get(`/bibliographies/flexibility`, redirects.flexibilityBibliography);

  app.get(`/bibliographies/:bibliography`, asyncErrors(bibliography.get));

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

  app.get(`/research`, asyncErrors(research.get));

  app.get(`/resume`, asyncErrors(cv.get));

  app.get(`/vitae`, asyncErrors(cv.get));

  app.get(`/vitae/pdf`, asyncErrors(cv.getPDF));

};
