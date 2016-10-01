const Document = require('./document');

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
    super(membership, ['abbreviation', 'categories', 'links', 'title']);

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
