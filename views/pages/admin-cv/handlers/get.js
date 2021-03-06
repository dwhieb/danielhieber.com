/**
 * GET handler for the CV Editor
 */

/* eslint-disable
  max-statements,
  no-shadow,
  no-underscore-dangle,
*/

const { db }        = require('../../../../services');
const { promisify } = require('util');
const { CVTypes }   = require('../../../../constants');

const {
  capitalize,
  catchError,
  compare,
} = require('../../../../utilities');

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

  const { type } = CVTypes[req.params.type];
  if (!type) return res.error.badRequest(`Invalid CV type.`);

  // Create rendering context for Handlebars

  const context = {
    admin:      true,
    'admin-cv': true,
    coll:       req.params.type,
    csrf:       req.csrfToken(),
    CVTypes,
    header:     false,
    id:         `admin-cv`,
    pageTitle:  `CV Editor`,
    type,
    Type:       capitalize(req.params.type),
  };

  // Retrieve categories

  if (typesWithCategories.includes(type)) {

    try {
      context.categories = await db.getByType(`category`);
    } catch (e) {
      return catchError(req, res, next)(e);
    }

  }

  // Retrieve docs

  try {
    context.docs = await db.getByType(context.type);
  } catch (e) {
    return catchError(req, res, next)(e);
  }

  // Set current doc, format it for rendering, and retrieve attachments

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

    // Convert date
    if (doc.date) doc.date = new Date(doc.date).toISOString().slice(0, 10);

    // Copy markdown to description
    // TODO: Remove this when new site is launced (issue #384)
    if (doc.markdown && !doc.description) doc.description = doc.markdown;

    // Set ongoing attribute if endYear is `present`
    if (doc.endYear === `present` && !(`ongoing` in doc)) doc.ongoing = true;

    // Retrieve attachments
    if (doc.type === `publication`) {

      try {

        const iterator = db.getAttachments(doc._self);
        const toArray  = promisify(iterator.toArray).bind(iterator);
        context.files  = await toArray();

      } catch (e) {

        return catchError(req, res, next)(e);

      }

    }

  }

  // Sort docs

  context.docs.sort((a, b) => compare(a.title, b.title)
  || compare(a.name, b.name)
  || compare(a.organization, b.organization)
  || compare(a.location, b.location));

  // Render page

  res.render(`admin-cv`, context);

};
