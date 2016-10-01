const Document = require('../../models/document');
const Media = require('../../models/media');

describe('Media', function MediaSpec() {

  const data = {
    author: 'Julie Cohen',
    date: '2016-10-1',
    publication: 'UC Santa Barbara Current',
    title: 'The three-minute challenge: Graduate student in linguistics goes on to compete in the first UC-wide competition on May 4',
  };

  it('new Media()', function newMedia() {

    const media = new Media(data);

    const noAuthor = () => {
      const testData = Object.assign({}, media);
      delete testData.author;
      new Media(testData);
    };
    const noDate = () => {
      const testData = Object.assign({}, media);
      delete testData.date;
      new Media(testData);
    };
    const noPub = () => {
      const testData = Object.assign({}, media);
      delete testData.publication;
      new Media(testData);
    };
    const noTitle = () => {
      const testData = Object.assign({}, media);
      delete testData.title;
      new Media(testData);
    };

    expect(media instanceof Document).toBe(true);
    expect(media instanceof Media).toBe(true);
    expect(media.author).toBeDefined();
    expect(media.categories).toBeDefined();
    expect(media.links).toBeDefined();
    expect(media.publication).toBeDefined();
    expect(media.title).toBeDefined();
    expect(noAuthor).toThrow();
    expect(noDate).toThrow();
    expect(noPub).toThrow();
    expect(noTitle).toThrow();

  });

  it('Media.prototype.date', function dateAttr() {

    const media = new Media(data);

    expect(media.date instanceof Date).toBe(true);
    expect(media.date).not.toBe(new Date(data.date));
    expect(media.date.toString()).toBe(new Date(data.date).toString());

    media.date = 2016;
    expect(media.date.toString()).toBe(new Date(2016).toString());
    media.date = '2016';
    expect(media.date.toString()).toBe(new Date('2016').toString());

  });

  it('Media.whitelist', function whitelistAttr() {

    const whitelist = Document.whitelist.concat([
      'author',
      'categories',
      'date',
      'links',
      'publication',
      'title',
    ]);

    whitelist.forEach(attr => {
      expect(Media.whitelist.includes(attr)).toBe(true);
    });

    const media = new Media(data);

    for (const attr in media) {
      if (!whitelist.includes(attr)) fail(`The "${attr}" attribute is not whitelisted.`);
    }

  });

});
