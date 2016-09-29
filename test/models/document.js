/* eslint-disable
  object-property-newline,
  no-useless-constructor,
*/

const Document = require('../../models/document');
const md = require('markdown').markdown;

const makeSubclass = (data, props) => {

  class Subclass extends Document {
    constructor(data, properties) {
      super(data, properties);
    }
  }

  return new Subclass(data, props);

};

describe('Document', function DocumentTest() {

  it('new Document()', function newDocument() {
    const badTimestamp = () => new Document({ type: 'test', _ts: new Date() });
    const badTTL = () => new Document({});
    const noData = () => new Document();
    const notObject = () => new Document(true);
    const notString = () => new Document({ type: 'test', id: 12345 });
    const noType = () => new Document({});

    expect(badTimestamp).toThrow();
    expect(badTTL).toThrow();
    expect(noData).toThrow();
    expect(notObject).toThrow();
    expect(notString).toThrow();
    expect(noType).toThrow();

    const data = {
      type: 'test',
      testProperty: 'test value',
    };

    const doc = new Document(data);

    expect(doc instanceof Document).toBe(true);
    expect(doc.testProperty).toBe(data.testProperty);

  });

  it('Document.prototype.id', function idAttr() {

    const data = {
      id: 'testid',
      type: 'test',
    };

    const doc = new Document(data);

    const configureID = () => {
      Object.defineProperty(doc, 'id', { writable: true });
    };

    doc.id = 'newid';

    expect(doc.id).toBe(data.id);
    expect(configureID).toThrow();

  });

  it('Document.prototype.ttl', function ttlAttr() {

    const data = { type: 'test' };
    const doc = new Document(data);

    const configureTTL = () => {
      Object.defineProperty(doc, 'ttl', { configurable: true });
    };

    expect(configureTTL).toThrow();

  });

  it('Document.prototype.type', function typeAttr() {

    const data = { type: 'test' };

    const doc = new Document(data);

    const configureType = () => {
      Object.defineProperty(doc, 'type', { value: 'newtype' });
    };

    expect(doc.ttl).toBeUndefined();
    expect(doc.type).toBe(data.type);
    expect(configureType).toThrow();

    doc.ttl = 1;
    expect(doc.ttl).toBe(1);

  });

  it('Document.whitelist', function whitelistAttr() {

    const whitelist = [
      'id',
      'type',
      '_attachments',
      '_etag',
      '_rid',
      '_self',
      '_ts',
      'ttl',
    ];

    whitelist.forEach(attr => {
      expect(Document.whitelist.includes(attr)).toBe(true);
    });

  });

  it('Subclass.categories', function categoriesAttr() {

    const data = {
      type: 'test',
      categories: ['test'],
    };

    const subclass = makeSubclass(data, 'categories');

    const nullCategories = () => {
      const data = { type: 'test', categories: null };
      makeSubclass(data, 'categories');
    };

    const emptyCategories = () => {
      const data = { type: 'test', categories: [] };
      makeSubclass(data, 'categories');
    };

    expect(subclass.categories).toBeDefined();
    expect(subclass.addCategory).toBeDefined();
    expect(subclass.hasCategory).toBeDefined();
    expect(subclass.removeCategory).toBeDefined();
    expect(subclass.categories.includes('test')).toBe(true);
    expect(emptyCategories).not.toThrow();
    expect(nullCategories).not.toThrow();

    subclass.addCategory('addCategory');
    subclass.removeCategory('test');
    expect(subclass.categories.includes('test')).toBe(false);
    expect(subclass.categories.includes('addCategory')).toBe(true);
    expect(subclass.hasCategory('test')).toBe(false);
    expect(subclass.hasCategory('addCategory')).toBe(true);

  });

  it('Subclass.description', function descriptionAttr() {

    const data = {
      type: 'test',
      description: 'This is a description.',
    };

    const subclass = makeSubclass(data, 'description');
    expect(Object.getOwnPropertyDescriptor(subclass, 'description').configurable).toBe(false);
    expect(Object.getOwnPropertyDescriptor(subclass, 'description').enumerable).toBe(false);
    expect(subclass.description).toBe(data.description);

    const newDescription = 'This is the new description.';

    const setBadDescription = () => { subclass.description = null; };

    subclass.description = newDescription;
    expect(subclass.description).toBe(newDescription);
    expect(subclass.markdown).toBe(newDescription);
    expect(subclass.html).toBe(md.toHTML(newDescription));
    expect(setBadDescription).toThrow();

    subclass.html = '<p></p>';
    expect(subclass.html).toBe(md.toHTML(newDescription));

    subclass.markdown = 'This is *emphatic*.';
    expect(subclass.markdown).toBe(newDescription);

  });

  it('Subclass.links', function linksAttr() {

    const data = {
      type: 'test',
      links: { webpage: 'http://danielhieber.com' },
    };

    const subclass = makeSubclass(data, 'links');

    expect(subclass.links).toBeDefined();
    expect(subclass.addLink).toBeDefined();
    expect(subclass.getLink).toBeDefined();
    expect(subclass.removeLink).toBeDefined();
    expect(Object.getOwnPropertyDescriptor(subclass, 'links').configurable).toBe(false);
    expect(Object.getOwnPropertyDescriptor(subclass, 'links').enumerable).toBe(true);
    expect(subclass.getLink('webpage')).toBe(data.links.webpage);

    const newLink = 'http://new.com';

    subclass.links.newLink = newLink;
    expect(subclass.links.newLink).toBeUndefined();

    subclass.links = {};
    expect(subclass.links.webpage).toBeDefined();

    subclass.addLink('newLink', newLink);
    expect(subclass.links.newLink).toBe(newLink);

    subclass.removeLink('newLink');
    expect(subclass.links.newLink).toBeUndefined();

    const setBadLinkName = () => { subclass.addLink(2, newLink); };
    const setBadUrl = () => { subclass.addLink('badUrl', 'badlink.com'); };

    expect(setBadLinkName).toThrow();
    expect(setBadUrl).toThrow();

  });

  it('Subclass.title', function titleAttr() {

    const data = {
      type: 'test',
      title: 'Title',
    };

    const subclass = makeSubclass(data, 'title');

    const setBadTitle = () => { subclass.title = 2; };

    expect(subclass.title).toBe(data.title);
    expect(Object.getOwnPropertyDescriptor(subclass, 'title').configurable).toBe(false);
    expect(Object.getOwnPropertyDescriptor(subclass, 'title').enumerable).toBe(true);
    expect(setBadTitle).toThrow();

  });

});
