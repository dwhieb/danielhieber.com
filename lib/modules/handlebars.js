/* eslint-disable
  func-style,
  no-invalid-this
*/

const Handlebars = require('express-handlebars');

// helpers (don't use arrow functions here, to preserve context)
function section(name, opts) {
  if (!this.sections) this.sections = {};
  this.sections[name] = opts.fn(this);
  return null;
}

const config = {
  defaultLayout: `main`,
  extname:       `hbs`,
  helpers:       { section },
};

const hbs = Handlebars.create(config);

module.exports = hbs;
