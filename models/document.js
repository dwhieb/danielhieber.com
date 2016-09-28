/* eslint-disable no-underscore-dangle */

/**
 * A class representing a DocumentDB document
 * @class Document
 */
const Document = class Document {
  /**
   * Create a new Document
   * @param {Object} data                The document data
   * @param {String} [data.id]           The document ID
   * @param {String} data.type           The document type
   * @param {String} [data._attachments] The attachments URL
   * @param {String} [data._etag]        The document ETag
   * @param {String} [data._rid]         The unique resource identifier of the document
   * @param {String} [data._self]        The self-link for the document
   * @param {Integer} [data._ts]         The timestampe for the document
   * @param {Integer} [data.ttl]         The time-to-live for the document
   * @param {Array} [properties]         An array of the properties to add to the subclass.
   */
  constructor(data = {}, properties = []) {

    // document data must be an object
    if (typeof data !== 'object') throw new Error(`The "data" argument must be an Object.`);

    // convert "properties" argument to an array if needed
    const props = Array.isArray(properties) ? properties : [properties];

    // string properties must be strings
    Document.whitelist.forEach(attr => {
      if (
        attr in data
        && attr !== 'ttl'
        && attr !== '_ts'
        && typeof data[attr] !== 'string'
      ) {
        throw new Error(`The '${attr}' attribute must be a string.`);
      }
    });

    // all documents must have a "type" attribute
    if (!data.type) throw new Error(`The "type" attribute is required.`);

    // _ts must be an integer
    if (data._ts && !Number.isInteger(data._ts)) {
      throw new Error(`The "_ts" attribute must be an integer.`);
    }

    // variable for storing the TTL attribute
    let ttl = data.ttl;

    // define getter and setter for "ttl" attribute
    Object.defineProperty(this, 'ttl', {
      configurable: false,
      enumerable: true,
      get: () => ttl,
      set: val => {
        if (!Number.isInteger(val)) throw new Error(`"ttl" attribute must be an integer.`);
        ttl = val;
      },
    });

    // copy over properties
    Object.assign(this, data);

    // make system properties read-only
    Document.whitelist.forEach(attr => {
      if (data[attr] && attr !== 'ttl') {
        Object.defineProperty(this, attr, {
          value: data[attr],
          configurable: false,
          enumerable: true,
          writable: false,
        });
      }
    });

    // define properties on the subclass that have been specified in the "properties" argument
    props.forEach(property => {

      const prop = Array.isArray(property) ? property[0] : property;
      const args = Array.isArray(property) ? property.slice(1) : [];

      // property name must be a string or symbol
      if (typeof prop !== 'string') {
        throw new Error(`Property names in the "properties" argument must be strings.`);
      }

      switch (prop) {

        case 'title':
          Object.defineProperty(this, 'title', {
            configurable: false,
            enumerable: true,
            writable: true,
          });
          break;

        case 'whitelist': {

          const whitelist = args[0];

          Object.defineProperty(this.constructor, 'whitelist', {
            value: Document.whitelist.concat(whitelist),
            configurable: false,
            enumerable: false,
            writable: false,
          });

          break;

        }

        default:
          return;

      }

    });

  }

  /**
   * Document.whitelist
   * @method whitelist
   * @return {Array}            Returns an array of allowable properties
   */
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
