// Handler for the GET method for the CV Editor

/* eslint-disable
  max-statements,
  no-shadow,
*/

const catchError    = require('./catchError');
const db            = require('../../../lib/modules/database');
const { promisify } = require('util');
const types         = require('../types');

const {
  capitalize,
  compare,
} = require('../../../lib/utilities');

const typesWithCategories = [
  `award`,
  `fieldwork`,
  `language`,
  `media`,
  `membership`,
  `proficiency`,
  `publication`,
  `service`,
  `work`,
];

module.exports = async (req, res, next) => {

  // Check type

  const type = types[req.params.type];
  if (!type) return res.error.badRequest(`Invalid CV type.`);

  // Create rendering context for Handlebars

  const context = {
    admin:     true,
    coll:      req.params.type,
    csrf:      req.csrfToken(),
    header:    false,
    id:        `editor`,
    pageTitle: `Editor`,
    type,
    Type:      capitalize(req.params.type),
    types,
  };

  // Retrieve categories

  if (typesWithCategories.includes(type)) {

    const categoriesQuery = `
      SELECT c.key, c.title FROM c
      WHERE (
        c.type = "category"
        AND (
          (NOT IS_DEFINED(c.ttl))
          OR c.ttl < 1
        )
      )
    `;

    try {

      const iterator     = db.query(db.coll, categoriesQuery);
      const toArray      = promisify(iterator.toArray).bind(iterator);
      context.categories = await toArray();

    } catch (e) {

      return catchError(req, res, next)(e);

    }

  }

  // Retrieve docs

  const query = `
    SELECT * FROM c
    WHERE (
      c.type="${context.type}"
      AND (
        (NOT IS_DEFINED(c.ttl))
        OR c.ttl < 1
      )
    )
  `;

  try {

    const iterator = db.query(db.coll, query);
    const toArray  = promisify(iterator.toArray).bind(iterator);
    context.docs   = await toArray();

  } catch (e) {

    return catchError(req, res, next)(e);

  }

  // Set current doc and format it for rendering, if present

  const { cvid } = req.params;

  if (cvid) {

    context.doc = context.docs.find(d => d.cvid === Number(cvid));
    if (!context.doc) return next();

    const { doc } = context;

    // Create categories hash for rendering if applicable
    if (doc.categories) {

      doc.cats = {};

      context.categories
      .map(cat => cat.key)
      .forEach(cat => { doc.cats[cat] = false; });

      doc.categories.forEach(cat => { doc.cats[cat] = true; });

    }

    // Create competency hash for rendering if applicable
    if (doc.competency) {

      doc.comp = {
        advanced:               false,
        beginner:               false,
        intermediate:           false,
        'structural knowledge': false,
      };

      doc.comp[doc.competency] = true;

    }

  }

  // Sort docs

  context.docs.sort((a, b) => compare(a.title, b.title)
  || compare(a.name, b.name)
  || compare(a.organization, b.organization)
  || compare(a.location, b.location));

  // Render page

  res.render(`editor`, context);

};
