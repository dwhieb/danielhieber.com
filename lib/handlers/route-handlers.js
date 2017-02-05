/* eslint-disable no-console, no-param-reassign */
const config = require('../config');
const db = require('../db');
const markdown = require('markdown').markdown;
const models = require('../../models');

/**
 * Capitalizes the first letter of a string
 * @param  {String} string The string to capitalize
 * @return {String} Returns the capitalized string
 */
const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

/**
 * Takes a Date object or an ISO date string and returns an object with a human-readable date (standard US format), as well as an ISO-formatted string appropriate for use in a `datetime` attribute.
 * @param  {Object|String} date A Date object or a date string
 * @return {Object}             An object with two properties: `datetime` and `dateString`
 */
const getDateStrings = date => {

  const d = new Date(date);

  return {
    date:       d,
    datetime:   d.toISOString().slice(0, 10),
    dateString: d.toLocaleDateString('en-US', {
      year:  'numeric',
      month: 'long',
      day:   'numeric',
    }),
  };

};

// GET /admin and its subroutes
exports.admin = (req, res) => {

  // hide the header
  res.locals.header = false;

  switch (req.params.tool) {

    /*
    case 'blog':
      res.redirect('https://blog.danielhieber.com/ghost');
      break;
    */

    case 'cv': {

      const lowercase = models.Document.cvTypes.concat('category');
      const modelNames = lowercase.map(name => ({
        lowercase:   name,
        capitalized: capitalize(name),
      }));

      res.render('admin/cv', {
        pageTitle: 'CV Admin',
        modelNames,
      });

      break;

    }

    default: res.render('admin/index', res.locals.nav.admin);

  }

};

// GET /{language}/bibliography
exports.bibliographies = (req, res) => {

  if (req.params.language) {

    const lang = capitalize(req.params.language);

    res.locals.nav.languages.selected = true;
    res.render('languages/bibliography', { pageTitle: lang });

  } else {

    res.locals.nav.bibliographies.selected = true;
    res.render('bibliographies', res.locals.nav.bibliographies);

  }

};

// GET /blog => redirects to blog.danielhieber.com
// exports.blog = (req, res) => res.redirect('http://blog.danielhieber.com');

// GET /cv
exports.cv = (req, res) => {

  const query = `
    SELECT * FROM d
    WHERE (
      IS_DEFINED(d.cvid)
      AND (
        (NOT IS_DEFINED(d.ttl))
        OR d.ttl < 1
      )
    )`;

  db.queryDocuments(db.coll, query).toArray((err, results) => {

    if (err) return res.error(Number(err.code), err.body);

    /* eslint-disable no-underscore-dangle */
    // retrieve the most recently updated document
    const lastUpdatedDocument = results.reduce((prev, current) => {
      return current._ts > prev._ts ? current : prev;
    });

    const dateStrings = getDateStrings(lastUpdatedDocument._ts * 1000);
    res.locals.lastUpdatedDatetime = dateStrings.datetime;
    res.locals.lastUpdatedDateString = dateStrings.dateString;

    /* eslint-enable no-underscore-dangle */
    // add arrays for each CV type to res.locals
    models.Document.cvTypes.forEach(type => { res.locals[type] = []; });

    // add each CV item to its proper array in res.locals
    results.forEach(cvItem => res.locals[cvItem.type].push(cvItem));

    // sort the CV types as appropriate
    res.locals.award.sort((a, b) => a.year < b.year);
    res.locals.course.sort((a, b) => a.title > b.title);
    res.locals.education.sort((a, b) => a.startYear < b.startYear);
    res.locals.fieldwork.sort((a, b) => a.startYear < b.startYear);
    res.locals.language.sort((a, b) => a.title > b.title);
    res.locals.media.sort((a, b) => a.date < b.date);
    res.locals.membership.sort((a, b) => a.organization > b.organization);
    res.locals.reference.sort((a, b) => a.priority > b.priority);
    res.locals.service.sort((a, b) => a.startYear < b.startYear);
    res.locals.work.sort((a, b) => a.startYear < b.startYear);

    // education
    res.locals.education.forEach(ed => {
      ed.achievements.forEach((ach, i) => {
        ed.achievements[i] = markdown.toHTML(ach);
      });
    });

    // media
    res.locals.media.forEach(media => {
      const dateStrings = getDateStrings(media.date);
      media.datetime = dateStrings.datetime;
      media.dateString = dateStrings.dateString;
    });

    // proficiencies
    const proficiencies = res.locals.proficiency;

    res.locals.proficiency = {
      skill:    [],
      software: [],
    };

    proficiencies.forEach(proficiency => {
      res.locals.proficiency[proficiency.proficiencyType].push(proficiency);
    });

    Object.keys(res.locals.proficiency).forEach(key => {
      res.locals.proficiency[key].sort((a, b) => a.title > b.title);
    });

    // publications
    const publications = res.locals.publication;

    const headers = {
      book:             'Books',
      edited:           'Edited Volumes',
      'peer-reviewed':  'Refereed Articles & Chapters',
      presentation:     'Workshops, Presentations, & Posters',
      online:           'Online Articles',
      review:           'Book Reviews',
      project:          'Projects',
      'non-linguistic': 'Non-Linguistic Publications',
      unpublished:      'Unpublished Manuscripts',
    };

    res.locals.publication = {};

    Object.values(headers).forEach(val => { res.locals.publication[val] = []; });

    publications.forEach(pub => {

      const header = headers[pub.publicationType];

      pub.title = markdown.toHTML(pub.title);

      if (pub.date === 'forthcoming') {
        pub.datetime = '';
        pub.year = pub.date;
      } else {
        const dateStrings = getDateStrings(pub.date);
        pub.datetime = dateStrings.datetime;
        pub.year = dateStrings.date.getFullYear();
      }

      res.locals.publication[header].push(pub);

    });

    Object.keys(res.locals.publication).forEach(pubType => {
      if (res.locals.publication[pubType].length === 0) {
        delete res.locals.publication[pubType];
      } else {
        res.locals.publication[pubType].sort((a, b) => {
          if (a.date < b.date) return 1;
          return -1;
        });
      }
    });

    // set page settings and render page
    res.locals.header = false;
    res.locals.nav.cv.selected = true;
    res.render('cv', res.locals.nav.cv);

  });

};

// Generic 404 handler
exports.error404 = (req, res, next) => { // eslint-disable-line no-unused-vars
  res.error(404, `
    The requested URL could not be found:
    </br>
    <a href=${config.baseUrl}/>${config.baseUrl}${req.originalUrl}</a>
  `);
};

// Generic 500 handler
exports.error500 = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err, err.stack);
  res.error(500, `:-(`);
};

// Home page
exports.home = (req, res) => {
  res.locals.nav.home.selected = true;
  res.render('home', res.locals.nav.home);
};

// GET /languages
exports.languages = (req, res) => {

  res.locals.nav.languages.selected = true;

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

  res.locals.nav.cv.selected = true;

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

  db.queryDocuments(db.coll, query).toArray((err, results) => {
    if (err) return res.error(err.code || 500, 'Could not retrieve list of research categories.');
    res.locals.nav.research.categories = results;
    res.locals.nav.research.selected = true;
    res.render('research', res.locals.nav.research);
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
  res.locals.nav.teaching.selected = true;
  res.render('teaching', res.locals.nav.teaching);
};
