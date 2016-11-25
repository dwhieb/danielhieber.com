/* eslint-disable no-console */
const config = require('../config');
const db = require('../db');
const models = require('../../models');

/**
 * Capitalizes the first letter of a string
 * @param  {String} string The string to capitalize
 * @return {String} Returns the capitalized string
 */
const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

// GET /admin and its subroutes
exports.admin = (req, res) => {

  // hide the header
  res.locals.header = false; // eslint-disable-line no-param-reassign

  switch (req.params.tool) {

    case 'blog':
      res.redirect('https://blog.danielhieber.com/ghost');
      break;

    case 'cv': {

      const names = Object.keys(models).filter(key => key.toLowerCase() !== 'document');
      const uniqueNames = new Set(names.map(name => name.toLowerCase()));
      const modelNames = [];

      uniqueNames.forEach(name => modelNames.push({
        lowercase:   name,
        capitalized: capitalize(name),
      }));

      res.render('admin/cv', {
        pageTitle: 'CV Admin',
        modelNames,
      });

      break;

    }

    default: res.render('admin/index', { pageTitle: res.locals.nav.admin });

  }

};

// GET /{language}/bibliography
exports.bibliographies = (req, res) => {

  if (req.params.language) {

    const lang = capitalize(req.params.language);

    res.locals.nav.languages.selected = true; // eslint-disable-line no-param-reassign
    res.render('languages/bibliography', { pageTitle: lang });

  } else {

    res.locals.nav.bibliographies.selected = true; // eslint-disable-line no-param-reassign
    res.render('bibliographies', { pageTitle: res.locals.nav.bibliographies });

  }

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
  res.error(404, `
    The requested URL could not be found:
    </br>
    <a href=${config.baseUrl}/>${config.baseUrl}${req.originalUrl}</a>
  `);
};

// Generic 500 handler
exports.error500 = (err, req, res, next) => {
  console.error(err, err.stack);
  res.error(500, `:-(`);
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
        res.status(200);
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
    res.status(200);
    res.send('Publication pages coming soon.');

  // Defaults to CV page
  } else {
    res.render('cv', res.locals.nav.cv);
  }

};

// GET /research
exports.research = (req, res) => {

  const query = `
    SELECT * FROM d
    WHERE (
      d.type = "category"
      AND (
        (NOT IS_DEFINED(d.ttl))
        OR d.ttl < 1
      )
    )`;

  db.queryDocuments(config.collLink, query).toArray((err, results) => {
    console.log(results[0]);
    /* eslint-disable no-param-reassign */
    if (err) return res.error(err.code || 500, 'Could not retrieve list of research categories.');
    res.locals.nav.research.categories = results;
    res.locals.nav.research.selected = true;
    res.render('research', res.locals.nav.research);
    /* eslint-enable no-param-reassign */
  });

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
        res.status(200);
        res.send(html);
      }
    });

  // Defaults to the sandbox main page
  } else {
    res.render('sandbox/index', { pageTitle: 'Sandbox' });
  }

};

exports.teaching = (req, res) => {
  res.locals.nav.teaching.selected = true; // eslint-disable-line no-param-reassign
  res.render('teaching', { pageTitle: res.locals.nav.teaching });
};
