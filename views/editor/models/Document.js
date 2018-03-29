/* eslint-disable
  max-statements,
*/

const typesMap = require('../types');

// Constants
const competencies = [
  `beginner`,
  `intermediate`,
  `advanced`,
  `structural knowledge`,
];

const descriptor = {
  configurable: false,
  enumerable:   true,
  writable:     false,
};

const types = Object.values(typesMap);

// Utilities
const isDate = dateString => Boolean(Date.parse(dateString));

module.exports = class Document {

  constructor({
    abbreviation,
    achievements,
    author,
    autonym,
    categories,
    competency,
    cvid,
    date,
    forthcoming,
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

    // Competency
    if (type === `language` && !competencies.includes(competency)) {
      throw new TypeError(`Invalid competency.`);
    }

    // CVID (required for all docs)
    if (!Number.isInteger(cvid)) {
      throw new TypeError(`cvid must be an Integer.`);
    }

    // Date & Forthcoming
    if (type === `media` || type === `publication`) {

      if (!(date || forthcoming)) {
        throw new Error(`Either the date or forthcoming field is required.`);
      }

      if (date && !isDate(date)) {
        throw new TypeError(`date must be a properly-formatted date String.`);
      }

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
    if (competency) this.competency = competency;
    if (id) this.id = id;

    if (type === `media` || type === `publication`) {
      // NB: Leave date undefined if it doesn't exist,
      // so it doesn't overwrite date on doc
      if (date) this.date = new Date(date);
      this.forthcoming    = Boolean(forthcoming);
    }

  }

  set id(value) {
    Object.defineProperty(this, `id`, Object.assign({ value }, descriptor));
  }

};
