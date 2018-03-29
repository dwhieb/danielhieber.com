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
    description,
    email,
    endYear,
    forthcoming,
    hidden,
    id,
    key,
    links,
    location,
    name,
    ongoing,
    type,
  } = {}) {

    // Validation

    // Language Fields (autonym, competency)
    if (type === `language`) {

      // Autonym
      if (typeof autonym !== `string`) {
        throw new TypeError(`autonym must be a String.`);
      }

      // Competency
      if (!competencies.includes(competency)) {
        throw new TypeError(`Invalid competency.`);
      }

    }

    // Reference Fields (email, name, phone)
    if (type === `reference`) {

      // Email
      if (typeof email !== `string`) {
        throw new TypeError(`email must be a String.`);
      }

      // Name
      if (typeof name !== `string`) {
        throw new TypeError(`name must be a String.`);
      }

    }

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

    // Categories
    if (typeof categories !== `undefined` && !Array.isArray(categories) && typeof categories !== `string`) {
      throw new TypeError(`categories must be a String or Array of Strings.`);
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

    // Description
    if (typeof description !== `undefined` && typeof description !== `string`) {
      throw new TypeError(`description must be a String.`);
    }

    // End Year & Ongoing
    if (
      type === `education`
      || type === `fieldwork`
      || type === `service`
      || type === `work`
    ) {

      if (!(endYear || ongoing)) {
        throw new Error(`Either the endYear or ongoing field is required.`);
      }

      if (endYear && !isDate(endYear)) {
        throw new TypeError(`endYear must be a properly-formatted date String.`);
      }

    }

    // ID (may not be present on a doc if it hasn't been added to the database)
    if (typeof id !== `undefined` && typeof id !== `string`) {
      throw new TypeError(`id must be a String.`);
    }

    // Key
    if ((type === `category` || type === `publication`) && typeof key !== `string`) {
      throw new TypeError(`key must be a String`);
    }

    // Links
    if (typeof links !== `object`) {
      throw new TypeError(`links must be an Object.`);
    }

    // Location
    if ((type === `education` || type === `fieldwork`) && typeof location !== `string`) {
      throw new TypeError(`location must be a String.`);
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

    this.hidden = Boolean(hidden);
    if (typeof abbreviation === `string`) this.abbreviation = abbreviation;
    if (achievements) this.achievements = achievements;
    if (author) this.author = author;
    if (autonym) this.autonym = autonym;
    if (categories) this.categories = Array.isArray(categories) ? categories : [categories];
    if (competency) this.competency = competency;
    if (email) this.email = email;
    if (id) this.id = id;
    if (key) this.key = key;
    if (location) this.location = location;
    if (name) this.name = name;

    // Links
    this.links = {};

    Object.entries(links).forEach(([linkType, url]) => {
      if (url) this.links[linkType] = url;
    });

    // Description
    if (typeof description === `string`) {
      this.description = description;
      this.markdown    = description; // TODO: Remove this line when new site launches
    }

    // Date & Forthcoming
    if (type === `media` || type === `publication`) {
      // NB: Leave date undefined if it doesn't exist,
      // so it doesn't overwrite date on doc
      if (date) this.date = new Date(date);
      this.forthcoming    = Boolean(forthcoming);
    }

    // End Year & Ongoing
    if (
      type === `education`
      || type === `fieldwork`
      || type === `service`
      || type === `work`
    ) {
      // NB: Leave endYear undefined if it doesn't exist
      // so it doesn't ovewrite date on doc
      if (endYear) this.endYear = Number(endYear);
      this.ongoing              = Boolean(ongoing);
    }

  }

  set id(value) {
    Object.defineProperty(this, `id`, Object.assign({ value }, descriptor));
  }

};
