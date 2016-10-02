const Document = require('./document');

const Publication = class Publication extends Document {
  constructor(data) {

    // empty object for copying valid data to
    const pub = {};

    // required attributes
    const required = [
      'date',
      'description',
      'pubType',
      'title',
    ];

    // check for required attributes
    required.forEach(attr => {
      if (!(attr in data)) throw new Error(`The "${attr}" attribute is required.`);
    });

    // copy whitelisted attributes
    Publication.whitelist.forEach(attr => {
      if (attr in data) pub[attr] = data[attr];
    });

    // set "type" attribute
    pub.type = 'publication';

    // instantiate the new Document object
    super(pub, ['categories', 'date', 'description', 'links', 'title']);

    const pubTypes = [
      'edited',
      'non-linguistic',
      'online',
      'peer-reviewed',
      'presentation',
      'project',
      'review',
      'unpublished',
    ];

    if (!pubTypes.includes(pub.pubType)) {
      throw new Error('Invalid value for the "pubType" attribute.');
    }

    const pubType = pub.pubType;

    Object.defineProperty(this, 'pubType', {
      configurable: false,
      enumerable: true,
      get() { return pubType; },
    });

  }

  static get whitelist() {
    return Document.whitelist.concat([
      'categories',
      'date',
      'description',
      'html',
      'links',
      'markdown',
      'pubType',
      'title',
    ]);
  }

};

module.exports = Publication;
