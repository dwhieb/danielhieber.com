const Document = require('./document');

// private variable for the "date" getter/setter
let date;

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

    // generic subclass properties to be added
    const props = [
      'author',
      'categories',
      'links',
      'publication',
      'title',
    ];

    // set "type" attribute
    media.type = 'media';

    // instantiate the new Document
    super(media, props);

  }

  // getter for the "date" attribute
  get date() { return new Date(date); }

  // setter for the "date" attribute
  set date(val) {
    date = new Date(val).toJSON();
  }

  // whitelist of allowable properties in Media data
  static get whitelist() {
    return Document.whitelist.concat([
      'author',
      'categories',
      'date',
      'links',
      'publication',
      'title',
    ]);
  }

};

module.exports = Media;
