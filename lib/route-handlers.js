const AppInsights = require('applicationinsights');
const capitalize = require('./utilities').capitalize;
const config = require('./config');

const notFound = 404;
const serverError = 500;

if (config.env === 'production') {
  var appInsights = AppInsights.getClient();
}

exports.admin = (req, res) => {
  if (req.params.tool === 'blog') {

    res.redirect('https://blog.danielhieber.com/ghost');

  } else if (req.params.tool) {

    const toolName = req.params.tool.toLowerCase();

    res.render(`admin/${req.params.tool.toLowerCase()}`, {
      pageTitle: `${capitalize(toolName)} Admin`,
    });

  } else {

    res.render('admin/index', { pageTitle: 'Admin' });

  }
};

exports.bibliographies = (req, res) => res.render('languages/bibliography', {
  pageTitle: capitalize(req.params.language),
});

exports.bibliographies = (req, res) => {
  res.locals.nav.languages.selected = true; // eslint-disable-line no-param-reassign
  res.render('languages/bibliography', { pageTitle: capitalize(req.params.language) });
};

exports.blog = (req, res) => res.redirect('http://blog.danielhieber.com');

exports.cv = (req, res) => {
  res.locals.nav.cv.selected = true; // eslint-disable-line no-param-reassign
  res.render('cv', res.locals.nav.cv);
};

/* eslint-disable no-unused-vars */
exports.error404 = (req, res, next) => {
  res.status(notFound);
  res.render('error', {
    pageTitle: 'Error',
    status: notFound,
    error: 'Not Found',
    details: `The requested URL could not be found:</br><a href=http://danielhieber.com/>http://danielhieber.com${req.originalUrl}</a>`,
  });
};

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

exports.home = (req, res) => {
  res.locals.nav.home.selected = true; // eslint-disable-line no-param-reassign
  res.render('home', res.locals.nav.home);
};

exports.languages = (req, res) => {

  res.locals.nav.languages.selected = true; // eslint-disable-line no-param-reassign

  if (req.params.language) {
    const langName = req.params.language.toLowerCase();
    res.render(`languages/${langName}`, { pageTitle: capitalize(langName) });
  } else {
    res.render('languages/index', res.locals.nav.languages);
  }

};

exports.publications = (req, res) => {

  res.locals.nav.cv.selected = true; // eslint-disable-line no-param-reassign

  if (req.params.publication) {
    // TODO: serve the file page
    res.status(200);
    res.send('Publication pages coming soon.');
  } else {
    res.render('cv', res.locals.nav.cv);
  }
};

exports.research = (req, res) => {
  res.locals.nav.research.selected = true; // eslint-disable-line no-param-reassign
  res.render('research', res.locals.nav.research);
};

exports.sandbox = (req, res) => {

  const project = req.params.project;

  if (project) {
    res.render(`sandbox/${project}`, { pageTitle: capitalize(project) });
  } else {
    res.render('sandbox/index.js');
  }

};
