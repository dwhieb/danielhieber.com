const Document = require('./document');

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

    // generic properties to add to the Service object
    const props = [
      'abbreviation',
      'categories',
      'endYear',
      'links',
      'organization',
      'role',
      'startYear',
    ];

    // instantiate the new Document object
    super(service, props);

  }

  // whitelist of allowable properties in the Reference data
  static get whitelist() {
    return Document.whitelist.concat([
      'abbreviation',
      'categories',
      'endYear',
      'links',
      'organization',
      'role',
      'startYear',
    ]);
  }

};

module.exports = Service;
