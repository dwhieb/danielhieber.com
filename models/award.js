const Document = require('./document');

const Award = class Award extends Document {
  constructor(data = {}) {

    const award = {};

    Award.whitelist.forEach(attr => {
      if (attr in data) award[attr] = data[attr];
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
