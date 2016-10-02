const Document = require('../../models/document');
const Reference = require('../../models/reference');

describe('Reference', function ReferenceSpec() {

  const data = {
    name:             'Daniel W. Hieber',
    organization:     'University of California, Santa Barbara',
    role:             'Graduate Student in Linguistics',
    email:            'dhieber@umail.ucsb.edu',
    links: {
      homepage:       'http://danielhieber.com',
      'academia.edu': 'https://discuss.runkit.com/t/customizing-your-npm-packages-page-on-tonic/23',
    },
    extraProperty:    'This is an extra property.',
  };

  it('new Reference()', function newRef() {

    const ref = new Reference(data);

    const noEmail = () => {
      const testData = Object.assign({}, data);
      delete testData.email;
      new Reference(testData);
    };
    const noName = () => {
      const testData = Object.assign({}, data);
      delete testData.name;
      new Reference(testData);
    };
    const noOrg = () => {
      const testData = Object.assign({}, data);
      delete testData.organization;
      new Reference(testData);
    };
    const noRole = () => {
      const testData = Object.assign({}, data);
      delete testData.role;
      new Reference(testData);
    };
    const noPhone = () => {
      const testData = Object.assign({}, data);
      delete testData.phone;
      new Reference(testData);
    };

    expect(ref instanceof Document).toBe(true);
    expect(ref instanceof Reference).toBe(true);
    expect(ref.type).toBe('reference');
    expect(ref.extraProperty).toBeUndefined();
    expect(ref.links).toBeDefined();
    expect(ref.name).toBeDefined();
    expect(ref.organization).toBeDefined();
    expect(ref.role).toBeDefined();
    expect(noEmail).toThrow();
    expect(noName).toThrow();
    expect(noOrg).toThrow();
    expect(noRole).toThrow();
    expect(noPhone).not.toThrow();

  });

  it('Reference.prototype.email', function emailAttr() {

    const ref = new Reference(data);
    const newEmail = 'email@domain.com';
    const setBadEmail = () => { ref.email = 'bad'; };

    expect(ref.email).toBe(data.email);
    expect(setBadEmail).toThrow();

    ref.email = newEmail;
    expect(ref.email).toBe(newEmail);

  });

  it('Reference.whitelist', function whitelistAttr() {

    const whitelist = Document.whitelist.concat([
      'email',
      'links',
      'name',
      'organization',
      'phone',
      'role',
    ]);

    whitelist.forEach(attr => {
      expect(Reference.whitelist.includes(attr)).toBe(true);
    });

    const ref = new Reference(data);

    for (const attr in ref) {
      if (!whitelist.includes(attr)) fail(`The "${attr}" attribute is not whitelisted.`);
    }

  });

});
