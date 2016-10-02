const Document = require('./document');

const whitelist = [
  'abbreviation',
  'categories',
  'endYear',
  'links',
  'organization',
  'role',
  'startYear',
];

const Service = class Service extends Document {
  constructor(data) {

    // empty object for copying valid data to
    const service = {};

    // required attributes
    const required = [
      'endYear',
      'organization',
      'role',
      'startYear',
    ];

    // check for required attributes
    required.forEach(attr => {
      if (!(attr in data)) throw new Error(`The "${attr}" attribute is required.`);
    });

    // copy whitelisted attributes
    Service.whitelist.forEach(attr => {
      if (attr in data) service[attr] = data[attr];
    });

    // set "type" attribute
    service.type = 'service';

    // instantiate the new Document object
    super(service, whitelist);

  }

  // whitelist of allowable properties in the Reference data
  static get whitelist() {
    return Document.whitelist.concat(whitelist);
  }

};

module.exports = Service;
