const Document = require('../../models/document');
const Publication = require('../../models/publication');

describe('Publication', function PubSpec() {

  const data = {
    date: '10-1-2016',
    description: 'Citation here.',
    pubType: 'peer-reviewed',
    title: 'A typology of lexical flexibility',
  };

  it('new Publication()', function newPub() {

    const pub = new Publication(data);

    const noDate = () => {
      const testData = Object.assign({}, data);
      delete testData.date;
      new Publication(testData);
    };
    const noDescription = () => {
      const testData = Object.assign({}, data);
      delete testData.description;
      new Publication(testData);
    };
    const noPubType = () => {
      const testData = Object.assign({}, data);
      delete testData.pubType;
      new Publication(testData);
    };
    const noTitle = () => {
      const testData = Object.assign({}, data);
      delete testData.title;
      new Publication(testData);
    };

    expect(pub instanceof Document).toBe(true);
    expect(pub instanceof Publication).toBe(true);
    expect(pub.type).toBe('publication');
    expect(pub.categories).toBeDefined();
    expect(pub.date).toBeDefined();
    expect(pub.description).toBeDefined();
    expect(pub.links).toBeDefined();
    expect(pub.title).toBeDefined();
    expect(noDate).toThrow();
    expect(noDescription).toThrow();
    expect(noPubType).toThrow();
    expect(noTitle).toThrow();

  });

  it('Publication.prototype.pubType', function pubTypeAttr() {

    const pub = new Publication(data);

    const badPubType = () => {
      const testData = Object.assign({}, data);
      testData.pubType = 'bad type';
      new Publication(testData);
    };

    expect(badPubType).toThrow();

    expect(pub.pubType).toBe(data.pubType);
    pub.pubType = 'unpublished';
    expect(pub.pubType).toBe(data.pubType);

  });

  it('Publication.whitelist', function whitelistAttr() {

    const whitelist = Document.whitelist.concat([
      'categories',
      'date',
      'description',
      'html',
      'links',
      'markdown',
      'pubType',
      'title',
    ]);

    whitelist.forEach(attr => {
      expect(Publication.whitelist.includes(attr)).toBe(true);
    });

    const pub = new Publication(data);

    for (const attr in pub) {
      if (!whitelist.includes(attr)) fail(`The "${attr}" attribute is not whitelisted.`);
    }

  });

});
