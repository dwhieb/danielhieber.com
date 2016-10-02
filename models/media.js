const Document = require('./document');

const whitelist = [
  'author',
  'categories',
  'date',
  'links',
  'publication',
  'title',
];

const Media = class Media extends Document {
  constructor(data) {

    // an empty object for copying valid data to
    const media = {};

    // required attributes
    const required = [
      'author',
      'date',
      'publication',
      'title',
    ];

    // check for required attributes
    required.forEach(attr => {
      if (!(attr in data)) throw new Error(`The "${attr}" attribute is required.`);
    });

    // copy whitelisted attributes
    Media.whitelist.forEach(attr => {
      if (attr in data) media[attr] = data[attr];
    });

    // set "type" attribute
    media.type = 'media';

    // instantiate the new Document
    super(media, whitelist);

  }

  // whitelist of allowable properties in Media data
  static get whitelist() {
    return Document.whitelist.concat(whitelist);
  }

};

module.exports = Media;
