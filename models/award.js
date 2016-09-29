const Document = require('./document');

/**
 * A class representing an Award
 * @type {Object}
 */
const Award = class Award extends Document {
  constructor(data = {}) {

    const award = {};

    const required = [
      'title',
      'year',
    ];

    Award.whitelist.forEach(attr => {
      if (attr in data) award[attr] = data[attr];
    });

    required.forEach(attr => {
      if (!(attr in award)) throw new Error(`The award data must include a "${attr}" attribute.`);
    });

    award.type = 'award';

    const props = [
      'categories',
      'description',
      'links',
      'title',
      'year',
    ];

    super(award, props);

  }

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
