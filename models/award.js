const Document = require('./document');

class Award extends Document {
  constructor(data = {}) {

    const doc = {};

    super(doc);

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
