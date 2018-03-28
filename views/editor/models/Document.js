/* eslint-disable
  max-statements,
*/

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
    author,
    autonym,
    categories,
    cvid,
    id,
    type,
  } = {}) {

    // Validation

    // Abbreviation
    if ((type === `membership` || type === `service`) && !/^[A-Za-z]*$/.test(abbreviation)) {
      throw new TypeError(`abbreviation must be a properly-formatted abbreviation.`);
    }

    // Achievements
    if ((type === `education` || type === `work`) && !Array.isArray(achievements)) {
      throw new TypeError(`achievements must be an Array.`);
    }

    // Author
    if (type === `media` && typeof author !== `string`) {
      throw new TypeError(`author must be a String.`);
    }

    // Autonym
    if (type === `language` && typeof autonym !== `string`) {
      throw new TypeError(`autonym must be a String.`);
    }

    // Categories
    if (typeof categories !== `undefined` && !Array.isArray(categories) && typeof categories !== `string`) {
      throw new TypeError(`categories must be a String or Array of Strings.`);
    }

    // CVID (required for all docs)
    if (!Number.isInteger(cvid)) {
      throw new TypeError(`cvid must be an Integer.`);
    }

    // ID (may not be present on a doc if it hasn't been added to the database)
    if (typeof id !== `undefined` && typeof id !== `string`) {
      throw new TypeError(`id must be a String.`);
    }

    // Type (required for all docs)
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
    if (author) this.author = author;
    if (autonym) this.autonym = autonym;
    if (categories) this.categories = Array.isArray(categories) ? categories : [categories];
    if (id) this.id = id;

  }

  set id(value) {
    Object.defineProperty(this, `id`, Object.assign({ value }, descriptor));
  }

};
