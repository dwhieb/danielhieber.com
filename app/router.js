/**
 * Main router
 */

/* eslint-disable
  max-statements,
*/

const {
  asyncErrors,
  redirect,
} = require(`../utilities`);

const {
  auth,
  noCache,
} = require(`./middleware`);

const {
  admin,
  bibliography,
  bibliographies,
  cv,
  home,
  personal,
  research,
  teaching,
} = require(`../views/pages`);

// Redirect URLs
const blog            = `https://blog.danielhieber.com`;
const dlx             = `https://digitallinguistics.io`;
const dlxBibliography = `https://digitallinguistics.io/bibliography`;

module.exports = app => {

  app.get(`/`, home.get);

  app.get(`/admin`, auth, admin.main.get);

  app.route(`/admin/bibliographies`)
  .all(auth, noCache)
  .get(asyncErrors(admin.bibliographies.get))
  .post(asyncErrors(admin.bibliographies.post));

  app.route(`/admin/bibliographies/:bibliography`)
  .all(auth, noCache)
  .get(asyncErrors(admin.bibliographies.get))
  .post(asyncErrors(admin.bibliographies.put)); // NB: Also routes DELETE requests

  app.route(`/admin/:type`)
  .all(auth, noCache)
  .get(asyncErrors(admin.cv.get))
  .post(asyncErrors(admin.cv.post));

  app.route(`/admin/:type/:cvid`)
  .all(auth, noCache)
  .get(asyncErrors(admin.cv.get))
  .post(asyncErrors(admin.cv.put)); // NB: Also routes other POST requests (delete item, upload file)

  app.get(`/bibliographies`, asyncErrors(bibliographies.get));
  app.get(`/bibliographies/dlx`, redirect(dlxBibliography));
  app.get(`/bibliographies/digital-linguistics`, redirect(dlxBibliography));
  app.get(`/bibliographies/flexibility`, redirect(`/bibliographies/lexical-flexibility`));
  app.get(`/bibliographies/:bibliography`, asyncErrors(bibliography.get));
  app.get(`/blog`, redirect(blog));
  app.get(`/courses`, redirect(`/teaching`));
  app.get(`/courses/:course`, redirect(`/teaching/:course`));
  app.get(`/curriculumvitae`, asyncErrors(cv));
  app.get(`/curriculumvitae/pdf`, asyncErrors(cv.getPDF));
  app.get(`/cv`, asyncErrors(cv.get));
  app.get(`/cv/pdf`, asyncErrors(cv.getPDF));
  app.get(`/digitallinguistics`, redirect(dlx));
  app.get(`/digital-linguistics`, redirect(dlx));
  app.get(`/dlx`, redirect(dlx));
  app.get(`/home`, home.get);
  app.get(`/personal`, personal.get);
  app.get(`/research`, asyncErrors(research.get));
  app.get(`/resume`, asyncErrors(cv.get));
  app.get(`/teaching`, asyncErrors(teaching.main.get));
  app.get(`/teaching/lang-life`, teaching.langLife.get);
  app.get(`/vitae`, asyncErrors(cv.get));
  app.get(`/vitae/pdf`, asyncErrors(cv.getPDF));

};
