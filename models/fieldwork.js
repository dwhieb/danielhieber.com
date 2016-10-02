const Document = require('./document');

// properties to add to this subclass
const props = [
  'categories',
  'description',
  'endYear',
  'location',
  'startYear',
];

/**
 * A class representing a Fieldwork experience
 * @type {Object}
 * @class
 */
const Fieldwork = class Fieldwork extends Document {
  /**
   * Create a new Fieldwork instance
   * @param {Object} data     The data to populate the instance with
   */
  constructor(data) {

    // required attributes
    const required = [
      'description',
      'endYear',
      'location',
      'startYear',
    ];

    // an empty fieldwork object to copy data to
    const fw = {};

    // check for required attributes
    required.forEach(attr => {
      if (!(attr in data)) throw new Error(`The "${attr}" attribute is required.`);
    });

    // copy whitelisted attributes
    Fieldwork.whitelist.forEach(attr => {
      if (attr in data) fw[attr] = data[attr];
    });

    // set type to "fieldwork"
    fw.type = 'fieldwork';

    // instantiate a document
    super(fw, props);

  }

  /**
   * A list of allowable properties for a Fieldwork item
   * @method whitelist
   * @return {Array} whitelist      Returns the allowed properties for a Fieldwork item
   */
  static get whitelist() {
    return Document.whitelist.concat(props).concat([
      'categories',
      'description',
      'endYear',
      'html',
      'location',
      'markdown',
      'startYear',
    ]);
  }

};

module.exports = Fieldwork;
