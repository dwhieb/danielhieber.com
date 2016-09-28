/* eslint-disable object-property-newline */

const Document = require('../../models/document');

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
      id: 'newdoctest',
      type: 'test',
      testProperty: 'test value',
    };

    const doc = new Document(data);

    const configureID = () => {
      Object.defineProperty(doc, 'id', { writable: true });
    };

    const configureTTL = () => {
      Object.defineProperty(doc, 'ttl', { configurable: true });
    };

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

    expect(doc.testProperty).toBe(data.testProperty);
    expect(configureID).toThrow();
    expect(configureTTL).toThrow();
    expect(doc.ttl).toBe(-1);

    doc.id = 'newid';
    doc.ttl = 1;
    expect(doc.ttl).toBe(1);
    expect(doc.id).toBe(data.id);

    whitelist.forEach(attr => {
      expect(Document.whitelist.includes(attr)).toBe(true);
    });

  });

});
