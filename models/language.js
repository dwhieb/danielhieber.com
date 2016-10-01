const Document = require('./document');

const Language = class Language extends Document {
  constructor(data) {

    const required = [
      'autonym',
      'competency',
      'title',
    ];

    const lang = {};

    required.forEach(attr => {
      if (!(attr in data)) throw new Error(`The "${attr}" attribute is required.`);
    });

    Language.whitelist.forEach(attr => {
      if (attr in data) lang[attr] = data[attr];
    });

    lang.type = 'language';

    super(lang, ['categories', 'links', 'title']);

    let autonym;
    let competency;

    const competencyWhitelist = [
      'beginner',
      'intermediate',
      'advanced',
      'structural knowledge',
    ];

    Object.defineProperties(this, {

      autonym: {
        configurable: false,
        enumerable: true,
        get() { return autonym; },
        set(val) {
          autonym = String(val);
          return autonym;
        },
      },

      competency: {
        configurable: false,
        enumerable: true,
        get() { return competency; },
        set(val) {
          if (competencyWhitelist.includes(val)) {
            competency = val;
            return competency;
          }
          throw new Error(`Invalid value for the "competency" attribute.`);
        },
      },

    });

  }

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
