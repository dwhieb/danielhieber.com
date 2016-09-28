const Document = require('./document');

const Award = class Award extends Document {
  constructor(data = {}) {

    const award = {};

    super(award);

  }

  static get whitelist() {
    return Document.whitelist.concat([
      'title',
      'description',
      'categories',
      'links',
      'year',
    ]);
  }

}

module.exports = Award;
