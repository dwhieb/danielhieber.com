/* eslint-disable no-console */
const AppInsights = require('applicationinsights');
const capitalize = require('./utilities').capitalize;
const codes = require('../public/data/codes.json');
const config = require('./config');

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

    res.render(`admin/${toolName}`, { pageTitle: 'Admin' }, (err, html) => {
      if (err) {
        console.error(err, err.stack);
        res.render('admin/index', { pageTitle: 'Admin' });
      } else {
        res.status(codes.ok);
        res.send(html);
      }
    });

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
  res.status(codes.notFound);
  res.render('error', {
    pageTitle: 'Error',
    status: codes.notFound,
    error: 'Not Found',
    details: `
      The requested URL could not be found:
      </br>
      <a href=${config.baseUrl}/>${config.baseUrl}${req.originalUrl}</a>
    `,
  });
};

// Generic 500 handler
exports.error500 = (err, req, res, next) => {
  console.error(err, err.stack);
  if (appInsights) appInsights.trackException(err);
  res.status(codes.serverError);
  res.render('error', {
    pageTitle: 'Error',
    status: codes.serverError,
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
    const title = capitalize(langName);

    res.render(`languages/${langName}`, { pageTitle: title }, (err, html) => {
      if (err) {
        console.error(err, err.stack);
        res.render('languages/index', res.locals.nav.languages);
      } else {
        res.status(codes.ok);
        res.send(html);
      }
    });

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
    // Also render an error page or the CV page if errors occur
    res.status(codes.ok);
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

    const title = capitalize(project);

    res.render(`sandbox/${project}`, { pageTitle: title }, (err, html) => {
      if (err) {
        console.error(err, err.stack);
        res.render('sandbox/index', { pageTitle: 'Sandbox' });
      } else {
        res.status(codes.ok);
        res.send(html);
      }
    });

  // Defaults to the sandbox main page
  } else {
    res.render('sandbox/index', { pageTitle: 'Sandbox' });
  }

};
