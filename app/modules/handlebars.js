/**
 * Handlebars configuration
 */

/* eslint-disable
  func-style,
  no-invalid-this
*/

const ExpressHandlebars = require('express-handlebars');
const handlebars        = require('handlebars');
const helpers           = require('handlebars-helpers');
const { join }          = require('path');
const lingRef           = require('ling-ref');
const { markdown }      = require('../../utilities');
const { readFileSync }  = require('fs');

// Extract necessary helpers from handlebars-helpers library
const { is, or } = helpers.comparison();
const { length } = helpers.array();

// Custom helpers (don't use arrow functions here, to preserve context)
function head(name, opts) {
  if (!this.head) this.head = {};
  this.head[name] = opts.fn(this);
  return null;
}

function isType(typesString = ``, opts) {
  const types = typesString.split(/[, ]+/u);
  if (types.includes(this.type)) return opts.fn(this);
}

function md(text, inline) {
  // eslint-disable-next-line new-cap
  if (!text) return ``;
  const method = inline === `inline` ? `renderInline` : `render`;
  return new handlebars.SafeString(markdown[method](text));
}

function section(name, opts) {
  if (!this.sections) this.sections = {};
  this.sections[name] = opts.fn(this);
  return null;
}

// Register the ling-ref partial
const path = join(process.cwd(), `node_modules/ling-ref/src/reference.hbs`);
const referenceTemplate = readFileSync(path, `utf8`);
handlebars.registerPartial(`reference`, referenceTemplate);

// Register the ling-ref helpers
lingRef(handlebars);

// Handlebars config
const config = {
  defaultLayout: `main/index.hbs`,
  extname:       `hbs`,
  handlebars,
  helpers:       {
    head,
    is,
    isType,
    length,
    md,
    or,
    section,
  },
  partialsDir: [
    `views/partials`,
    {
      dir:       `views/pages/cv/components`,
      namespace: `cv`,
    },
  ],
};

// Create the Express Handlebars instance
const hbs = ExpressHandlebars.create(config);

// Export Express Handlebars
module.exports = hbs;
