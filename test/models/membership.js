const Document = require('../../models/document');
const Membership = require('../../models/membership');

describe('Membership', function membershipSpec() {

  const data = {
    title: 'Membership Test',
    abbreviation: 'MT',
    extraProperty: 'This is an extra property.',
  };

  it('new Membership()', function newMembership() {

    const membership = new Membership(data);

    const noTitle = () => new Membership({});

    expect(membership instanceof Document).toBe(true);
    expect(membership instanceof Membership).toBe(true);
    expect(membership.extraProperty).toBeUndefined();
    expect(noTitle).toThrow();

  });

  it('Membership.prototype.abbreviation', function abbrAttr() {
    const membership = new Membership(data);
    const setBadAbbr = () => { membership.abbreviation = 'BAD ABBR'; };
    expect(setBadAbbr).toThrow();
    const newAbbr = 'NEWABBR';
    membership.abbreviation = newAbbr;
    expect(membership.abbreviation).toBe(newAbbr);
  });

  it('Membership.whitelist', function whitelistAttr() {

    const whitelist = Document.whitelist.concat([
      'abbreviation',
      'categories',
      'links',
      'title',
    ]);

    whitelist.forEach(attr => {
      expect(Membership.whitelist.includes(attr)).toBe(true);
    });

    const membership = new Membership(data);

    for (const attr in membership) {
      if (!whitelist.includes(attr)) fail(`The "${attr}" attribute is not whitelisted.`);
    }

  });

});
