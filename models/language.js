const Document = require('./document');

/**
 * A class representing a research Language
 * @type {Object}
 * @class
 */
const Language = class Language extends Document {
  /**
   * Create a new research Language item
   * @param {Object} data         The data to populate the Language item with
   */
  constructor(data) {

    // required attributes
    const required = [
      'autonym',
      'competency',
      'title',
    ];

    // an empty language object to copy valid data to
    const lang = {};

    // check for required attributes
    required.forEach(attr => {
      if (!(attr in data)) throw new Error(`The "${attr}" attribute is required.`);
    });

    // copy whitelisted attributes
    Language.whitelist.forEach(attr => {
      if (attr in data) lang[attr] = data[attr];
    });

    // set type to "language"
    lang.type = 'language';

    // instantiate a new Document
    super(lang, ['categories', 'links', 'title']);

    // variables for getters/setters to store their values in
    let autonym;
    let competency;

    // allowed values for the "competency" attribute
    const competencyWhitelist = [
      'beginner',
      'intermediate',
      'advanced',
      'structural knowledge',
    ];

    Object.defineProperties(this, {

      // define the "autonym" attribute
      autonym: {
        configurable: false,
        enumerable: true,
        get() { return autonym; },
        set(val) {
          autonym = String(val);
          return autonym;
        },
      },

      // define the "competency" attribute
      competency: {
        configurable: false,
        enumerable: true,
        get() { return competency; },
        set(val) {
          const comp = val.toLowerCase(); // "competency" attribute is always lowercase
          if (competencyWhitelist.includes(comp)) {
            competency = comp;
            return competency;
          }
          throw new Error(`Invalid value for the "competency" attribute.`);
        },
      },

    });

    // set initial values for the "autonym" and "competency" attributes
    this.autonym = lang.autonym;
    this.competency = lang.competency;

  }

  /**
   * The whitelist of attributes allowed on the Language object
   * @method whitelist
   * @return {Array} whitelist      Returns an array of whitelisted attributes
   */
  static get whitelist() {
    return Document.whitelist.concat([
      'autonym',
      'categories',
      'competency',
      'links',
      'title',
    ]);
  }

};

module.exports = Language;
