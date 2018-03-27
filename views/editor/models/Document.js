const typesMap = require('../types');

const descriptor = {
  configurable: false,
  enumerable:   true,
  writable:     false,
};

const types = Object.values(typesMap);

module.exports = class Document {

  constructor({
    abbreviation,
    achievements,
    cvid,
    id,
    type,
  } = {}) {

    // Validation

    // Abbreviation
    if (typeof abbreviation !== `undefined` && !/^[A-Za-z]*$/.test(abbreviation)) {
      throw new TypeError(`abbreviation must be a properly-formatted abbreviation.`);
    }

    // Achievements
    if (typeof achievements !== `undefined` && !Array.isArray(achievements)) {
      throw new TypeError(`achievements must be an array.`);
    }

    // CVID (required)
    if (!Number.isInteger(cvid)) {
      throw new TypeError(`cvid must be an Integer.`);
    }

    // ID (required)
    if (typeof id !== `undefined` && typeof id !== `string`) {
      throw new TypeError(`id must be a String.`);
    }

    // Type (required)
    if (!types.includes(type)) {
      throw new TypeError(`Invalid type attribute.`);
    }

    // Assign properties

    Object.defineProperties(this, {
      cvid: Object.assign({ value: cvid }, descriptor),
      type: Object.assign({ value: type }, descriptor),
    });

    if (typeof abbreviation === `string`) this.abbreviation = abbreviation;
    if (achievements) this.achievements = achievements;
    if (id) this.id = id;

  }

  set id(value) {
    Object.defineProperty(this, `id`, Object.assign({ value }, descriptor));
  }

};
