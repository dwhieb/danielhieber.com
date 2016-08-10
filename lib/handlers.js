const capitalize = require('./utilities').capitalize;

const notFound = 404;
const serverError = 500;

exports.admin = (req, res) => {
  if (req.params.tool) {

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

exports.blog = (req, res) => res.redirect('http://blog.danielhieber.com');

exports.cv = (req, res) => res.render('cv', { pageTitle: 'CV' });

/* eslint-disable no-unused-vars */
exports.error404 = (req, res, next) => {
  res.status(notFound);
  res.render('error', {
    pageTitle: 'Error',
    status: notFound,
    error: 'Not found',
    details: `The requested URL could not be found: ${req.originalUrl}.`,
  });
};

exports.error500 = (err, req, res, next) => {
  res.status(serverError);
  res.render('error', {
    pageTitle: 'Error',
    status: serverError,
    error: 'Server error',
    details: `Internal server error. Please consider reporting this problem by opening an issue on GitHub: <a href=${res.locals.meta.bugs.url}>${res.locals.meta.bugs.url}</a>, and including the error information below.`,
  });
};
/* eslint-enable no-unused-vars */

exports.home = (req, res) => res.render('home', { pageTitle: 'Home' });

exports.languages = (req, res) => {
  if (req.params.language) {
    const langName = req.params.language.toLowerCase();
    res.render(`languages/${langName}`, { pageTitle: capitalize(langName) });
  } else {
    res.render('languages/index', { pageTitle: 'Languages' });
  }
};

exports.publications = (req, res) => {
  if (req.params.publication) {
    // TODO: serve the file page
  } else {
    res.render('cv', { pageTitle: 'CV' });
  }
};

exports.research = (req, res) => res.render('research', { pageTitle: 'Research' });

exports.sandbox = (req, res) => {

  const project = req.params.project;

  if (project) {
    res.render(`sandbox/${project}`, { pageTitle: capitalize(project) });
  } else {
    res.render('sandbox/index.js');
  }

};

exports.teaching = (req, res) => {
  res.render('teaching', { pageTitle: 'Teaching' });
};

exports.test = (req, res) => {
  res.render('test', { pageTitle: 'Test' });
};
