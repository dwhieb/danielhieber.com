/* eslint-disable
  func-style,
  no-invalid-this
*/

const Handlebars = require('express-handlebars');

// helpers (don't use arrow functions here, to preserve context)
function head(name, opts) {
  if (!this.head) this.head = {};
  this.head[name] = opts.fn(this);
  return null;
}

function section(name, opts) {
  if (!this.sections) this.sections = {};
  this.sections[name] = opts.fn(this);
  return null;
}

const config = {
  defaultLayout: `main/index.hbs`,
  extname:       `hbs`,
  helpers:       { head, section },
};

const hbs = Handlebars.create(config);

module.exports = hbs;
