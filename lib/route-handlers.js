/* eslint-disable no-console */
const AppInsights = require('applicationinsights');
const capitalize = require('./utilities').capitalize;

const ok = 200;
const notFound = 404;
const serverError = 500;

// load Azure application insights
const appInsights = AppInsights.getClient();

// GET /admin and its subroutes
exports.admin = (req, res) => {

  // hide the header
  res.locals.header = false; // eslint-disable-line no-param-reassign

  // GET /admin/blog => redirect to blog admin
  if (req.params.tool === 'blog') {

    res.redirect('https://blog.danielhieber.com/ghost');

  // GET /admin/{tool} => renders page for that tool
  } else if (req.params.tool) {

    const toolName = req.params.tool.toLowerCase();

    res.render(`admin/${toolName}`, { pageTitle: 'Admin' });

  // GET /admin => renders the main admin page (default)
  } else {

    res.render('admin/index', { pageTitle: 'Admin' });

  }
};

// GET /{language}/bibliography
exports.bibliographies = (req, res) => {

  const lang = capitalize(req.params.language);

  res.locals.nav.languages.selected = true; // eslint-disable-line no-param-reassign
  res.render('languages/bibliography', { pageTitle: lang });

};

// GET /blog => redirects to blog.danielhieber.com
exports.blog = (req, res) => res.redirect('http://blog.danielhieber.com');

// GET /cv
exports.cv = (req, res) => {
  res.locals.nav.cv.selected = true; // eslint-disable-line no-param-reassign
  res.render('cv', res.locals.nav.cv);
};

/* eslint-disable no-unused-vars */
// Generic 404 handler
exports.error404 = (req, res, next) => {
  res.status(notFound);
  res.render('error', {
    pageTitle: 'Error',
    status: notFound,
    error: 'Not Found',
    details: `The requested URL could not be found:</br><a href=http://danielhieber.com/>http://danielhieber.com${req.originalUrl}</a>`,
  });
};

// Generic 500 handler
exports.error500 = (err, req, res, next) => {
  console.error(err, err.stack);
  if (appInsights) appInsights.trackException(err);
  res.status(serverError);
  res.render('error', {
    pageTitle: 'Error',
    status: serverError,
    error: 'Server Error',
    details: `:-(`,
  });
};

/* eslint-enable no-unused-vars */

// Home page
exports.home = (req, res) => {
  res.locals.nav.home.selected = true; // eslint-disable-line no-param-reassign
  res.render('home', res.locals.nav.home);
};

// GET /languages
exports.languages = (req, res) => {

  res.locals.nav.languages.selected = true; // eslint-disable-line no-param-reassign

  // GET /languages/{language}
  if (req.params.language) {

    const langName = req.params.language.toLowerCase();

    res.render(`languages/${langName}`, { pageTitle: capitalize(langName) });

  // GET /languages => renders the languages overview page (default)
  } else {

    res.render('languages/index', res.locals.nav.languages);

  }

};

// GET /publications/{publication}
exports.publications = (req, res) => {

  res.locals.nav.cv.selected = true; // eslint-disable-line no-param-reassign

  // Serves the publication summary page if {publication} parameter is included
  if (req.params.publication) {
    // TODO: serve the file page
    res.status(ok);
    res.send('Publication pages coming soon.');

  // Defaults to CV page
  } else {
    res.render('cv', res.locals.nav.cv);
  }

};

// GET /research
exports.research = (req, res) => {
  res.locals.nav.research.selected = true; // eslint-disable-line no-param-reassign
  res.render('research', res.locals.nav.research);
};

// GET /sandbox/{project}
exports.sandbox = (req, res) => {

  const project = req.params.project;

  // If there's a {project} parameter, render that project's page
  if (project) {
    res.render(`sandbox/${project}`, { pageTitle: capitalize(project) });

  // Defaults to the sandbox main page
  } else {
    res.render('sandbox/index.js');
  }

};
