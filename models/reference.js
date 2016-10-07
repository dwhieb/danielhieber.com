const Document = require('./document');

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

    let email;

    Object.defineProperty(this, 'email', {
      configurable: false,
      enumerable: true,
      get: () => email,
      set: val => {

        // loose test for valid email address
        const emailRegexp = /.+@.+\..+/;

        if (typeof val === 'string' && emailRegexp.test(val)) {
          email = val;
          return email;
        }

        throw new Error('Invalid email address.');

      },
    });

    this.email = ref.email;

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
