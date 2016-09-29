const Document = require('./document');

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

    super(award);

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
