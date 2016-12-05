const Document = require('./document');

const whitelist = [
  'achievements',
  'endYear',
  'links',
  'location',
  'organization',
  'program',
  'startYear',
];

/**
 * A class representing an Education item
 * @type {Object}
 * @class
 */
const Education = class Education extends Document {
  /**
   * Create a new instance of an Education item
   * @param {Object} data         The data to populate the Education item with
   */
  constructor(data) {

    // create an empty education object to copy data into
    const ed = {};

    // required attributes
    const required = [
      'location',
      'organization',
      'startYear',
    ];

    // check for required attributes
    required.forEach(attr => {
      if (!(attr in data)) throw new Error(`The "${attr}" attribute is required.`);
    });

    // copy whitelisted attributes
    Education.whitelist.forEach(attr => {
      if (attr in data) ed[attr] = data[attr];
    });

    // set document type to "education"
    ed.type = 'education';
    ed.endYear = ed.endYear || '';

    // instantiate a document
    super(ed, whitelist);

  }

  /**
   * Gets the array of allowable properties for the Education class
   * @method whitelist
   * @return {Array} whitelist        Returns the array of allowable properties
   */
  static get whitelist() {
    return Document.whitelist.concat(whitelist);
  }

};

module.exports = Education;
