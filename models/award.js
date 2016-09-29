const Document = require('./document');

/**
 * A class representing an Award
 * @type {Object}
 */
const Award = class Award extends Document {
  constructor(data = {}) {

    // create an empty object to copy data over to
    const award = {};

    // required attributes
    const required = [
      'title',
      'year',
    ];

    // copy whitelisted attributes
    Award.whitelist.forEach(attr => {
      if (attr in data) award[attr] = data[attr];
    });

    // check for required attributes
    required.forEach(attr => {
      if (!(attr in award)) throw new Error(`The award data must include a "${attr}" attribute.`);
    });

    // set document type to "award"
    award.type = 'award';

    // the list of preset properties to use
    const props = [
      'categories',
      'description',
      'links',
      'title',
      'year',
    ];

    // instantiate the new document
    super(award, props);

  }

  // the allowable properties for this model
  static get whitelist() {
    return Document.whitelist.concat([
      'categories',
      'description',
      'links',
      'title',
      'year',
    ]);
  }

};

module.exports = Award;
