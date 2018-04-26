/* eslint-disable
  func-style,
  no-invalid-this
*/

const ExpressHandlebars = require('express-handlebars');
const handlebars        = require('handlebars');
const markdown          = require('./markdown');

// helpers (don't use arrow functions here, to preserve context)
function eq(a, b, opts) {
  if (a === b) return opts.fn(this);
}

function head(name, opts) {
  if (!this.head) this.head = {};
  this.head[name] = opts.fn(this);
  return null;
}

function isType(typesString = ``, opts) {
  const types = typesString.split(/[, ]+/);
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

const config = {
  defaultLayout: `main/index.hbs`,
  extname:       `hbs`,
  handlebars,
  helpers:       {
    eq,
    head,
    isType,
    md,
    section,
  },
  partialsDir: [
    `views/partials`,
    {
      dir:       `views/cv/components`,
      namespace: `cv`,
    },
  ],
};

const hbs = ExpressHandlebars.create(config);

module.exports = hbs;
