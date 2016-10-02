const Document = require('./document');

let email;

const Reference = class Reference extends Document {
  constructor(data) {

    // empty object for copying valid data to
    const ref = {};

    // required attributes
    const required = [
      'email',
      'name',
      'organization',
      'role',
    ];

    // check for required attributes
    required.forEach(attr => {
      if (!(attr in data)) throw new Error(`The "${attr}" attribute is required.`);
    });

    // copy whitelisted attributes
    Reference.whitelist.forEach(attr => {
      if (attr in data) ref[attr] = data[attr];
    });

    // set "type" attribute
    ref.type = 'reference';

    // instantiate the new Document object
    super(ref, ['links', 'name', 'organization', 'phone', 'role']);

  }

  // getter for the "email" attribute
  get email() { return email; }

  // setter for the "email" attribute
  set email(val) {

    // loose test for valid email address
    const emailRegexp = /.+@.+\..+/;

    if (typeof val === 'string' && emailRegexp.test(val)) {
      email = val;
      return email;
    }

    throw new Error('Invalid email address.');

  }

  // whitelist of allowable properties in the Reference data
  static get whitelist() {
    return Document.whitelist.concat([
      'email',
      'links',
      'name',
      'organization',
      'phone',
      'role',
    ]);
  }

};

module.exports = Reference;
