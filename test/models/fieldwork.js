const Document = require('../../models/document');
const Fieldwork = require('../../models/fieldwork');

describe('Fieldwork', function FieldworkSpec() {

  const data = {
    categories: ['documentation'],
    description: 'This is a description of my fieldwork.',
    endYear: 2017,
    startYear: 2016,
    location: 'Santa Barbara, CA',
    extraProperty: 'This is an extra property.',
  };

  it('new Fieldwork()', function newFieldwork() {

    const fw = new Fieldwork(data);
    expect(fw instanceof Document).toBe(true);
    expect(fw instanceof Fieldwork).toBe(true);
    expect(fw.type).toBe('fieldwork');
    expect(fw.extraProperty).toBeUndefined();

  });

  it('Fieldwork.whitelist', function whitelistAttr() {

    const whitelist = Document.whitelist.concat([
      'categories',
      'description',
      'endYear',
      'html',
      'location',
      'markdown',
      'startYear',
    ]);

    whitelist.forEach(attr => {
      expect(Fieldwork.whitelist.includes(attr)).toBe(true);
    });

    const fw = new Fieldwork(data);

    for (const attr in fw) {
      if (!whitelist.includes(attr)) fail(`The "${attr}" attribute is not whitelisted.`);
    }

  });

});
