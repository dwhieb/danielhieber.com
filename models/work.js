const Document = require('./document');

const whitelist = [
  'achievements',
  'categories',
  'endYear',
  'links',
  'organization',
  'role',
  'startYear',
];

const Work = class Work extends Document {
  constructor(data) {

    // empty object for copying valid data to
    const work = {};

    // required attributes
    const required = [
      'organization',
      'role',
      'startYear',
    ];

    // check for required attributes
    required.forEach(attr => {
      if (!(attr in data)) throw new Error(`The "${attr}" attribute is required.`);
    });

    // copy whitelisted attributes
    Work.whitelist.forEach(attr => {
      if (attr in data) work[attr] = data[attr];
    });

    // set "type" attribute
    work.type = 'work';

    // instantiate the new Document object
    super(work, whitelist);

  }

  // whitelist of allowable properties in the Reference data
  static get whitelist() {
    return Document.whitelist.concat(whitelist);
  }

};

module.exports = Work;
