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
      'location',
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
    super(ed, ['endYear', 'links', 'location', 'startYear']);

    // private variables for getters/setters
    const achievements = [];
    let org;
    let program;

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

    });

    // initialize the values of each of the above properties
    this.organization = data.organization;

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
      'links',
      'location',
      'organization',
      'program',
      'startYear',
    ]);
  }

};

module.exports = Education;
