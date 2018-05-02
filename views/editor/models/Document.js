/* eslint-disable
  max-statements,
*/

const { CVTypes, pubTypes } = require('../../../constants');

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

const publicationTypes = Object.keys(pubTypes);

const types = Object.entries(CVTypes).map(([, { type }]) => type);

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
    organization,
    phone,
    proficiencyType,
    program,
    publication,
    publicationType,
    role,
    startYear,
    title,
    type,
    year,
  } = {}) {


    // Validation for new documents

    // CVID (required for all docs)
    if (!Number.isInteger(cvid)) {
      throw new TypeError(`cvid must be an Integer.`);
    }

    // ID (may not be present on a doc if it hasn't been added to the database)
    if (typeof id !== `undefined` && (typeof id !== `string` || !id.length)) {
      throw new TypeError(`id must be a non-empty String.`);
    }

    // Type (required for all docs)
    if (!types.includes(type)) {
      throw new TypeError(`Invalid type attribute.`);
    }


    // Validation for updated documents

    if (id) {

      // Language Fields (autonym, competency)
      if (type === `language`) {

        // Autonym
        if (typeof autonym !== `string` || !autonym.length) {
          throw new TypeError(`autonym must be a non-empty String.`);
        }

        // Competency
        if (!competencies.includes(competency)) {
          throw new TypeError(`Invalid competency.`);
        }

      }

      // Media Fields (author, publication)
      if (type === `media`) {

        // Author
        if (typeof author !== `string` || !author.length) {
          throw new TypeError(`author must be a non-empty String.`);
        }

        // Publication
        if (typeof publication !== `string` || !publication.length) {
          throw new TypeError(`publication must be a non-empty String.`);
        }

      }

      // Reference Fields (email, name, phone)
      if (type === `reference`) {

        // Email
        if (typeof email !== `string` || !email.length) {
          throw new TypeError(`email must be a non-empty String.`);
        }

        // Name
        if (typeof name !== `string` || !name.length) {
          throw new TypeError(`name must be a non-empty String.`);
        }

        // Phone Number
        if (typeof phone !== `string`) {
          throw new TypeError(`phone must be a String.`);
        }

      }

      // Abbreviation
      if ((type === `membership` || type === `service`) && !/^[A-Za-z]*$/.test(abbreviation)) {
        throw new TypeError(`abbreviation must be a properly-formatted abbreviation.`);
      }

      // Achievements
      if (
        (type === `education` || type === `work`)
        && typeof achievements !== `undefined`
        && !(Array.isArray(achievements) || typeof achievements === `string`)
      ) {
        throw new TypeError(`achievements must be an Array.`);
      }

      // Categories
      if (typeof categories !== `undefined` && !Array.isArray(categories) && typeof categories !== `string`) {
        throw new TypeError(`categories must be a String or Array of Strings.`);
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

      // Key
      const keyRegExp = /^[-A-Za-z0-9]+$/;

      if ((type === `category` || type === `publication`) && !keyRegExp.test(key)) {
        throw new TypeError(`key must be properly-formatted String.`);
      }

      // Links
      if (typeof links !== `object`) {
        throw new TypeError(`links must be an Object.`);
      }

      // Location
      if ((type === `education` || type === `fieldwork`) && (typeof location !== `string` || !location.length)) {
        throw new TypeError(`location must be a non-empty String.`);
      }

      // Organization
      if (typeof organization !== `undefined` && (typeof organization !== `string` || !organization.length)) {
        throw new TypeError(`organization must be a non-empty String.`);
      }

      // Proficiency Type
      if (type === `proficiency` && !(proficiencyType === `skill` || proficiencyType === `software`)) {
        throw new TypeError(`proficiencyType must be set to 'skill' or 'software'.`);
      }

      // Program
      if (type === `education` && typeof program !== `string`) {
        throw new TypeError(`program must be a String.`);
      }

      // Publication Type
      if (type === `publication` && !publicationTypes.includes(publicationType)) {
        throw new TypeError(`Invalid publicationType.`);
      }

      // Role
      if (
        (type === `course`
        || type === `reference`
        || type === `service`)
        && (typeof role !== `string`
        || !role.length)
      ) {
        throw new TypeError(`role must be a non-empty String.`);
      }

      // Start Year
      if (
        (type === `education`
        || type === `fieldwork`
        || type === `service`
        || type === `work`)
        && !Number.isInteger(Number(startYear))
      ) {
        throw new TypeError(`startYear must be an Integer.`);
      }

      // Title
      if (typeof title !== `undefined` && !(typeof title === `string` && title.length)) {
        throw new TypeError(`title must be a non-empty String.`);
      }

      // Year
      if (type === `award` && !Number.isInteger(Number(year))) {
        throw new TypeError(`year must be an Integer.`);
      }

    }

    // Assign properties

    Object.defineProperties(this, {
      cvid: Object.assign({ value: cvid }, descriptor),
      type: Object.assign({ value: type }, descriptor),
    });

    this.hidden = Boolean(hidden);
    if (typeof abbreviation === `string`) this.abbreviation = abbreviation;
    if (author) this.author = author;
    if (autonym) this.autonym = autonym;
    if (categories) this.categories = Array.isArray(categories) ? categories : [categories];
    if (competency) this.competency = competency;
    if (email) this.email = email;
    if (id) this.id = id;
    if (key) this.key = key;
    if (location) this.location = location;
    if (name) this.name = name;
    if (organization) this.organization = organization;
    if (typeof phone === `string`) this.phone = phone;
    if (proficiencyType) this.proficiencyType = proficiencyType;
    if (typeof program === `string`) this.program = program;
    if (publication) this.publication = publication;
    if (publicationType) this.publicationType = publicationType;
    if (role) this.role = role;
    if (typeof startYear !== `undefined`) this.startYear = Number(startYear);
    if (title) this.title = title;
    if (typeof year !== `undefined`) this.year = Number(year);

    // Achievements
    if (type === `education` || type === `work`) {
      if (achievements) this.achievements = Array.isArray(achievements) ? achievements : [achievements];
      else this.achievements = [];
    }

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

    // Links
    if (links) {

      this.links = {};

      Object.entries(links).forEach(([linkType, url]) => {
        if (url) this.links[linkType] = url;
      });

    }

  }

  set id(value) {
    Object.defineProperty(this, `id`, Object.assign({ value }, descriptor));
  }

};
