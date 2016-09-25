/* eslint-disable no-underscore-dangle */

/**
 * A class representing a DocumentDB document
 * @class Document
 */
const Document = class Document {
  /**
   * Create a new Document
   * @param {Object} data           The document data
   * @param {String} [id]           The document ID
   * @param {String} type           The document type
   * @param {String} [_attachments] The attachments URL
   * @param {String} [_etag]        The document ETag
   * @param {String} [_rid]         The unique resource identifier of the document
   * @param {String} [_self]        The self-link for the document
   * @param {Integer} [_ts]         The timestampe for the document
   * @param {Integer} [ttl]         The time-to-live for the document
   */
  constructor(data = {}) {

    // document data must be an object
    if (typeof data !== 'object') throw new Error(`The "data" argument must be an Object.`);

    // string properties must be strings
    for (const attr in data) {
      if (typeof data[attr] !== 'string' && attr !== 'ttl' && attr !== '_ts') {
        throw new Error(`The '${attr}' attribute must be a string.`);
      }
    }

    // all documents must have a "type" attribute
    if (!data.type) throw new Error(`The "type" attribute is required.`);

    // 'ttl' must be an integer
    if (data.ttl && !Number.isInteger(data.ttl)) {
      throw new Error(`The 'ttl' attribute must be an integer.`);
    }

    // _ts must be an integer
    if (data._ts && !Number.isInteger(data._ts)) {
      throw new Error(`The '_ts' attribute must be an integer.`);
    }

    // copy over properties
    Object.assign(this, data);

    // make system properties read-only
    Document.whitelist.forEach(attr => {
      if (data[attr] && attr !== 'ttl') {
        Reflect.defineProperty(this, attr, {
          enumerable: true,
          value: data[attr],
        });
      }
    });

    // make the "ttl" attribute writable but not configurable
    Reflect.defineProperty(this, 'ttl', {
      enumerable: true,
      writable: true,
    });

  }

  static get whitelist() {
    return [
      'id',
      'type',
      '_attachments',
      '_etag',
      '_rid',
      '_self',
      '_ts',
      'ttl',
    ];
  }

};

module.exports = Document;
