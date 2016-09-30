const Document = require('./document');

const Education = class Education extends Document {
  constructor(data) {

    const ed = {};

    const required = [
      'city',
      'endYear',
      'organization',
      'startYear',
    ];

    required.forEach(attr => {
      if (!(attr in data)) throw new Error(`The "${attr}" attribute is required.`);
    });

    Education.whitelist.forEach(attr => {
      if (attr in data) ed[attr] = data[attr];
    });

    ed.type = 'education';

    super(data, 'links');

    const minYear = 1986;
    const maxYear = 2100;

    const achievements = [];
    let city;
    let endYear;
    let org;
    let program;
    let startYear;

    Object.defineProperties(this, {

      achievements: {
        configurable: false,
        writable: false,
        get() { return Array.from(achievements); }, // don't return the actual achievements array
      },

      addAchievement: {
        value: ach => achievements.push(String(ach)),
        configurable: false,
        enumerable: false,
        writable: false,
      },

      city: {
        configurable: false,
        writable: true,
        get() { return city; },
        set(val) {
          city = String(val);
          return city;
        },
      },

      endYear: {
        configurable: false,
        writable: true,
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

      organization: {
        configurable: false,
        writable: true,
        get() { return org; },
        set(val) {
          org = String(val);
          return org;
        },
      },

      program: {
        configurable: false,
        writable: true,
        get() { return program; },
        set(val) {
          program = String(val);
          return program;
        },
      },

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

      startYear: {
        configurable: false,
        writable: true,
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

    this.city = data.city;
    this.endYear = data.endYear;
    this.organization = data.organization;
    this.startYear = data.startYear;

    if ('program' in data) this.program = data.program;

    if (Array.isArray(data.achievements)) {
      data.achievements.forEach(ach => this.addAchievement(ach));
    }

  }

  static get whitelist() {
    return Document.whitelist.concat([
      'achievements',
      'city',
      'endYear',
      'organization',
      'program',
      'startYear',
    ]);
  }

};

module.exports = Education;
