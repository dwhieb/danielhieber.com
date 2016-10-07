const Document = require('./document');

const Proficiency = class Proficiency extends Document {
  constructor(data) {

    // empty object for copying valid data to
    const prof = {};

    // required attributes
    const required = [
      'proficiencyType',
      'title',
    ];

    // check for required attributes
    required.forEach(attr => {
      if (!(attr in data)) throw new Error(`The "${attr}" attribute is required.`);
    });

    // copy whitelisted attributes
    Proficiency.whitelist.forEach(attr => {
      if (attr in data) prof[attr] = data[attr];
    });

    // set "type" attribute
    prof.type = 'proficiency';

    // instantiate the new Document object
    super(prof, ['categories', 'links', 'title']);

    let profType;

    Object.defineProperty(this, 'proficiencyType', {
      configurable: false,
      enumerable: true,
      get: () => profType,
      set: val => {
        if (val === 'software' || val === 'skill') {
          profType = val;
          return profType;
        }
        throw new Error(`The "proficiencyType" attribute must be set to "software" or "skill".`);
      },
    });

    this.proficiencyType = prof.proficiencyType;

  }

  // whitelist of allowable properties in Proficiency data
  static get whitelist() {
    return Document.whitelist.concat([
      'categories',
      'links',
      'proficiencyType',
      'title',
    ]);
  }

};

module.exports = Proficiency;
