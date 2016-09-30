const Document = require('./document');

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
      'endYear',
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

    // instantiate a document
    super(ed, 'links');

    const minYear = 1986; // earliest year possible for "startYear" and "endYear"
    const maxYear = 2100; // latest year possible for "startYear" and "endYear"

    // private variables for getters/setters
    const achievements = [];
    let endYear = 0;
    let org = '';
    let program = '';
    let startYear = 0;

    // Define the non-configurable properties
    Object.defineProperties(this, {

      // getter for the "achievements" attribute
      achievements: {
        configurable: false,
        enumerable: true,
        get() { return Array.from(achievements); }, // don't return the actual achievements array
      },

      // adds an achievement to the "achievements" array
      addAchievement: {
        value: ach => achievements.push(String(ach)),
        configurable: false,
        enumerable: false,
        writable: false,
      },

      // define the "endYear" attribute (may be an integer, string, or null)
      endYear: {
        configurable: false,
        enumerable: true,
        get() { return endYear; },
        set(val) {

          if (
            (Number.isInteger(val) && minYear <= val && val <= maxYear)
            || (typeof val === 'string' && val === 'present')
            || val === null
          ) {
            endYear = val;
            return endYear;
          }

          throw new Error('The "endYear" attribute is incorrectly formatted.');

        },
      },

      // define the "organization" attribute
      organization: {
        configurable: false,
        enumerable: true,
        get() { return org; },
        set(val) {
          org = String(val);
          return org;
        },
      },

      // define the "program" attribute
      program: {
        configurable: false,
        enumerable: true,
        get() { return program; },
        set(val) {
          program = String(val);
          return program;
        },
      },

      // removes an achivement from the "achivements" array
      removeAchievement: {
        value: val => {
          const i = achievements.indexOf(val);
          if (i >= 0) return achievements.splice(i, 1);
          return false;
        },
        configurable: false,
        enumerable: false,
        writable: false,
      },

      // define the "startYear" attribute
      startYear: {
        configurable: false,
        enumerable: true,
        get() { return startYear; },
        set(val) {
          if (Number.isInteger(val) && minYear <= val && val <= maxYear) {
            startYear = val;
            return startYear;
          }
          throw new Error('The "startYear" attribute must be an integer from `1986` to `2100`.');
        },
      },

    });

    // initialize the values of each of the above properties
    this.endYear = data.endYear;
    this.organization = data.organization;
    this.startYear = data.startYear;

    if ('program' in data) this.program = data.program;

    if (Array.isArray(data.achievements)) {
      data.achievements.forEach(ach => this.addAchievement(ach));
    }

  }

  /**
   * Gets the array of allowable properties for the Education class
   * @method whitelist
   * @return {Array} whitelist        Returns the array of allowable properties
   */
  static get whitelist() {
    return Document.whitelist.concat([
      'achievements',
      'endYear',
      'organization',
      'program',
      'startYear',
    ]);
  }

};

module.exports = Education;
