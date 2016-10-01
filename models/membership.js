const Document = require('./document');

// storage variable for the getter/setter for the "abbreviation" attribute
let abbr;

const Membership = class Membership extends Document {
  constructor(data) {

    // empty object for copying valid data to
    const membership = {};

    // check for required "title" attribute
    if (!('title' in data)) throw new Error(`The "title" attribute is required.`);

    // copy whitelisted attributes
    Membership.whitelist.forEach(attr => {
      if (attr in data) membership[attr] = data[attr];
    });

    // set "type" attribute
    membership.type = 'membership';

    // instantiate the new Document
    super(membership, ['categories', 'links', 'title']);

  }

  // getter for the "abbreviation" attribute
  get abbreviation() { return abbr; }

  // setter for the "abbreviation" attribute
  set abbreviation(val) {
    if (typeof val === 'string' && val.match(/^\w+$/)) {
      abbr = val;
    }
    throw new Error(`The "abbreviation" attribute must be set to an alphanumeric string.`);
  }

  // whitelisted properties allowed in Media data
  static get whitelist() {
    return Document.whitelist.concat([
      'abbreviation',
      'categories',
      'links',
      'title',
    ]);
  }

};

module.exports = Membership;
