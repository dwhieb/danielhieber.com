/* eslint-disable object-property-newline */

const Document = require('../../models/document');

const makeSubclass = props => {

  class Subclass extends Document {
    constructor(properties) {
      super({ type: 'test' }, properties);
    }
  }

  return new Subclass(props);

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

    const subclass = makeSubclass();

  });

});
